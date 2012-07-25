define([], function() {
	var components;

	return {
		getComponents: function(cb) {
			require(['components/upcoming/main', 'components/components/main', 'components/issuelist/main', 'components/issuegraph/main'], function() {
				components = arguments;
				cb(arguments);
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