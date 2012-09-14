define(['Backbone', 'dom', 'countdown', 'components/issuelist/views/listitem'], function(Backbone, $, counter, issueRow) {
    var $tpl = $('<tbody />'), built = false,
    remove = function(array, from, to) {
      var rest = array.slice((to || from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, rest);
    };;

    return Backbone.View.extend({
        tagName: 'table',
        className: 'heightel issueList table',
        rows: {},
        $emptyRow: false,
        build: function() {
            var model, open, $openSince, that = this, found = [], i;

            if(!this.$emptyRow) {
                this.$emptyRow = $('<tr class="emptyrow" />');

                this.$emptyRow.append($('<td colspan="3" />').html('There are no open issues - <strong>HELL YEAH!</strong>'));
                $tpl.append(this.$emptyRow);
            }

            if(this.collection) {
                open = this.collection.getOpen();
                if(open.length > 0){
                    this.$emptyRow.hide();
                    found = open.pluck('id');
                    for(i in open.models) {
                        if(open.models.hasOwnProperty(i)) {
                            model = open.models[i];

                            this.buildRow(model);
                        }
                    }
                    for(i in this.rows) {
                        if(this.rows.hasOwnProperty(i)) {
                            if(-1 === _.indexOf(found, this.rows[i].model.get('id'))) {
                                this.rows[i].remove();
                                delete this.rows[i];
                            }
                        }
                    }
                }else{
                    this.$emptyRow.show();
                }
            }

            if($('.priority-1').length > 0) {
                $('body').addClass('inp1');
            }else{
                $('body').removeClass('inp1');
            }


            return this;
        },

        buildRow: function(model) {
            var view;
            if(!this.rows[model.get('id')]) {
                this.rows[model.get('id')] = view = new issueRow({ model: model });
                view.render();
                $tpl.append(view.el);
            }
        },

        render: function() {
            var that = this;
            if(!built) {
                $tpl.appendTo(this.$el);
                built = true;


                setInterval(function() {
                    that.build.call(that);
                }, refreshCounter);
            }
            this.build();

            return this;
        }
    });
});
