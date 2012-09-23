define(['app', 'Backbone', 'dom'], function(app, Backbone, $) {
	return Backbone.View.extend({
		tagName: 'article',
		className: 'issueList table',
		build: function() {
			return this;
		},
        render: function() {
            return this;
        }
	});
});
