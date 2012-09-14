define(['app', 'collections/issues', 'components/issuelist/views/list', 'components/base'], function(app, IssueCollection, listView, BaseComponent) {
	var render = function() {
			view.render();
			return this;
		},

        issues = new IssueCollection(),

        target,

		view = new listView({
			collection: issues
		}),

		comp = BaseComponent.extend({
            name: 'issues',

			refresh: function() {
				render();

				return this;
			},

            onTargetSet: function() {
                this.getTarget().append(view.el);
            },

			render: function() {
                var me = this;
				issues.fetch({
					success: function() {
						render();
					}
				});
                setInterval(function() {
                    issues.fetch({add: true});
                }, refreshCounter);

				return this;
			}
		});

	return new comp();
});
