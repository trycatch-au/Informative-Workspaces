define(['Backbone', 'models/release'], function(Backbone, ReleaseDate) {
	return Backbone.Collection.extend({
		model: ReleaseDate,
		getUpcoming: function(cb) {
			$.get('/api/components/fatwire/releasedates.json', function(data) {
				data = data.pop();
				var obj = {
					dates: {
						codeFreeze: new Date(data.date),
						release: new Date(data.date),
					},

					name: '12R5',
					get: function(i) {
						return obj[i];
					}
				};
				cb(obj);
			});
		}
	});
});