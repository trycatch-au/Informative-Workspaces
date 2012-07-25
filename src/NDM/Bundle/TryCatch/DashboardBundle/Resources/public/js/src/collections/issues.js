define(['Backbone', 'models/issue'], function(Backbone, Issue) {
	return Backbone.Collection.extend({
		url: '/api/issues.json',
		model: Issue
	});
});