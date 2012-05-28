(function() {
    var dataSources = {
        "graphSummary"  : "http://trycatch.dev/api/issues/graph",
        "issues"        : "http://trycatch.dev/api/issues"
        }, 
        priorityStatus = ["normal", "panic", "worry", "normal", "normal", "noinfo"], // we only need to show differences for P1 and P2 status issues being in play.
        ajaxDataType = 'jsonp',
        $moduleName = "issues",
        useApi = window.$modules[$moduleName].api.use || true,
        $modules = $modules || window.$modules || {},
        $dash = $dash || $.getUrlVar('dash'),    
        $jsPaths = $jsPaths || window.$jsPaths || {},
        highest = highest || 5, // default to NO INFO, for when API is down
        HighCharts = HighCharts || {},
        issuesMeta = {'priority' : {'p1': 0, 'p2': 0, 'p3': 0, 'p4': 0}},
        issuesMarkup, issuesWrapperMarkup, issuesErrorMarkup, chart, graphData;

    if (!useApi) {
        dataSources.issues = 'fake_data/issues.js';
        dataSources.graphSummary = 'fake_data/graph.js';
        ajaxDataType = 'json';
    }

    function massageGraphData(issues) {
        /* massageGraphData will:
         * make sure that the information is presented by count of days, rather than count of status type
         */
        var x, y, z, p, d, countArr = {}, releaseDates = releaseDates || window.releaseDates || {};
        for (x in issues) {
            if (issues.hasOwnProperty(x)) {
                p = issues[x];
                for (y in p) {
                    if (p.hasOwnProperty(y)) {
                        d = p[y];
			countArr[y] = ( ((countArr[y]) ? countArr[y] : 0) + d);
			
                    }
                }
            }
        }
        graphData['dates'] = [];
        graphData['values'] = [];
        for (var a in countArr) {
            if (countArr.hasOwnProperty(a)) {
                if (typeof(countArr[a]) === 'number') {
                    issues.dates.push(a);
                    issues.values.push(countArr[a]);
                }
            }
        }
	if (releaseDates) {
		issues.releaseDates = []; //we are setting up for plot bands on the graph
		for (var b in releaseDates) {
			if (releaseDates.hasOwnProperty(b)) {
				var test = $.inArray(releaseDates[b].release_date.split(' ')[0], issues.dates);
				if (test > -1) {
					issues.releaseDates.push({'from' : (parseInt(test) - 0.5), 'to' : (parseInt(test) + 0.5), 'color' : 'rgba(178, 178, 0, 1)'});
				}
			}
		}
	}
	issues['releaseHours'] = [];
	for (var c in issues.values) {
		if (issues.values.hasOwnProperty(c)) {
			var mult = Math.floor(Math.random() * 10) +  2;
			issues.releaseHours.push((1 + issues.values[c]) * mult);
		}
	}
	console.log(issues);
	return issues;
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
                if (!issues[x].closedAt) { // if the call has a "closedAt" flag, then it is no longer open, so we ignore it.
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

    function renderGraph(graphData) {
	var openIssues = massageGraphData(graphData);

        openIssuesChart = new Highcharts.Chart({
            chart: {
		    alignTicks: false,
		    borderRadius: 10,
                renderTo: 'open_issues',
                backgroundColor: 'rgba(255,255,255,.50)',
                zoomType: 'x',
            },
	    colors: [
	    {linearGradient: [0,0,0,500], stops: [[0, 'rgba(255, 0, 178, 1)'], [10, 'rgba(255, 0, 178, 0.3)']]}
	    , 
	    {linearGradient: [0,0,0,500], stops: [[0, 'rgba(0, 0, 178, 0.4)'], [10, 'rgba(0, 0, 178, 1)']]}
	    ],
            plotOptions: {
                line: {
                    lineWidth: 1
                }
            },
            credits: false,
            title: {
		    text: null,
		    style: {
			    color: '#fff',
			    fontSize: 30,
			    fontWeight: 'bold'
		    }
		    },
            legend: {
		    enabled: false,
                borderWidth: null,
                symbolWidth: 100,
                itemStyle: {
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 20
                }
            },
            xAxis: {
		categories: openIssues.dates,
		tickInterval: 5, // show only every 5th day on the axis. This does not effect data shown on the graph.
		plotBands: openIssues.releaseDates,
		labels: {
			formatter: function() {
				var labelArr = this.value.split('-');
				return labelArr[2] + '/' + labelArr[1];
			}
		},
            },
            yAxis: [{ 
                title: {text: null},
		allowDecimals: false,
                plotLines: [{
                    color: 'rgba(255, 0, 178, 1)',
                    value: 72,
                    width: 3,
                    zIndex: 3,
		    y: -10,
                    label: {
                        text: 'Open for 72 Hours', // this should match the "value" outlined above
                        style: {
                            color: 'rgba(255, 255, 255, 1)',
                            fontSize: 20,
			    zIndex: 5,
			    fontWeight: 'bold'
                        }
                    }            
                }],
                gridLineWidth: 0, // turns off background lines... too confusing with the graph we are running
                gridLineColor: '#444',
                opposite: false
            }, {
                title: {text: null},
		allowDecimals: false,
                plotLines: [{
                    color: 'rgba(0, 0, 178, 1)',
                    value: 10,
                    width: 3,
                    label: {
                        text: '10 Open calls', // this should match the "value" outlined above
			align: 'right',
			x: -10,
			y: -10,
			zIndex: 5,
                        style: {
                            color: 'rgba(255, 255, 255, 1)',
			    fontWeight: 'bold',
                            fontSize: 20,
			    zIndex: 5
                        }
                    }            
                }],
                gridLineWidth: 0, // turns off background lines... too confusing with the graph we are running
                gridLineColor: '#444',
                opposite: true
            }],
            series: [{
                name: 'Open Hours',
                type: 'area',
		marker : {enabled : false},
		yAxis: 0,
                data: openIssues.releaseHours // this is currently having the hell massaged out of it.
            }, {
                name: 'Open Tickets',
                type: 'column',
		marker : {enabled : false},
		yAxis: 1,
                data: openIssues.values // this is currently having the hell massaged out of it.
	    }
	    ]
        });
    }

    function renderIssues(url, ajaxDataType, issuesType, templateToRender) {
        $.ajax({
            url: url,
            type: "GET",
            dataType: ajaxDataType,
	    jsonp: "_callback",
            success: function(data) {
                if (issuesType === 'table') {
                    openIssues = massageIssueData(data);
                    $('body').removeClass('noinfo, normal, panic, worry').addClass(priorityStatus[openIssues[0].priority]); // make the body class represent the highest current priority
                    issuesMarkup = tmpl(issuesTemplates[templateToRender], {'issues' : openIssues, 'issuesMeta': issuesMeta});
                } else if (issuesType === 'graph') {
                    graphData = data;
                }
            },
            error: function(one, two, three) {
                issuesErrorMarkup = tmpl(issuesTemplates.noIssues, {});        
            },
            complete: function() {
                if (issuesErrorMarkup) {
                    $('#tables').empty().css({'width': '90%', 'color': '#fff', 'margin' : '50px 0', 'padding' : '0 4%'}).append(issuesErrorMarkup).bigtext();
                    $('#graphs').empty().hide();
                } else {
                    if (issuesType === 'table') {
                        $('#tables').append(issuesMarkup);
                        renderIssues();
                        renderIssues(dataSources.graphSummary, ajaxDataType, 'graph');                  
                    } else if (issuesType === 'graph') {
                        renderGraph(graphData);
                    }
                }
            }
        });
    }

    Modernizr.load({
        load: {
            'css' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/central-tech_issues.css',
	    'dash' : $jsPaths.bundlePath + '/dash_config.js', // this is only here until the data is stored in the api || forever.
            'highcharts' :  $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/highcharts.js',
            'templates' : $jsPaths.bundlePath + $jsPaths.units + '/' + $dash + $jsPaths.modules + '/' + $moduleName + '/issues_templates.js' 
        },
        callback: {
            'css' : function() {},
	    'dash' : function() {},
            'highcharts' : function() {},
            'templates' : function() {
                issuesWrapperMarkup = tmpl(issuesTemplates.wrapper, {graphTitle : "Open Tickets & Average Open Time"});
                $('#' + $modules[$moduleName].placement).addClass('active').append(issuesWrapperMarkup);
                renderIssues(dataSources.issues, ajaxDataType, 'table', 'issuesTable');                  
             }
        }
    });

})();

