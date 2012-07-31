define(['app', 'collections/components', 'components/components/views/list'], function(app, ComponentCollection, listView) {
	var render = function() {
			view.render();
			return this;
		},

		components = new ComponentCollection(),
		
		target,
		
		view = new listView({
			collection: components
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
				components.fetch({
					success: function() {
						me.refresh();
					}
				});

				return this;
			}
		};

	return me;
});