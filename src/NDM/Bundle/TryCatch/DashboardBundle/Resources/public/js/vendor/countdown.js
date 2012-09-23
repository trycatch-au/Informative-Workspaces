define(['dom'], function($) {
    var counters = [],
        Counter = function(el, date, reverse) {
            var interval  = null,
                stopped   = true,
                $el       = el,
                counterId = getCounterId(el);

            $(el).addClass('countdown_wrapper');


            this.updateDate = function() {
                diff = (typeof(reverse) === 'undefined' | reverse === false) ? getDiff(date, new Date()) : getDiff(new Date(), date);

                $el.html((diff.days > 0 ? '<span>' + diff.days + 'D </span>' : '') + (diff.hours <= 0 ? '' : '<span>' + diff.hours + 'H </span>') + (diff.minutes <= 0 ? '' : '<span>' + diff.minutes + 'M </span>') + '<span>' + diff.seconds + 'S </span>');
            };

            this.stop = function() {
                if (stopped) {
                    return;
                }

                clearInterval(interval);

                return this;
            };

            this.start = function() {
                if (stopped) {
                    setInterval(this.updateDate, 1000);
                }


                return this;
            };

            this.getInterval = function() {
                return interval;
            };

            this.updateDate();
            this.start();
        };

    return {
        init: function(el, date, reverse) {
            var $el = $(el),
                counterId = getCounterId(el),
                counter = getCounter(counterId)
            ;

            if (!counter) {
                counter = new Counter($el, date, reverse);
                registerCounter(counterId, counter);
                $el.data('counter-id', counterId);
            }

            return counter;
        }
    };

    function getCounterId(el) {
        var $el = $(el);

        return $el.data('counter-id') || $el.attr('id') || 'el_' + (Math.random(0, 200));
    }

    function getCounter(id) {
        return counters[id];
    }

    function registerCounter(id, counter) {
        counters[id] = counter;

        return counter;
    }

    function getDiff(date1, date2) {
        if (!date2) {
            date2 = new Date();
        }
        var diff = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        var d1 = ((date1.getTime ? date1.getTime() : date1.getTimestamp()) / 1000),
            d2 = ((date2.getTime ? date2.getTime() : date2.getTimestamp()) / 1000);
        if (d1 > d2) {

            var totaldiff = d1 - d2;
            if (totaldiff > 86400) {
                diff.days = Math.floor(totaldiff / 86400);
                totaldiff -= (diff.days * 86400);
            }
            if (totaldiff > 3600) {
                diff.hours = Math.floor(totaldiff / 3600);
                totaldiff -= (diff.hours * 3600);
            }
            if (totaldiff > 60) {
                diff.minutes = Math.floor(totaldiff / 60);
                totaldiff -= (diff.minutes * 60);
            }

            diff.seconds = parseInt(totaldiff, 0);
        }
        return diff;
    }
});
