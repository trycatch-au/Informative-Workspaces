define(['collections/releases', 'collections/components', 'collections/channels', 'text!components/upcoming/templates/upcoming.tpl', 'countdown', 'components/base', 'text!components/upcoming/templates/settingsHtml.tpl'], function(ReleaseCollection, componentCollection, ChannelCollection, tpl, counter, baseComponent, settingsHtml) {
    var render = function(release, component) {
            return _.template(tpl, {
                release: release,
                componentName: component
            });
        },
        releases = new ReleaseCollection(),
        target,
        view,
        components = new componentCollection,
        environments = new ChannelCollection;



    var view = baseComponent.extend({
        name: 'upcoming',

        settings: {
            component: 'fatwire',
            channel: 'prod'
        },

        refresh: function() {
            var that = this;
            releases.getUpcoming(function(release) {
                that.getTarget().html(render(release, that.settings.component));
                //time to countdown in seconds, and element ID
                for (i in release.dates) {
                    counter.init($('#counter-' + i), release.dates[i].date);
                }
            }, that.settings.component);

            return this;
        },

        getSettingsForm: function() {
            var that = this;
            if(!this.$settings) {
                this.$settings = $(_.template(settingsHtml, {
                    components: [],
                    environments: []
                }));

                this.$settings.getValues = function() {
                    return {
                        channel: that.$settings.find('.environmentChoice').val(),
                        component: that.$settings.find('.componentChoice').val()
                    };
                }
            }

            components.fetch({
                success: function() {
                    var options = '';
                    components.forEach(function(component) {
                        options += '<option>' + component.get('name') + '</option>';
                    });

                    that.$settings.find('.componentChoice').empty().html(options);
                }
            });

            environments.fetch({
                success: function(envs) {
                    var options = '';
                    environments.forEach(function(environment) {
                        options += '<option>' + environment.get('name') + '</option>';
                    });

                    that.$settings.find('.environmentChoice').empty().html(options);
                }
            });

            return this.$settings;
        }
    });

    return new view();
});
