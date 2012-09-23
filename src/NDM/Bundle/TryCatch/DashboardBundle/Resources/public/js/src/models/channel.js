define(['Backbone', 'models/component', , 'models/componentchannel'], function(Backbone) {
	window.Channel = Backbone.RelationalModel.extend({
		relations: [{
	        type: Backbone.HasOne,
	        key: 'component',
	        relatedModel: 'ComponentChannel'
	    }]
	});

	return window.Channel;
});