var generateBattleResults = function (winnerName, loserName) {
    var winnerId;
    var loserId;

    for (var index in PB.LGAs) {
        if (winnerId && loserId) {
            break;
        }

        if (PB.LGAs[index].name === winnerName) {
            winnerId = PB.LGAs[index].id;
            continue;
        }
        else if (PB.LGAs[index].name === loserName) {
            loserId = PB.LGAs[index].id;
            continue;
        }
    }

    PB.BattleController.getBattle(winnerId, loserId);
};

$(document).ready(function () {

    radio("getBattle.done").subscribe(function (battleresult) {
        $("#app-main").html(PB.templates.battleFieldResultTemplate( ));
        PB.Controller.doBattle(battleresult);
    });

    // radio test.
    radio("getLocalAuthority.done").subscribe(function (data) {
        debugger;
    });

    var processUrlFragment = function() {

        if (PB.URL_FRAGMENTS.RUN_BATTLE.test( window.location.hash )) {
            var result = PB.URL_FRAGMENTS.RUN_BATTLE.exec(window.location.hash);

            if (result === undefined || result[1] === "" || result[2] === "") {
                window.location = "/#battle";
            }
            else {
                var winnerName = result[1].replace( "_", " " );
                winnerName = winnerName.replace( "%20", " " );
                var loserName = result[2].replace( "_", " " );
                loserName = loserName.replace( "%20", " " );
                $(".page-header h2").text(winnerName + " vs. " + loserName);

                generateBattleResults(winnerName, loserName);
            }

            highlightNav('battle-nav');

        } else if (PB.URL_FRAGMENTS.SHOW_LIVEABILITY.test( window.location.hash )) {
            highlightNav('liveability-nav');
            $( '#app-main' ).html( PB.templates.liveabilityIndexTemplate() );
            tableau._createNewVizesAndStartLoading();
        } else if (PB.URL_FRAGMENTS.WHO_WE_ARE.test( window.location.hash )) {
            highlightNav('about-nav');
            $( '#app-main' ).html( PB.templates.whoAreWeTemplate() );
        } else {
            $("#app-main").html(PB.templates.battleFieldStartTemplate());

            var $winnerList = $('#winning-suburb');
            var $loserList = $('#losing-suburb');
            PB.LGAs.forEach(function (item) {
                $('<option>', {value: item.id}).appendTo($winnerList).text(item.name);
                $('<option>', {value: item.id}).appendTo($loserList).text(item.name);
            });

            $winnerList.chosen();
            $loserList.chosen();

            var p = $("#gallery").portfolio({
                height: '70%', // gallery height
                loop: true,
                enableKeyboardNavigation: true, // enable / disable keyboard navigation (default: true)
                easingMethod: 'easeOutQuint', // other easing methods please refer: http://gsgd.co.uk/sandbox/jquery/easing/
                width: '100%', // gallery width in pixels or in percentage
                lightbox: false, // dim off other images, highlights only currently viewing image
                showArrows: true, // show next / prev buttons
                logger: false, // for debugging purpose, turns on/off console.log() statements in the script
                spinnerColor: '#000', // Ajax loader color
                offsetLeft: -4, // position left value for current image
                opacityLightbox: '0.2' // opacity of other images which are not active
            });
            p.init();

            $("#do-battle").click(function (e) {
                e.originalEvent.preventDefault();

                var winnerId = $winnerList.val(),
                    loserId = $loserList.val(),
                    winnerName,
                    loserName;

                for (var index in PB.LGAs) {
                    if (winnerName && loserName) {
                        break;
                    }

                    if (PB.LGAs[index].id === winnerId) {
                        winnerName = PB.LGAs[index].name;
                        continue;
                    }
                    else if (PB.LGAs[index].id === loserId) {
                        loserName = PB.LGAs[index].name;
                        continue;
                    }
                }

                $(".page-header h2").text(winnerName + " vs. " + loserName);

                PB.BattleController.getBattle(winnerId, loserId);
                winnerName = winnerName.replace( " ", "_" );
                loserName = loserName.replace( " ", "_" );
                window.location.href = "/" + PB.HASH_URL_TEMPLATE.replace("{good_key}", winnerName).replace("{bad_key}", loserName);
            });
            highlightNav('battle-nav');
        }

    };

    var highlightNav = function( id ) {
        $('#navbar').find('.navbar-link').removeClass("active");
        $('#' + id).addClass("active");
    };

    // make sure nothing happens prior to loading local authorities
    radio("getLocalAuthorities.done").subscribe(function () {
        processUrlFragment();
    });

    window.onhashchange = function(event) {
        event.preventDefault();
        processUrlFragment();
    };
    
    PB.LGAController.getLocalAuthorities();
});


