define(['Backbone', 'models/componentchannel'], function(Backbone, ComponentChannel) {
	window.Component = Backbone.RelationalModel.extend({
	    relations: [{
	        type: Backbone.HasMany,
	        key: 'channels',
	        relatedModel: 'ComponentChannel'
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