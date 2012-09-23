define(['Backbone', 'models/channel', 'models/component'], function(Backbone, Channel, Component) {
    window.ComponentChannel = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasOne,
            key: 'channel',
            relatedModel: 'Channel'
        }, {
            type: Backbone.HasOne,
            key: 'component',
            relatedModel: 'Component'
        }],

        getVersion: function() {
            var version = this.get('version').replace('SNAPSHOT', '');

            return version;
        }

    });

    return window.ComponentChannel;
});
