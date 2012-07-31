define(['collections/releases', 'text!components/upcoming/templates/upcoming.tpl', 'countdown'], function(ReleaseCollection, tpl, counter) {
    var render = function(release) {
            return _.template(tpl, {
                release: release
            });
        },
        releases = new ReleaseCollection(),
        target;

    return {
        setTarget: function(targ) {
            target = targ;

            return this;
        },

        getTarget: function() {
            return target;
        },

        refresh: function() {
            releases.getUpcoming(function(release) {
                target.html(render(release));
                //time to countdown in seconds, and element ID
                for (i in release.dates) {
                    counter.init($('#counter-' + i), release.dates[i]);
                }
            });

            return this;
        },

        render: function() {
            this.refresh();

            return this;
        }
    };
});
