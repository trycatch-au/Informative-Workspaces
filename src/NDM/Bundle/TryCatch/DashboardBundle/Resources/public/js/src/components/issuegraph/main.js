define(['app', 'collections/issues', 'components/issuegraph/views/graph', 'components/base'], function(app, IssueCollection, graphView, BaseComponent) {
	var render = function() {

			view.render();
			return this;
		},
		issues = new IssueCollection(),
		view = new graphView({
			collection: issues
		}),
		component = BaseComponent.extend({
            name: 'issuegraph',
            onTargetSet: function() {

                this.getTarget().append(view.el);
            },

			refresh: function() {
                render();
                issues.fetch({
                    success: function() {
                        render();
                    }
                });

                return this;
			}
		}),
        target;

	return new component();
});
