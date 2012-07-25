define(['Backbone', 'models/release'], function(Backbone, ReleaseDate) {
	return Backbone.Collection.extend({
		model: ReleaseDate,
		getUpcoming: function(cb) {
			var obj = {
				dates: {
					codeFreeze: new Date(),
					release: new Date(),
				},

				name: '12R5',
				get: function(i) {
					return obj[i];
				}
			};
			cb(obj);
		}
	});
});