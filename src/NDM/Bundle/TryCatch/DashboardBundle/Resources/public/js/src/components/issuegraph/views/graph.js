define(['Backbone', 'dom', 'highcharts'], function(Backbone, $, highcharts) {
    var built = false,
        graph;
    return Backbone.View.extend({
        tagName: 'article',
        className: 'issueGraph',
        graphElId: 'issueGraphContainer',
        build: function() {
            return this;
        },

        buildGraph: function() {
            var dataSources = {
                "graphSummary": "/api/issues/graph.json",
                "issues": "/api/issues.json"
            },
                priorityStatus = ["normal", "panic", "worry", "normal", "normal", "noinfo"],
                // we only need to show differences for P1 and P2 status issues being in play.
                ajaxDataType = 'json',
                $moduleName = "issues",
                $jsPaths = $jsPaths || window.$jsPaths || {},
                highest = highest || 5,
                // default to NO INFO, for when API is down
                HighCharts = HighCharts || {},
                issuesMeta = {
                    'priority': {
                        'p1': 0,
                        'p2': 0,
                        'p3': 0,
                        'p4': 0
                    }
                },
                that = this,
                issuesMarkup, issuesWrapperMarkup, issuesErrorMarkup, chart, graphData;

            this.$el.append('<div id="issueGraphContainer" />');
            $.get('/api/average/open/time.json', function(days) {
                var xCategories = _.keys(days), yCategories = [], avgOpenTimes = [], amountOpen = [], lowRange = 0, highRange = 0, step = 1, avgOpenTime, amountOpen;

                // calculate our series data including the max/min range so we can draw our axis properly
                for(i in days) {
                    avgOpenTime = parseInt(((days[i].time / 60) / 60) / 24, 0) || 0;
                    openCount = parseInt(days[i].count, 0) || 0;
                    avgOpenTimes.push(avgOpenTime);
                    amountOpen.push(openCount);

                    highRange = Math.max(highRange, openCount, avgOpenTime);
                    lowRange = Math.min(lowRange, openCount, avgOpenTime);
                }
                range = highRange - lowRange;
                if(range > 10) {
                    step = Math.round(range / 10, 0);
                }

                chart1 = new Highcharts.Chart({
                    chart: {
                        renderTo: that.graphElId,
                        type: 'line'
                    },
                    title: {
                        text: 'Incidents'
                    },
                    xAxis: {
                        title: {
                            text: 'Days'
                        },
                        categories: xCategories
                    },
                    yAxis: {
                        title: {
                            text: 'Open Days / Amount Open'
                        },
                        tickInterval: step
                    },
                    series: [{
                        name: 'Average Open Days',
                        data: avgOpenTimes
                    }, {
                        name: 'Amounnt Open',
                        data: amountOpen
                    }]
                });
            })
        },

        render: function() {
            if (!built) {
                this.buildGraph();
            }

            this.build();

            return this;
        }
    });
});
