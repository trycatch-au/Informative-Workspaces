define(['Backbone', 'models/issue'], function(Backbone, Issue) {
	return Backbone.Collection.extend({
		url: '/api/issues.json',
		model: Issue,
        initialize: function() {
            setInterval(function() {
                this.fetch
            }, refreshCounter);
        },

		getGraphData: function(cb) {
			$.get('/api/issues/graph.json', function(data) {
				cb(data);
			});
		},
		getAdvancedGraphData: function() {
			var me = this, grouped = {}, data = {

			};

			for(i in this.models) {
				if(!grouped[this.models[i].get('priority')]) {
					grouped[this.models[i].get('priority')] = [];
				}

				grouped[this.models[i].get('priority')].push(this.models[i]);
			}

			for(priority in grouped) {
				group = grouped[priority];
				if(!data[priority]) {
					data[priority] = {
						dates: {}
					};
				}

				for(i in group) {
					model = group[i];
					data[priority] = this.extractGraphData(model, data[priority]);
				}
			}

			return data;
		},
		getOpen: function() {
			var open = [], model;
			for(i in this.models) {
				model = this.models[i];
				if(!model.get('closedAt')) {
					open.push(model);
				}
			}

			return new Backbone.Collection(open);
		},

		extractGraphData: function(model, data) {
			if(typeof(data.dates[model.get('createdAt')]) === 'undefined') {
				data.dates[model.get('createdAt')] = {
					issues: [],
					stats: {}
				};
			}
			data.dates[model.get('createdAt')].issues.push(model);


			return data;
		}
	});
});
