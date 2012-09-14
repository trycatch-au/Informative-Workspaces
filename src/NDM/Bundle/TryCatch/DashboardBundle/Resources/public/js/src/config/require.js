requirejs.config({
    //To get timely, correct error triggers in IE, force a define/shim exports check.
    paths: {
        underscore:  ['../vendor/lodash'],
        text: ['../vendor/plugins/text'],
        Backbone:  ['../vendor/backbone'],
        dom:  ['../vendor/zepto'],
        lawnchair:  ['../vendor/lawnchair'],
        highcharts:  ['../vendor/highcharts-zepto/highcharts.src'],
        countdown:  ['../vendor/countdown'],
        bootstrap:  ['../vendor/bootstrap'],
        d8:  ['../vendor/D8']
    },
    shim: {
        highcharts: {
            deps: ['dom', '../vendor/highcharts-zepto/highcharts-zepto.src'],
            exports: 'Highcharts'
        }
    }
});
