define(['Backbone', 'config/dashboard', 'dom'], function(Backbone, dashboard, $) {
    var $el = $('<section class="dashboard"/>'),
        component;

    function render(components) {
        var i;
        $el.empty();
        for (i in components) {
            if (components.hasOwnProperty(i)) {
                component = components[i];

                if (!component.getTarget()) {
                    component.setTarget($('<section class="module ' + component.name + '" />'));
                }

                $el.append(component.getTarget());
                component.render();
                component.flipped = false;
            }
        }
    }

    $el.appendTo($('#content'));

    return Backbone.Router.extend({
        routes: {
            '': 'dash'
        },

        dash: function() {
            dashboard.getComponents(render);
        }
    });
});
