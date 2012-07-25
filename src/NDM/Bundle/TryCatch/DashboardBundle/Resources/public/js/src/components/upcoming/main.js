
define(['collections/releases', 'text!components/upcoming/templates/upcoming.tpl'], function(ReleaseCollection, tpl) {
	var render = function(release) {
			return _.template(tpl, {
				release: release
			})
		},
		releases = new ReleaseCollection(),
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
			releases.getUpcoming(function(release){ 
				target.html(render(release));
			});

			return this;
		},

		render: function() {
			this.refresh();	

			return this;
		}
	};
});