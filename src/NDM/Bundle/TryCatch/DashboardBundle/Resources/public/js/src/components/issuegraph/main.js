define(['app', 'collections/issues', 'components/issuegraph/views/graph'], function(app, IssueCollection, graphView) {
	var render = function() {
			view.render();
			return this;
		},

		issues = new IssueCollection(),
		
		target,
		
		view = new graphView({
			collection: issues
		}),

		me = {
			setTarget: function(targ) {
				target = targ;
				me.getTarget().append(view.el);

				return this;
			},
			
			getTarget: function() {
				return target;
			},

			refresh: function() {
				render();

				return this;
			},

			render: function() {
				issues.fetch({
					success: function() {
						me.refresh();
					}
				});

				return this;
			}
		};

	return me;
});