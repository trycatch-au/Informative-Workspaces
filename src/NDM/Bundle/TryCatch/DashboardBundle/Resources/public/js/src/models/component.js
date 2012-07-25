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
	    		if(channel.get('channel').get('name').toLowerCase() === name.name.toLowerCase()) {
	    			return channel;
	    		}
	    	}


	    	return {get:function() {return 'Unknown'}};
	    }
	});

	return window.Component;
});