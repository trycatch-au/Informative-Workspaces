define(['app', 'components/base', 'text!components/chooser/views/modal.tpl', 'underscore', 'libs/rotater', 'dom'], function(app, baseComponent, modalText, _, rotater, $) {
    // Define the Collection's inheritable methods.
    var built = false,
        view = baseComponent.extend({
            name: 'chooser',
            $modal: false,
            _configuring: {},
            rotaters: {},
            startedLink: false,
            refreshModal: function() {
                var components = app.config.availableComponents,
                    html = '';
                for (i in components) {
                    if (components.hasOwnProperty(i)) {
                        html += '<option>' + components[i] + '</option>';
                    }
                }
                this.$chooser = $('<select>' + html + '</select>');

                this.$modal.find('.modal-body').html(this.$chooser);
            },

            getModalTarget: function() {
                return this.$modal;
            },

            render: function() {
                var that = this;
                if (!this.$modal) {
                    this.$modal = $(modalText);
                    this.$modal.find('a#configureChooserComponent').on('click', function() {
                        $(this).hide();
                        $('#saveComponent').show()
                        that.configureComponent.apply(that, _.toArray(arguments));
                    });
                    this.$modal.find('a#saveComponent').on('click', function() {
                        that.saveComponent.apply(that, _.toArray(arguments));
                    });
                    this.$modal.find('a#removeComponent').on('click', function() {
                        that.removeComponent.apply(that, _.toArray(arguments));
                    });
                    this.$modal.find('a#linkComponent').on('click', function() {
                        that.linkComponent.apply(that, _.toArray(arguments));
                    });

                    $('body').append(this.$modal);
                    this.$modal.modal('hide');
                }

                this.refreshModal();
                if (!built) {
                    $config = $('<a href="#" class="btn btn-primary" id="configureDashButton">Configure Dashboard</a>');
                    $config.on('click', function() {
                        that.$modal.modal('show');
                    });
                    $('body').append($config);
                    built = true;
                }

                return this.$modal;
            },

            linkComponent: function() {
                var
                map = {
                    'components/chooser/main': 'chooser',
                    'components/upcoming/main': 'upcoming',
                    'components/issuegraph/main': 'issuegraph',
                    'components/issuelist/main': 'issues',
                    'components/components/main': 'components'
                }
                console.log(this.startedLink ? 'Finishing link' : 'Starting link');
                if (this.startedLink !== false) {
                    linkWith = this.$chooser.val();
                    console.log('Linking with ' + linkWith);

                    el = $('.module.' + map[this.startedLink]);

                    if(!this.rotaters[this.startedLink]) {
                        this.rotaters[this.startedLink] = new rotater($('<section />'), true);
                        console.log('creating rotater for '+ this.startedLink, this.rotaters[this.startedLink]);
                        this.rotaters[this.startedLink].addFace(rotater.FACE_FRONT, el);
                        this.rotaters[this.startedLink].container.insertAfter(el);
                    }


                    joinWith = $('.module.' + map[this.$chooser.val()]);

                    this.rotaters[this.startedLink].addFace(((this.rotaters[this.startedLink].items.length % 2 === 0) ? rotater.FACE_BACK : rotater.FACE_FRONT), joinWith);
                    this.startedLink = false;
                } else {
                    this.startedLink = this.$chooser.val();
                }

            },

            saveComponent: function() {
                this.$modal.modal('hide');
                app.config.addComponent(this.$chooser.val(), this._configuring.getValues ? this._configuring.getValues() : {});
            },

            removeComponent: function() {
                this.$modal.modal('hide');
                app.config.removeComponent(this.$chooser.val());
                location.reload();
            },

            configureComponent: function() {
                var $body = this.getModalTarget().find('.modal-body'),
                    comp = this.$chooser.val(),
                    that = this;

                app.config.getComponents(function(components) {
                    var i;
                    for (i in components) {
                        if (components.hasOwnProperty(i) && components[i] === comp) {
                            require([components[i]], function(component) {
                                that._configuring = $(component.getSettingsForm ? component.getSettingsForm() : $());
                                $body.empty().append(that._configuring);
                            });

                            return;
                        }
                    }

                    $body.html('<p>Unable to find settings form for ' + comp + '</p>');
                }, true);

                delete $body;
            },

            cleanup: function() {
                this.$modal = false;
                this.setTarget(null);
            }
        });


    return new view();
});
