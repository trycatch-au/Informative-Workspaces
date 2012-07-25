define(['app', 'collections/components', 'text!components/components/templates/componentsList.tpl'], function(app, ComponentsCollection, tpl) {
	var render = function() {
			return _.template(tpl, {
				components: components.models,
				environments: app.getEnvironments()
			})
		},
		components = new ComponentsCollection(),
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
				console.log('asdasd');
				target.html(render());

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