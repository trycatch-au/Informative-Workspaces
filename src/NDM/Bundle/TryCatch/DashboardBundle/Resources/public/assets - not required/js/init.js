var dataSources = {
    /* SEE: http://api.trycatch.com.au/app_dev.php/api/doc/ for full API documentation */
    "components"    : "http://informative.news.newslimited.local/api/components",
    "channels"      : "http://informative.news.newslimited.local/api/channels",
    "graphSummary" : "http://informative.news.newslimited.local/api/issues/graph"
},
    priorityStatus = ["normal", "panic", "worry", "normal", "normal", "noinfo"], // we only need to flag p1 or p2 issues.
    useApi = useApi,
    highest = highest || 5, // default to NO INFO... for when API is down.
    countdownDays,
    releaseName,
    releaseDates = releaseDates || '',
    $ = $ || {},
    prodTextDate,
    Highcharts = Highcharts || {},
    tmpl = tmpl || {},
    dashTemplates = dashTemplates || [],
    svnTextDate,
    apiSuffix = ".js",
    defcon = highest, // if nothing is returned from above script default to "all normal";
    bodyClass = priorityStatus[defcon],
    build = {},
    daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // this is for reporting purposes
    coreEnvironments = {
        "DEV": {
            "longName"  : "User Acceptance Testing",
            "classes"   : "latest truth first build"
        },
        "SIT1": {
            "longName"  : "SIT Environment 1",
            "classes"   : ""
        },
        "SIT2": {
            "longName"  : "SIT Environment 2",
            "classes"   : ""
        },
        "PC-UAT": {
            "longName"  : "Paid Content Test Environment",
            "classes"   : ""
        },
        "PROD" : {
            "longName"  : "Production",
            "classes"   : "prod"
        }
    }, // these will be static on the page. Others will scroll around.
    currDate = new Date(),
    compDate,
    chart,
    summaryLength = 7, // goes back one week from latest data
    graphSummaryData = {
        'labels' : [],
        'dataPoints' : {
            'p1' : [],
            'p2' : [],
            'p3' : [],
            'p4' : []
        }
    },
    dataDate,
    dataDay,
    $envLeader,
    $envItems,
    envMarkup,
    buildMarkup,
    sysMarkup,
    $envNames;
console.log("useapi: " + useApi);
if (!useApi) {
    document.write('<script type="text/javascript" src="channels.js"><' + '/script>');
    document.write('<script type="text/javascript" src="components.js"><' + '/script>');
    document.write('<script type="text/javascript" src="graph.js"><' + '/script>');
}

if (typeof console === "undefined") { // kill the console under unsupported browsers
    window.console = {
        log: function () {}
    };
}

function renderGraph(sm7GraphData) {
        if (sm7GraphData['1']) {
        $('#call_stats').removeClass('error');
        for (dataPoint in sm7GraphData['1']) {
            if (sm7GraphData['1'].hasOwnProperty(dataPoint)) {
                graphSummaryData.dataPoints.p1.push(sm7GraphData['1'][dataPoint]);
                dataDate = new Date(dataPoint); // x is the label of 
                dataDay = daysOfWeek[dataDate.getDay()];
                graphSummaryData.labels.push(dataDay + ' ' + dataDate.getDate() + '/' + (dataDate.getMonth() + 1) + '/' + dataDate.getFullYear()); // load up the correct day/date data. Only do this once.
            }
        }
        for (dataPoint in sm7GraphData['2']) {
            if (sm7GraphData['2'].hasOwnProperty(dataPoint)) {
                graphSummaryData.dataPoints.p2.push(sm7GraphData['2'][dataPoint]);
            }
        }
        for (dataPoint in sm7GraphData['3']) {
            if (sm7GraphData['3'].hasOwnProperty(dataPoint)) {
                graphSummaryData.dataPoints.p3.push(sm7GraphData['3'][dataPoint]);
            }
        }
        for (dataPoint in sm7GraphData['4']) {
            if (sm7GraphData['4'].hasOwnProperty(dataPoint)) {
                graphSummaryData.dataPoints.p4.push(sm7GraphData['4'][dataPoint]);
            }
        }
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'call_stats',
                backgroundColor: '#333',
                type: 'column',
                spacingTop: 5,
                spacingRight: 20,
                height: 500,
                borderRadius: 10
            },
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    color: '#fff'
                },
                symbolWidth: 50
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Open SM7 Tickets this week',
                align: 'center',
                margin: 20,
                style: {
                    color: '#fff',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                lineColor: '#464646',
                lineWidth: 1,
                gridLineColor: '#464646',
                categories: graphSummaryData.labels.slice(-summaryLength),
                plotBands: [{ // mark the current day
                    color: '#aaa',
                    from: 5.5,
                    to: 6.5,
                    zIndex: 2
                }],
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
                allowDecimals: false,
                alternateGridColor: '#3c3c3c',
                lineColor: '#464646',
                lineWidth: 1,
                gridLineColor: '#464646',
                gridLineWidth: 2,
                gridLineDashStyle: 'solid',
                showFirstLabel: false,
                min: 0,
                title: {
                    text: 'Total Calls',
                    rotation: 270,
                    style: {
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                labels: {
                    y: 15,
                    style: {
                               fontSize: '30px',
                               color: '#fff'
                           }
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: "40px"
                    }
                }
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            plotOptions: {
                series: {
                    groupPadding: 0,
                    marker: {
                        radius: 9
                    }
                },
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false,
                        style: {
                            fontSize: '30px',
                            color: '#efefef'
                        }
                    }
                }
            },
            series: [{
                name: 'Priority 1',
                data: graphSummaryData.dataPoints.p1.slice(-summaryLength),
                lineWidth: 11,
                color: 'f00'
            }, {
                name: 'Priority 2',
                data: graphSummaryData.dataPoints.p2.slice(-summaryLength),
                lineWidth: 11,
                color: 'darkorange'
            }, {
                name: 'Priority 3',
                data: graphSummaryData.dataPoints.p3.slice(-summaryLength),
                lineWidth: 11,
                color: '84c5eb'
            }, {
                name: 'Priority 4',
                data: graphSummaryData.dataPoints.p4.slice(-summaryLength),
                lineWidth: 11,
                color: 'lightsteelblue'
            }]
        });
    } else {
        $('#call_stats').addClass('error').html('Cannot retrieve SM7 call stats at the moment.');
    }// end of if sm7graphdata exist
}

function getSM7Summary() {
    $.ajax({
        url: dataSources.graphSummary + apiSuffix,
        type: "GET",
        jsonp: "_callback",
        dataType: "jsonp",
        success: function (data) {
            renderGraph(data);
        },
        error: function () {
            sm7GraphData = {"error": "Unable to retrieve graph data"};
        }
    });
}

function getGlobalComponents() { // get global components and their latest versions.
    $.ajax({
        url: dataSources.components + apiSuffix,
        type: "GET",
        jsonp: "_callback",
        dataType: "jsonp",
        success : function (data) {
            envTableMarkup = tmpl(dashTemplates.environmentsTable, {'components' : data, 'channels': coreEnvironments});
            envListMarkup = tmpl(dashTemplates.environmentsList, {'components' : data, 'channels': coreEnvironments});
            envInfoMarkup = tmpl(dashTemplates.environmentsList2, {'components' : data, 'channels': coreEnvironments});
        },
        error: function () {
            //components = {"error" : "Unable to retrieve Component Data"};
            envMarkup = tmpl(dashTemplates.noEnvironments, {});
        },
        complete: function () {
            $('#online_status_list').append(envListMarkup);
            $('#online_status_list').append(envInfoMarkup);
            $('#online_status_table').append(envTableMarkup);
        }
    });
}

$(document).ready(function () {
    var n,
        svnDate,
        prodDate,
        dayOrDays,
        dataPoint;

    if (useApi) {
        getGlobalComponents();
        getSM7Summary();
    } else {
        renderGraph(sm7GraphData);
        envListMarkup = tmpl(dashTemplates.environmentsList, {'channels': coreEnvironments, 'components': components});
        envInfoMarkup = tmpl(dashTemplates.environmentsList2, {'channels': coreEnvironments, 'components': components});
        envTableMarkup = tmpl(dashTemplates.environmentsTable, {'channels': coreEnvironments, 'components': components});
        $('#online_status_list').append(envListMarkup);
        $('#online_status_list').append(envInfoMarkup);
        $('#online_status_table').append(envTableMarkup);
    }

    $("body").addClass(bodyClass);

    for (n in releaseDates) { // cycle through all existing release dates to find the next one that occurs in the future
        if (releaseDates.hasOwnProperty(n)) {
            compDate = new Date(releaseDates[n].release_date);
            if (compDate >= currDate) { // we're not in the past for a fatwire release
                releaseName = n;
                svnTextDate = releaseDates[n].freeze_date;
                prodTextDate = releaseDates[n].release_date;
                break; // don't want to keep going once we get the earliest (next) match.
            }
        }
    }

    svnTextDate = svnTextDate || false;
    prodTextDate = prodTextDate || false;

    if (!svnTextDate) { // we have not received data from the API 
        $("#countdown_days").html('<span class="no_date">No Release Date Found</span>');
        $("#svn_build_deadline_time, #prod_release_deadline_time").html('<span class="no_date">Unknown</span>');
    } else {
        svnDate = new Date(svnTextDate.replace(/-/g, '/')); // need to replace '-' in dates with '/' for firefox
        prodDate = new Date(prodTextDate.replace(/-/g, '/')); // need to replace '-' in dates with '/' for firefox
        dayOrDays = (Math.floor((prodDate - currDate) / (1000 * 60 * 60 * 24)) === 1) ? "Day" : "Days";
        $("#countdown_days_inner").countdown({
            until: prodDate, // the date to count down to
            format: "D", // the information we want returned from the date object
            alwaysExpire: true, // if the date is already in the past, run the onExpiry method anyway
            //layout: '<span class="countdown_day_value">{dn}</span><span class="countdown_day_label">' + dayOrDays + '</span>', // the wrapper for the countdown
            layout: '<div>{dn} ' + dayOrDays + '</div>', // the wrapper for the countdown
            tickInterval: 14400, // how often we want this countdown to update itself. Default is 1 second. This value is currently 4 hours.
            onExpiry: function () { $(this).addClass('expired'); } // after the countdown is expired, what will happen.
        });
        $('#svn_build_deadline_time').countdown({
            until: svnDate,
            format: 'DHMS',
            alwaysExpire: true,
            layout: '{dn}days {hn}hrs {mn}mins',
            onExpiry: function () { $(this).addClass('expired'); }
        });
        $('#prod_release_deadline_time').countdown({
            until: prodDate,
            format: 'DHMS',
            alwaysExpire: true,
            layout: '{dn}days {hn}hrs {mn}mins',
            onExpiry: function () { $(this).addClass('expired'); }
        });
    }

    $('#online_status table tr').each(function () {
        $(this).find('td[class~=core]').insertAfter($(this).find('td.leader'));
    });

    $('#release_name').html('<div class="release_name">' + releaseName + '</div>');
    $('#release_name, #countdown_days').bigtext({maxfontsize: 120});

    $('#svn_build_deadline, #prod_release_deadline').bigtext({
        childSelector: 'dd, dt',
        maxfontsize: 40
    });
    $('#online_status_list ul.channel li').bigtext({maxfontsize:30, minfontsize:16});

            
});
