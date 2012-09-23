
define(['app', 'Backbone', 'dom', 'components/components/views/listitem', 'libs/rotater'], function(app, Backbone, $, listItem, rotater) {
    var $tpl = $('<tbody />'),
        built = false,
        activeFace = rotater.FACE_FRONT;
    ;
    return Backbone.View.extend({
        tagName: 'section',
        className: 'flip componentList heightel',
        items: false,
        current: 0,
        rotater: false,
        $card: false,
        interval: false,
        $front: false,
        events: {
            'tap tbody tr th': 'showComponentDetails',
            'click tbody tr th': 'showComponentDetails',
            'touchstart .componentList': 'startSwipe',
            'touchend .componentList': 'endSwipe'
        },
        deg: 0,
        $back: false,
        $activeTable: null,
        perTable: 30,
        initialize: function() {
            this.items = {};
        },
        build: function() {
            var model, models, $row, that = this,
                counter = 0, resizeInterval, row;


            this.rotater = new rotater(this.$el);

            this.$failing = $('<table class="table" />').append(this.buildHeaders()).prependTo(this.$el);

            if (this.collection) {
                models = this.collection.models;

                $table = $('<table class="table" />').append(this.buildHeaders());
                this.rotater.addFace(rotater.FACE_FRONT, $table);

                for (i in models) {
                    if (!models.hasOwnProperty(i)) {
                        continue;
                    }
                    if (++counter > this.perTable) {
                        counter = 0;
                        $table = $('<table class="table inactive" />').append(this.buildHeaders());
                        if ((this.rotater.items.length % 2) === 0) {
                            this.rotater.addFace(rotater.FACE_FRONT, $table);
                        } else {
                            this.rotater.addFace(rotater.FACE_BACK, $table);
                        }
                    }

                    model = models[i];
                    row = this.buildRow(model);

                    if(row.originalTable === undefined) {
                        row.originalTable = $table;
                    }

                    if(model.isFailing()) {
                        this.$failing.append(row);
                    }else{
                        $table.find('tbody').append(row);
                    }


                };

                this.collection.on('add', function(model) {
                    that.buildRow(model);
                });

            }

            var currentFlip = 0;

            var that = this;

            if (!this.isTouch() && this.rotater.items.length > 1) {
                this.interval = this.startRotateInterval();
            }
            that.fixHeight();
            return this;
        },

        startSwipe: function(e) {
            this.swipeStart = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        },

        endSwipe: function(e) {
            var touch = e.changedTouches[0],
                startX = this.swipeStart[0],
                startY = this.swipeStart[1],
                endX = touch.clientX
                endY = touch.clientY,
                xDiff = startX - endX,
                yDiff = startY - endY
            ;

            if(Math.abs(yDiff) < 100) {
                if(xDiff >= 60) {
                    this.nextCard();

                    return false;;
                }else if(xDiff <= -60){
                    this.prevCard();

                    return false;;
                }
            }
        },

        showComponentDetails: function(e) {
            $(e.target).parent().toggleClass('expanded');

            return false;
        },

        isTouch: function () {
          return ("ontouchstart" in document.documentElement) === true;
        },

        startRotateInterval: function() {
            var that = this;
            return setInterval(function() {
                that.nextCard();
            }, 5000);
        },

        stopAutoRotate: function() {
            if(this.interval){
                clearInterval(this.interval);
            }
            this.interval = false;

            return this;
        },

        nextCard: function(cb) {
            var that = this, prev = this.rotater.getCurrentCard();
            this.rotater.getNextCard(false).removeClass('inactive');

            this.flipCard(rotater.DIRECTION_FORWARD, function() {
                console.log('Setting ', prev, ' to inactive');
                prev.addClass('inactive');
                if(cb) cb();
            });
        },

        prevCard: function(cb) {
            var that = this, prev = this.rotater.getCurrentCard();

            this.rotater.getPrevCard(false).removeClass('inactive');

            this.flipCard(rotater.DIRECTION_BACK, function() {
                console.log('Setting ', prev, ' to inactive');
                prev.addClass('inactive');
                if(cb) cb();
            });
        },

        flipCard: function(direction, cb, delay) {
            var that = this;
            this.rotater.rotate(direction, function() {
                that.fixHeight();
                if(cb) cb();
            }, delay);
        },

        fixHeight: function() {
            this.$el.height(this.rotater.container.find('table:not(.inactive)').height() + 100);
        },

        buildRow: function(model) {
            var view;
            if (!this.items[model.get('id')]) {
                view = new listItem({
                    model: model,
                    environments: app.getEnvironments()
                });

                view.render();
                this.items[model.get('id')] = view;
            }

            return this.items[model.get('id')].el;
        },

        buildHeaders: function() {
            $header = $('<thead>');
            $row = $('<tr />');

            $row.append($('<th />').html('Component'));

            for (i in app.getEnvironments()) {
                $row.append($('<th />').html(app.getEnvironments()[i].name));
            }

            return $header.append($row).add($('<tbody />'));
        },

        render: function() {
            if (!built) {
                built = true;
                this.build();
            }

            return this;
        }
    });
});
