define(['Backbone', 'countdown'], function(backbone, counter) {
    return backbone.View.extend({
        tagName: 'tr',
        options: {
            environments: {}
        },
        success: false,
        failing: false,
        building: false,
        render: function() {
            var model = this.model,
                that = this;

            model.get('channels').on('change', function() {
                that.rebuild();
            });

            model.on('change', function() {
                that.rebuild();
            });

            this.$el.attr('id', 'componentlistitem-' + this.model.get('id'));

            that.rebuild();
        },
        rebuild: function() {
            var model = this.model,
                that = this,
                chan, version,
                buildState = this.model.get('lastBuildState'),
                name
            ;

            this.$el.empty();
            this.$el.append($('<th />').html(model.getCleanName()));

            for (i in this.options.environments) {
                version = false;
                chanName = this.options.environments[i].name;
                if (chanName === 'dev') {
                    version = this.model.get('version');
                } else {
                    chan = model.getVersionForChannel(this.options.environments[i]);
                }

                chan = model.getVersionForChannel(this.options.environments[i]);

                $cell = $('<td />').html('<span class="channelName">'+chanName+' - </span>' + (version ? version : (chan ? chan.getVersion() : 'N/A')));

                this.$el.append($cell);
            }

            if(buildState) {
                if(buildState.building) {
                    this.markAsBuilding();
                }else if(buildState.status === true) {
                    this.markAsSuccess();
                }else{
                    this.markAsFailing();
                }
            }
        },
        markAsBuilding: function() {
                this.success = false;
                this.failing = false;
            if(this.building === true) {
                return;
            }
            this.building = true;
            var that = this;
            this.$el.addClass('building');
            this.building = true;
        },
        markAsSuccess: function() {
            this.building = false;
            this.failing = false;

            if(this.success === true) {
                return;
            }

            this.success = true;
            this.$el.removeClass('building');
            this.$el.removeClass('fail');
            this.$el.addClass('success');
        },
        markAsFailing: function() {
            this.building = false;
            this.success = false;

            if(this.failing === true) {
                return;
            }

            this.failing = true;
            this.$el.removeClass('building');
            this.$el.removeClass('fail');
            this.$el.addClass('success');
        }
    });
});
