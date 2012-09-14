define([
       'app',
       'collections/components',
       'collections/channels',
       'components/components/views/list',
       'text!components/components/views/settingsHtml.tpl',
       'components/base',
       'collections/components'
   ], function(
            app,
            ComponentCollection,
            ChannelCollection,
            listView,
            settingsHtml,
            BaseComponent
        ) {
    var render = function() {
            view.render();
            return this;
        },

        components = new ComponentCollection(),

        target,

        view = new listView({
            collection: components
        }),
        environments = new ChannelCollection(),
        compView = BaseComponent.extend({
            name: 'components',
            settings: {
                components: [],
                environments: []
            },
            refreshInterval: false,

            initialize: function() {
                var that = this;
                if(this.refreshInterval) {
                    clearInterval(this.refreshInterval);
                }

                this.refreshInterval = setInterval(function() {
                    that.refresh();
                }, refreshCounter);
            },

            refresh: function() {
                components.fetchSpecific(this.settings.components, {
                    add: true,
                    success: function() {
                        render();
                    }
                });

                return this;
            },
            onTargetSet: function() {
                this.getTarget().append(view.el);
            },


            getSettingsForm: function() {
                var that = this;
                if (!this.$settings) {
                    this.$settings = $(_.template(settingsHtml, {
                        components: [],
                        environments: []
                    }));

                    this.$settings.getValues = function() {
                        var components = [], channels = [];
                        $('.environmentChoice option').each(function(){
                            if(this.selected) {
                                channels.push($(this).val());
                            }
                        });

                        $('.componentChoice option').each(function(){
                            if(this.selected) {
                                components.push($(this).val());
                            }
                        });

                        return {
                            channels: channels,
                            components: components
                        };
                    }
                }

                new ChannelCollection().fetch({
                    success: function(envs) {
                        var options = '';
                        envs.forEach(function(environment) {
                            options += '<option value="' + environment.get('name') + '">' + environment.get('name') + '</option>';
                        });

                        that.$settings.find('.environmentChoice').empty().html(options);
                    }
                })

                new ComponentCollection().fetch({
                    success: function(components) {
                        var options = '';
                        components.forEach(function(component) {
                            options += '<option value="' + component.get('name') + '">' + component.get('name') + '</option>';
                        });

                        that.$settings.find('.componentChoice').empty().html(options);
                        setTimeout(that.refreshComponents, 1000);
                    }
                });

                return this.$settings;
            }
        });

    return new compView();
});
