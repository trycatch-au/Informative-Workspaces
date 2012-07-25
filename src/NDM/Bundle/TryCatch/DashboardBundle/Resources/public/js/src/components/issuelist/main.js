define(['app', 'collections/issues', 'text!components/issuelist/templates/issueList.tpl'], function(app, IssueCollection, tpl) {
	var render = function() {
			return _.template(tpl, {
				issues: issues.models
			})
		},
		issues = new IssueCollection(),
		target,
		me = {
			setTarget: function(targ) {
				target = targ;

				return this;
			},
			
			getTarget: function() {
				return target;
			},

			refresh: function() {
				target.html(render());

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