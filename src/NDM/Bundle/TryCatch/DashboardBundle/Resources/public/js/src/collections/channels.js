define(['Backbone', 'models/channel'], function(Backbone, Channel) {
	return Backbone.Collection.extend({
		url: '/api/channels.json',
		model: Channel,
        fetchSpecific: function(types, opts) {
            opts = opts || {};
            opts.url = this.url + '?channels=' + types.join(',');

            return this.fetch.apply(this, [opts]);
        }
	});
});
