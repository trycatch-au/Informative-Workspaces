
define(['text!components/upcoming/templates/upcoming.tpl'], function(tpl) {
	var render = function() {
			return _.template(tpl, {
				releases: {
					upcoming: 'asd'
				}
			})
		},
		target;

	return {
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
			this.refresh();	

			return this;
		}
	};
});