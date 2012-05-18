(function(){
    var dataSource = 'http://trycatch.dev/api/releases',
        $moduleName = 'releases',
        $modules = $modules || window.$modules || {},
        $dash = $dash || $.getUrlVar('dash'),
        $jsPaths = $jsPaths || window.$jsPaths || {},
        $releaseDates = {},
        releaseName = '',
        checkHighlight = function(periods) {
            if ($.countdown.periodsToSeconds(periods) <= 86400) {
                // When we're under a day to either countdown, add this highlight. 
                // A separate one will be added for expired countdowns.
                $(this).addClass('lastDay');
            } 
        },
        getDates = function(releaseDates) {
            var n, svnDate, prodDate, dayOrDays, releaseDates = releaseDates || {}, currDate = new Date(), compareDate, dayLayout = '';
            for (n in releaseDates) {
                if (releaseDates.hasOwnProperty(n)) {
                    compareDate = new Date.prototype.convertedDashDate(releaseDates[n].release_date);
                    if (compareDate >= currDate) { // we're not in the past for fatwire releases
                        releaseName = n;
                        svnTextDate = releaseDates[n].freeze_date;
                        break; // no need to keep going, this is the first date AFTER the current date.
                    }
                }
            }
            
            svnDate = new Date.prototype.convertedDashDate(svnTextDate);
            prodDate = compareDate;
            dayOrDays = (Math.floor((prodDate - currDate) / (1000 * 60 * 60 * 24)) === 1) ? "Day" : "Days";
            dayLayout = tmpl(releaseTemplates.dayLayout, {'dayVar': dayOrDays})

            $('#svn_build_deadline_time').countdown({
                until: svnDate,
                format: 'DHMS',
                alwaysExpire: true, // this will trigger the expiry class even if that threshold has passed.
                layout: dayLayout,
                onTick: checkHighlight,
                onExpiry: function() {$(this).addClass('expired');}
            });
            $('#prod_release_deadline_time').countdown({
                until: prodDate,
                format: 'DHMS',
                alwaysExpire: true, // this will trigger the expiry class even if that threshold has passed.
                layout: dayLayout,
                onTick: checkHighlight,
                onExpiry: function() {$(this).addClass('expired');}
            });
        };


    Modernizr.load({
        load: {
            'css' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/central-tech_release.css', 
            /* We need to load the CSS first because yepnope will run them in order of being received. 
             * This way the bigtext will not trigger at 100% width and be forced into ill-fitting css boxes after the fact.
             * Note: bigtext is included as a library, the templates were really the problem here
             */
            'dash' : $jsPaths.bundlePath + '/dash_config.js', // this is only here until we are getting the data from the api.  
            'templates' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/release_templates.js',
            'countdown' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/jquery.countdown.min.js'
        },
        callback : {
            'dash' : function() {}, // seems to be a weird bug with yepnope where anything declared above in the load section needs to be mirrored here.
            'templates' : 
                function () {
                    releaseWrapperMarkup = tmpl(releaseTemplates.wrapper, {'relDates': releaseDates});                
                    $('#' + $modules[$moduleName].placement).addClass('active').append(releaseWrapperMarkup); // placement is defined in the dashboard central config file, on a per section basis.
                },
            'countdown': 
                function() {
                    if (!releaseDates) {
                        releaseDateMarkup = tmpl(releaseTemplates.noInformation);
                        $('#next_release').html(releaseDateMarkup).css({'width': '90%', 'color': '#fff', 'margin' : '50px 0', 'padding' : '0 4%'}).bigtext();
                    } else {
                        releaseDateMarkup = tmpl(releaseTemplates.releaseDates);
                        $('#deadlines').append(releaseDateMarkup)
                        getDates(releaseDates);
                    }
                },
            'css' :  function() {}
        },
        complete : function() {
            $('#svn_build_deadline, #prod_release_deadline').bigtext({childSelector: 'dd'});                      
            $('#release_name').html('<div class="release_name">' + releaseName + '</div>').bigtext();
            if (releaseDates) {
            }
       }
    }); // this will be removed once we're getting everything from the API.
})();
