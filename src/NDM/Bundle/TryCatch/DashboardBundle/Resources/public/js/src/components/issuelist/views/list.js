define(['Backbone', 'dom'], function(Backbone, $) {
	var $tpl = $('<tbody />'), built = false;
	return Backbone.View.extend({
		tagName: 'table',
		className: 'issueList table',
		build: function() {
			var model, open;
			if(this.collection) {
				open = this.collection.getOpen();
				for (var i = open.length - 1; i >= 0; i--) {
					model = open[i];

					$row = $('<tr />');

					$row.append($('<td />').html(model.get('priority')));
					$row.append($('<td />').html(model.get('name')));

					$tpl.append($row);
				};
			}

			return this;
		},

		render: function() {
			if(!built) {
				$tpl.appendTo(this.$el);
				$header = $('<thead>');
				$row = $('<tr />');
				$row.append($('<th />').html('Priority'));
				$row.append($('<th />').html('Name'));
				$header.insertBefore($tpl).append($row);
				built = true;
			}

			this.build();

			return this;
		}
	});
});