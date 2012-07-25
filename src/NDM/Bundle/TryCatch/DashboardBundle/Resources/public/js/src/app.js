define(['Backbone', 'config/router', 'config/dashboard'], function(Backbone, Router, dash) {
	var App = {
		initialize: function() {
		  Backbone.emulateJSON = true;
		  App.Router = new Router();

		  Backbone.history.start();
		},
		
		Router: {},

		getEnvironments: function() {
			return dash.getEnvironments();
		},
	};
	return App;
});;