define(['Backbone', 'models/component'], function(Backbone, Component) {
	return Backbone.Collection.extend({
		url: '/api/components.json',
		model: Component,
        fetchSpecific: function(types, opts) {
            opts = opts || {};
            opts.url = this.url + '?types=' + types.join(',');

            return this.fetch.apply(this, [opts]);
        }
	});
});
