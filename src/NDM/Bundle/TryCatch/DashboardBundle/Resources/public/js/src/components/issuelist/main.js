define(['app', 'collections/issues', 'components/issuelist/views/list'], function(app, IssueCollection, listView) {
	var render = function() {
			view.render();
			return this;
		},
		issues = new IssueCollection(),
		target,
		view = new listView({
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