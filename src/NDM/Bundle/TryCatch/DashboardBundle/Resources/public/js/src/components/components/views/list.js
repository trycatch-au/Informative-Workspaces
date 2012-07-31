define(['app', 'Backbone', 'dom'], function(app, Backbone, $) {
	var $tpl = $('<tbody />'), built = false;
	return Backbone.View.extend({
		tagName: 'table',
		className: 'issueList table',
		build: function() {
			var model, models, $row;
			if(this.collection) {
				models = this.collection.models;
				for(i in models) {
					if(!models.hasOwnProperty(i)) {
						continue;
					}
					model = models[i];

					$row = $('<tr />');
					$row.append($('<td />').html(model.get('name')));

					for(i in app.getEnvironments()) {
						$cell = $('<th />').html(model.getVersionForChannel(app.getEnvironments()[i]).get('version'));	
						$row.append($cell);	
					}

					$tpl.append($row);
				};
			}

			return this;
		},

		render: function() {
			if(!built) {
				$header = $('<thead>');
				$row = $('<tr />');

				$row.append($('<th />').html('Component'));	
				for(i in app.getEnvironments()) {
					$row.append($('<th />').html(app.getEnvironments()[i].name));	
				}

				$header.insertBefore($tpl).append($row);

				this.$el.append($header);
				this.$el.append($tpl);

				built = true;
			}

			this.build();

			return this;
		}
	});
});