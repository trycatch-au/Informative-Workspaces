define(['Backbone', 'models/componentchannel', 'models/release'], function(Backbone, ComponentChannel, Release) {
    window.Component = Backbone.RelationalModel.extend({
        relations: [{
            type: Backbone.HasMany,
            key: 'channels',
            relatedModel: 'ComponentChannel'
        }, {
            type: Backbone.HasMany,
            key: 'releases',
            relatedModel: 'Release'
        }],

        getVersionForChannel: function(name) {
            var channels = this.get('channels').models, i;
            for(i in channels) {
                channel = channels[i];
                if(channel.get('channel').get('name').toLowerCase() === name.name.toLowerCase() && channel.get('version') !== 'Unknown.0') {
                    return channel;
                }
            }


            return false;
        },
        getCleanName: function() {
            var name = this.get('name');
            name = name.replace('news-centraltech-', '');
            name = name.replace(/-conf-dev([0-9]+)/, '$1')

            return name;
        },
        isFailing: function() {
            var state = this.get('lastBuildState');
            return state && (state.building !== true && state.status !== true);
        }
    });

    return window.Component;
});
