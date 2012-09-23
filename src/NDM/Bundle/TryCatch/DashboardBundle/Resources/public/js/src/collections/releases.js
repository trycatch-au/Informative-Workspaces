define(['Backbone', 'models/release', 'date'], function(Backbone, ReleaseDate, date) {
	return Backbone.Collection.extend({
		model: ReleaseDate,
		getUpcoming: function(cb, component, channel) {
            var that = this;
			$.get('/api/components/' + component + '/releasedates.json', function(data) {
                if(data.length === 0) {
                    return;
                }

                data = data.pop();


				var obj = {
					dates: {
						codeFreeze: new date(data.freezeDate),
						release: new date(data.date)
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
