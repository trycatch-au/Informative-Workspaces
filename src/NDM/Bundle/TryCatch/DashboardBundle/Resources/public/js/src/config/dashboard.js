define([], function() {
	var components;

	return {
		getComponents: function(cb) {
			require(['components/upcoming/main', 'components/components/main'], function() {
				components = arguments;
				cb(components);
			})
			return components;
		},
		getEnvironments: function() {
			return [
				{name: 'dev'},
				{name: 'uat'},
				{name: 'sit1'},
				{name: 'sit2'},
				{name: 'prod'}
			];
		}
	};
});