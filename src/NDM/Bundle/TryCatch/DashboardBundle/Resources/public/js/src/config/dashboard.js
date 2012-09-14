define(['lawnchair', 'underscore'], function(lawnchair, _) {
    var defaultComponents = ['components/upcoming/main', 'components/components/main', 'components/issuegraph/main', 'components/issuelist/main', 'components/chooser/main'],
        defaultSettings = {},
        configStore, compName, availableComponents = defaultComponents,
        i;

    configStore = new lawnchair({
        name: 'configStore'
    }, function() {
        this.get('components', function(components) {
            if (!components) {
                this.save({
                    key: 'components',
                    components: defaultComponents,
                    settings: defaultSettings
                });
            }
        });
    });
    for (i in availableComponents) {
        if (availableComponents.hasOwnProperty(i)) {
            compName = availableComponents[i];

            if (!defaultSettings[compName]) {
                defaultSettings[compName] = {};
            }
        }
    }

    return {
        availableComponents: availableComponents,
        getComponents: function(cb, names) {
            names = names === undefined ? false : names;

            configStore.get('components', function(components) {
                if (names === true) {
                    console.log('Found ', components);
                    cb(components.components);
                    return;
                }

                require(components.components, function() {
                    var i = 0,
                        args = _.toArray(arguments);
                    for (i in args) {
                        if (args.hasOwnProperty(i)) {
                            args[i].settings = _.extend(args[i].settings, (components.settings[components.components[i]] || {}));
                        }
                    }

                    cb(args);
                });
            });
        },

        getEnvironments: function() {
            return [{
                name: 'dev'
            }, {
                name: 'uat'
            }, {
                name: 'sit1'
            }, {
                name: 'prod'
            }];
        },

        removeComponent: function(component) {
            configStore.get('components', function(components) {
                var has = false,
                    i = 0;
                for (i in components.components) {
                    if (components.components.hasOwnProperty(i)) {
                        if (components.components[i] === component) {
                            has = true;
                        }
                    }
                }
                if (has) {
                    components.components = _.without(components.components, component);
                }

                configStore.save(components, function() {
                    location.reload();
                });
            });
        },

        addComponent: function(component, settings) {
            configStore.get('components', function(components) {
                var has = false,
                    i;
                for (i in components.components) {
                    if (components.components.hasOwnProperty(i)) {
                        if (components.components[i] === component) {
                            has = true;
                        }
                    }
                }
                if (!has) {
                    components.components.push(component);
                }

                components.settings[component] = _.extend({}, (components.settings[component] || {}), settings);
                configStore.save(components, function() {
                    location.reload();
                });
            });
        }
    };
});
