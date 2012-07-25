define(['Backbone', 'config/dashboard'], function(Backbone, dashboard) {
	var $el = $('<section />'), component;
	function render(components) {
		$el.empty();
	  	for(i in components) {
	  		component = components[i];
	  		if(!component.getTarget()) {
	  			component.setTarget($('<section class="module" />'));
	  		}
	  		$el.append(component.getTarget());
	  		component.render();
	  	}
	}
	$el.appendTo($('#content'));

	return Backbone.Router.extend({
	  routes: {
	    "": "dash"
	  },

	  dash: function() {
	  	dashboard.getComponents(render);
	  }
	});
});