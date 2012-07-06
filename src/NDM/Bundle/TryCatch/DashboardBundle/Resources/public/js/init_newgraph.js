var dataSources = {
    /* SEE: http://api.trycatch.com.au/app_dev.php/api/doc/ for full API documentation */
        "components"    : "http://informative.news.newslimited.local/api/components",
        "channels"      : "http://informative.news.newslimited.local/api/channels",
        "graphSummary"  : "http://informative.news.newslimited.local/api/issues/graph",
        "issues"        : "http://informative.news.newslimited.local/api.issues"
    },
    priorityStatus = ["normal", "panic", "worry", "normal", "normal", "noinfo"], // we only need to flag p1 or p2 issues.
    useApi = useApi,
    highest = highest || 5, // default to NO INFO... for when API is down.
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
    graphIssues = {},
    graphData = {},
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
    $envNames,
    issuesMeta = {'priority' : {'p1': 0, 'p2': 0, 'p3': 0, 'p4': 0}};
    console.log("UseApi: " + useApi);
if (!useApi) {
    document.write('<script type="text/javascript" src="fake_data/channels.js"><' + '/script>');
    document.write('<script type="text/javascript" src="fake_data/components.js"><' + '/script>');
    document.write('<script type="text/javascript" src="fake_data/graph.js"><' + '/script>');
    document.write('<script type="text/javascript" src="fake_data/issues.js"><' + '/script>');
}

if (typeof console === "undefined") { // kill the console under unsupported browsers
    window.console = {
        log: function () {}
    };
}
if (typeof Date === "function") {
    Date.prototype.convertedDashDate = function (dateString) {
        /* the data that comes from the API is a date format that is incompatible with a lot of 
         * built in date parsers.
         * This replaces the dashes with a forward slash that seems to work globally 
         * For some reason, globally overriding the Date object is seen as a bad idea :P
         */
        return new Date(dateString.replace(/-/g, '/'));
    }
}

function renderGraph() {
        openIssuesChart = new Highcharts.Chart({
            chart: {
                renderTo: 'open_issues',
                backgroundColor: 'rgba(0,0,0,.20)',
                zoomType: 'x',
                marginRight: 50,
                marginLeft: 0,
                spacingLeft: 0,
                spacingRight: 0
            },
plotOptions: {
line: {
    lineWidth: 6
    },
marker: {
    enabled: false
}
},
            
            credits: false,
            title: {
                text: null,
                align: 'left',
                floating: true,
                style: {
                    color: '#fff',
                }
            },
            legend: {
                floating: true,
                borderWidth: null,
                symbolWidth: null,
                x: 180,
                y: -180,
                itemStyle: {
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 20
                }
            },
xAxis: {
    labels: {
        enabled: false
    },
gridLineWidth : null,
                lineWidth: null,
                tickWidth: null,
},
            yAxis: { 
                title: {
                    text: null,
                },
                plotLines: [{
                    color: '#aaa',
                    value: 10,
                    width: 3,
                    zIndex: 3,
                    label: {
                        text: '10', // this should match the "value" outlined above
                        align: 'right',
                        textAlign: 'left',
                        x: 0,
                        y: 10,

                        style: {
                            color: '#fff',
                            fontSize: 30
                        }
                    }            
                    
                }],
                gridLineWidth: 0, // turns off background lines... too confusing with the graph we are running
                gridLineColor: '#444',
                labels: {
                    enabled: false,
                },
                opposite: false
            },
            series: [{
                name: 'Tickets',
                color: '#fff',
                type: 'line',
                data: graphIssues.values // this is currently having the hell massaged out of it.
            }]
        });



        openHoursChart = new Highcharts.Chart({
            chart: {
                renderTo: 'open_hours',
                backgroundColor: 'rgba(0,0,0,.20)',
                zoomType: 'x',
                marginRight: 50,
                marginLeft: 0,
                spacingLeft: 0,
                spacingRight: 0,
                lineWidth: 3
                
            },
plotOptions: {
line: {
    lineWidth: 6
    }
},
            credits: false,
            title: {
                text: null,
                align: 'left',
                floating: true,
                style: {
                    color: '#fff',
                }
            },
            legend: {
                floating: true,
                borderWidth: null,
                symbolWidth: null,
                x: 180,
                y: -180,
                itemStyle: {
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 20
                }
            },
xAxis: {
    labels: {
        enabled: false
    },
gridLineWidth : null,
                lineWidth: null,
                tickWidth: null,
},
            yAxis: [{ // Primary yAxis
                showFirstLabel: false,
                labels: {
                    enabled: false,
                    formatter: function() {
                        return this.value +' days';
                    },
                    style: {
                        color: '#89A54E'
                    }
                },
                plotLines: [{
                    color: '#aaa',
                    value: 3,
                    width: 3,
                    zIndex: 3,
                    label: {
                        text: '3', // this should match the "value" outlined above
                        align: 'right',
                        textAlign: 'left',
                        x: 5,
                        y: 10,
                        style: {
                            color: '#fff',
                            fontSize: 30
                        }
                    }            
                }],
                gridLineWidth: 0,
                title: {
                    text: null,
                    style: {
                        color: '#89A54E'
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: null,
                    style: {
                        color: '#4572A7'
                    }
                },
                plotLines: [{
                    color: '#fff',
                    value: 110,
                    width: 1,
                    zIndex: 5,
                    label: {
                        text: '3',
                        textAlign: 'left',
                        align: 'left',
                        x: 0,
                        style: {
                            color: '#fff',
                            fontSize: 10
                        }
                    }            
                    
                }],
                gridLineWidth: 1, // turns off background lines... too confusing with the graph we are running
                gridLineColor: '#444',
                labels: {
                    enabled: false,
                    formatter: function() {
                        return this.value +' tickets';
                    },
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: false
            }],
            tooltip: {
                formatter: function() {
                    return ''+
                        this.x +': '+ this.y +
                        (this.series.name == 'Tickets' ? ' tickets' : ' days open');
                }
            },
            series: [{
                name: 'Days',
                color: '#fff',
                type: 'line',
                data: [1, 2, 3, 4, 2, 3, 1, 4, 2, 3, 4, 2, 1, 5, 6, 3, 2, 1, 1, 2, 3, 4, 2, 3, 1, 4, 2, 3, 4, 2, 1, 5]
            }]
        });
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
            issuesMarkup = tmpl(dashTemplates.environmentsList2, {'issues' : data});
        },
        error: function () {
            //components = {"error" : "Unable to retrieve Component Data"};
            envMarkup = tmpl(dashTemplates.noEnvironments, {});
        },
        complete: function () {
            $('#online_status_list').append(envListMarkup);
            $('#online_status_list').append(envInfoMarkup);
            $('#online_status_table').append(envTableMarkup);
            $('#tables').append(issuesMarkup);
        }
    });
}

function massageGraphData(issues) {
    /* massageGraphData will:
     * make sure that the information is presented by count of days, rather than count of status type
     */
    var x, y, z, p, d;
    for (x in issues) {
        if (issues.hasOwnProperty(x)) {
            p = issues[x];
            for (y in p) {
                if (p.hasOwnProperty(y)) {
                    d = p[y];
                    for (z in d) {
                        if (d.hasOwnProperty(z)) {
                            graphData[z] = ( ((graphData[z]) ? graphData[z] : 0) + d[z]);
                        }
                    }
                }
            }
        }
    }
    graphData['dates'] = [];
    graphData['values'] = [];
    for (var a in graphData) {
        if (graphData.hasOwnProperty(a)) {
            if (typeof(graphData[a]) === 'number') {
                graphData.dates.push(a);
                graphData.values.push(graphData[a]);
            }
        }
    }
    return graphData;
}

function massageIssueData(issues, issueMeta) {
    /* massageIssueData will: 
     * take the raw issue information that comes in, take out all the closed tickets (we only need them for historical information), 
     * sort the data in order of priority, 
     * and populate the meta information around open time and priority counts 
     */
    var x, y, z, openIssues=[], currDate = new Date(), openDate, dateCounter = [], dateCount = 0;
    for (x in  issues) {
        if (issues.hasOwnProperty(x)) {
            if (!issues[x].closedAt) {
                openIssues.push(issues[x]);
            }
        }
    }
    openIssues.sort(function(a, b){
        var elA=a.priority, elB=b.priority;
        if (elA < elB) { //sort string ascending
            return -1; 
        }
        if (elA > elB) {
            return 1;
        }
        return 0 //default return value (no sorting)
    });
    for (y in openIssues) { // generates counts of call priority
        if (openIssues.hasOwnProperty(y)) {
            openDate = new Date.prototype.convertedDashDate(openIssues[y].createdAt.date);
            dateCounter.push(Math.round((currDate.getTime() - openDate.getTime())/(1000*60*60))); // we really only need a close enough guess... 10 decimal points was a bit much.
            issuesMeta.priority['p' + openIssues[y].priority]++; 
        }
    }
    for (z in dateCounter) {
        dateCount = (dateCount + dateCounter[z]); // get a total of all of the items from the object
    }
    issuesMeta['avg'] = (dateCount/dateCounter.length); // average time that calls were open
    return openIssues;
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

        openIssues = massageIssueData(issues);
        graphIssues = massageGraphData(sm7GraphData);

        renderGraph(sm7GraphData);

        envListMarkup = tmpl(dashTemplates.environmentsList, {'channels': coreEnvironments, 'components': components});
        envInfoMarkup = tmpl(dashTemplates.environmentsList2, {'channels': coreEnvironments, 'components': components});
        envTableMarkup = tmpl(dashTemplates.environmentsTable, {'channels': coreEnvironments, 'components': components});

        issuesMarkup = tmpl(dashTemplates.issuesTable, {'issues' : openIssues, 'issuesMeta' : issuesMeta});
        $('#online_status_list').append(envListMarkup);
        $('#online_status_list').append(envInfoMarkup);
        $('#online_status_table').append(envTableMarkup);
        $('#online_status_table table tr:nth-child(odd), ul.environments li:nth-child(even), ul.channel li:nth-child(even)').addClass('alpha30');
        $('#tables').append(issuesMarkup);
    }

    $("body").addClass(bodyClass);


    for (n in releaseDates) { // cycle through all existing release dates to find the next one that occurs in the future
        if (releaseDates.hasOwnProperty(n)) {
            compDate = new Date.prototype.convertedDashDate(releaseDates[n].release_date);
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
        $("#svn_build_deadline_time, #prod_release_deadline_time").html('<span class="no_date">Unknown</span>');
    } else {
        svnDate = new Date.prototype.convertedDashDate(svnTextDate);
        prodDate = new Date.prototype.convertedDashDate(prodTextDate);
        dayOrDays = (Math.floor((prodDate - currDate) / (1000 * 60 * 60 * 24)) === 1) ? "Day" : "Days";
        var dayLayout = '{dn}days <span>{hn}hrs {mn}mins {sn}seconds</span>';
        $('#svn_build_deadline_time').countdown({
            until: svnDate,
            format: 'DHMS',
            alwaysExpire: true,
            layout: dayLayout,
            onExpiry: function () { $(this).addClass('expired'); }
        });
        $('#prod_release_deadline_time').countdown({
            until: prodDate,
            format: 'DHMS',
            alwaysExpire: true,
            layout: dayLayout,
            onExpiry: function () { $(this).addClass('expired'); }
        });
    }

    $('#online_status table tr').each(function () {
        $(this).find('td[class~=core]').insertAfter($(this).find('td.leader'));
    });

    $('#release_name').html('<div class="release_name">' + releaseName + '</div>').bigtext();


    $('#svn_build_deadline, #prod_release_deadline').bigtext({
        childSelector: 'dd'
    });

            
});
