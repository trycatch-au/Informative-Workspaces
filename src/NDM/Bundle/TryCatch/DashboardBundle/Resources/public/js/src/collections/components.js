define(['Backbone', 'models/component'], function(Backbone, Component) {
	return Backbone.Collection.extend({
		url: '/api/components.json',
		model: Component
	});
});