define(['Backbone', 'underscore', 'libs/class'], function(bb, _, Base) {
    var rotater = Base.extend({
        $card: false,
        container: false,
        items: false,
        activeFace: 'front',
        current: 0,
        deg: 0,
        $back: false,
        $front: false,
        $current: 0,
        constructor: function(el, showControls) {
            showControls = showControls === undefined ? false : showControls;
            this.container = $('<section class="flip">').appendTo(el);
            this.$card = $('<div class="card" />')
            this.$card.appendTo(this.container);

            if (!this.$front) {
                this.$front = $('<div class="face front" />').appendTo(this.$card);
            }
            if (!this.$back) {
                this.$back = $('<div class="face back" />').appendTo(this.$card);
            }

            if(showControls === true) {
                this.appendControls();
            }

            this.items = [];
        },

        appendControls: function() {
            var that = this;
            var $buttonPrev = $('<button />').html('Prev').on('click', function() {
                that.rotate('back');
            }),
                $buttonNext = $('<button />').html('Next').on('click', function() {
                that.rotate('forward');
            });;
            this.container.prepend($buttonPrev);
            this.container.prepend($buttonNext);
        },

        addFace: function(where, face) {
            console.log('Adding ' + where + ' face');
            face.ACTIVE_FACE = where;
            this.items.push(face);

            if(where === 'front') {
                this.$front.append(face);
            }else{
                this.$back.append(face);
            }

            return this;
        },

        rotate: function(direction, cb, delay) {
            var that = this,
                from = this.deg,
                next;
            delay = delay || 300;
            rotateDeg = 180;

            this.activeFace = this.activeFace === rotater.FACE_BACK ? rotater.FACE_FRONT : rotater.FACE_BACK;

            if(direction === rotater.DIRECTION_FORWARD) {
                this.deg = (this.deg - rotateDeg);
                next = this.getNextCard();
            }else{
                this.deg = (this.deg + rotateDeg);
                next = this.getPrevCard();
            }

            console.log('Moving from ' + from + ' to ' + this.deg + ' for ' + (this.deg - from) + '  degrees of rotation'  );

            if(next.ACTIVE_FACE !== this.activeFace) {
                this.getPrevCard();
                return this.rotate.apply(this, arguments);
            }


            this.$card.animate({rotateY: this.deg + 'deg'}, delay, 'ease-out', function() {
                that.fixHeight();
                if(cb) cb();
            });
        },

        fixHeight: function() {
            this.getCurrentCard().parent().height(this.getCurrentCard().find('.heightel').height());
        },

        getCard: function() {
            return this.$card;
        },

        getNextCard: function(increment) {
            var current = (this.current + 1);
            increment = increment === undefined ? true : increment;
            if (current > (this.items.length - 1)) {
                current = 0;
            }

            if(increment !== false) {
                this.current = current;
            }

            return this.items[current];
        },

        getPrevCard: function(increment) {
            var current = (this.current - 1);
            increment = increment === undefined ? true : increment;
            if (current < 0) {
                current = (this.items.length - 1);
            }

            if(increment !== false) {
                this.current = current;
            }

            return this.items[current];
        },

        getCurrentCard: function() {
            return this.items[this.current];
        }
    }, {
        FACE_FRONT: 'front',
        FACE_BACK: 'back',
    });


    return rotater;
});
