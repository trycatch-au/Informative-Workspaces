define(['Backbone', 'dom', 'highcharts'], function(Backbone, $, highcharts) {
    var built = false,
        graph;

    function getGraph(that) {
        if (!graph) {
            graph = new Highcharts.Chart({
                chart: {
                    renderTo: 'issueGraphContainer',
                    type: 'line',
                    zoomType: 'x',
                    events: {
                        click: function() {
                            this.xAxis[0].setExtremes();
                        }
                    }
                },
                title: {
                    text: 'Incidents'
                },
                xAxis: {
                    title: {
                        text: 'Days'
                    },
                    categories: []
                },
                yAxis: {
                    title: {
                        text: 'Open Days / Amount Open'
                    }
                },
                series: [{
                    name: 'Average Open Days',
                    data: []
                }, {
                    name: 'Amount Open',
                    data: []
                }]
            });
            $(window).on('resize orientationchange', function() {
                graph.setSize(
                    that.$el.width(),
                    that.$el.height(),
                    false
                );
            })
        }

        return graph;
    }

    return Backbone.View.extend({
        tagName: 'article',
        className: 'issueGraph',
        build: function() {
            return this;
        },

        buildGraph: function() {
            var that = this;

            if(this.$el.find('#issueGraphContainer').length === 0) {
                this.$el.append('<div id="issueGraphContainer" class="heightel" />');
            }
            setInterval(this.reloadGraph, refreshCounter);
            this.reloadGraph();
        },

        reloadGraph: function() {
            var that = this;
            $.get('/api/average/open/time.json', function(days) {
                var xCategories = _.keys(days),
                    yCategories = [],
                    avgOpenTimes = [],
                    amountOpen = [],
                    lowRange = 0,
                    highRange = 0,
                    step = 1,
                    avgOpenTime = 0,
                    i = 0;


                // calculate our series data including the max/min range so we can draw our axis properly
                for (i in days) {
                    if (days.hasOwnProperty(i)) {

                        avgOpenTime = parseInt(((days[i].time / 60) / 60) / 24, 0) || 0;
                        openCount = parseInt(days[i].count, 0) || 0;
                        avgOpenTimes.push(avgOpenTime);
                        amountOpen.push(openCount);

                        highRange = Math.max(highRange, openCount, avgOpenTime);
                        lowRange = Math.min(lowRange, openCount, avgOpenTime);
                    }
                }
                range = highRange - lowRange;
                if (range > 10) {
                    step = Math.round(range / 10, 0);
                }
                graph = getGraph(that);
                graph.axes[0].setCategories(xCategories);
                graph.axes[1].tickInterval = step;
                graph.series[0].setData(avgOpenTimes);
                graph.series[1].setData(amountOpen);
                graph.redraw();
            });
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
