define(['Backbone'], function(Backbone) {
	window.Issue = Backbone.RelationalModel.extend({
		getPriority: function() {
			return this.get('priority');
		},
		
		getName: function() {
			return this.get('name');
		},

		getPriorityString: function() {
			var priority = this.getPriority(),
				priorities = {
					1: 'important',
					2: 'warning',
					3: 'default',
					4: 'info'
				};

			return priority >= 1 && priority <= 4 ? priorities[priority] : 'inverse';
		}
	});

	return window.Issue;
});