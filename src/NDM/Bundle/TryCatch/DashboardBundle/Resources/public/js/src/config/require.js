requirejs.config({
    //To get timely, correct error triggers in IE, force a define/shim exports check.
    paths: {
        underscore:  ['../vendor/lodash'],
        text: ['../vendor/plugins/text'],
        Backbone:  ['../vendor/backbone'],
        dom:  ['../vendor/zepto'],
        lawnchair:  ['../vendor/lawnchair']
    },
    shim: {
    }
});