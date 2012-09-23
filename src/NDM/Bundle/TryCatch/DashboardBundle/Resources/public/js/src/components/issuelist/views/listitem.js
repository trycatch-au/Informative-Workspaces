define(['Backbone', 'countdown', 'date'], function(backbone, counter, date) {
    return backbone.View.extend({
        tagName: 'tr',
        render: function() {
            var that = this;
            this.model.on('change', function() {
                that.build();
            });

            this.build();;
        },
        build: function() {
            this.$el.empty();
            this.$el.attr('class', 'priority-' + this.model.get('priority'));

            $openSince = $('<td />').html(this.make('div', {}, (this.model.get('createdAt') || '')));

            if(this.model.get('createdAt')) {
                console.log(new date(this.model.get('createdAt')));
                counter.init($openSince.find('div'), new date(this.model.get('createdAt')), true);
            }

            this.$el.append($('<td />').append($('<div />').html('P' + (this.model.get('priority') + "")).addClass('priority priority-' + this.model.getPriorityString())));
            this.$el.append($('<td />').html(this.make('div', {}, this.model.get('name'))));
            this.$el.append($openSince);
        }
    });
});
