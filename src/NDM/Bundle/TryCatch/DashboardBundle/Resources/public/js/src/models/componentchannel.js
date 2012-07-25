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
	    
	});

	return window.ComponentChannel;
});