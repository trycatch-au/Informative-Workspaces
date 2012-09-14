define(['Backbone'], function(backbone) {
    var Component = function(name) {

        this.initialize();

        return this;
    };

    Component.extend = backbone.Model.extend;

    return Component.extend({
        target: null,
        settings: {},

        getTarget: function() {
            return this.target;
        },

        initialize: function() {},

        setTarget: function(target) {
            this.target = target;
            this.onTargetSet();

            return this;
        },

        onTargetSet: function() {
            return this;
        },

        render: function() {
            this.refresh();

            return this;
        },

        refresh: function() {
            throw new Error("Please define the 'refresh' method to render your component");
        },
        getSettingsHtml: function() {
            return '<p>No settings available</p>';
        }
    });
});
