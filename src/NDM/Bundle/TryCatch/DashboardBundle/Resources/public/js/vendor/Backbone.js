define(['underscore', 'dom'], function (_, $) {
    //     Backbone.js 0.9.2

    //     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
    //     Backbone may be freely distributed under the MIT license.
    //     For all details and documentation:
    //     http://backbonejs.org

    (function () {

        // Initial Setup
        // -------------

        // Save a reference to the global object (`window` in the browser, `global`
        // on the server).
        var root = this;

        // Save the previous value of the `Backbone` variable, so that it can be
        // restored later on, if `noConflict` is used.
        var previousBackbone = root.Backbone;

        // Create a local reference to slice/splice.
        var slice = Array.prototype.slice;
        var splice = Array.prototype.splice;

        // The top-level namespace. All public Backbone classes and modules will
        // be attached to this. Exported for both CommonJS and the browser.
        var Backbone;
        if (typeof exports !== 'undefined') {
            Backbone = exports;
        } else {
            Backbone = root.Backbone = {};
        }

        // Current version of the library. Keep in sync with `package.json`.
        Backbone.VERSION = '0.9.2';

        // Require Underscore, if we're on the server, and it's not already present.
        var _ = root._;
        if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

        // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
        var $ = root.jQuery || root.Zepto || root.ender;

        // Set the JavaScript library that will be used for DOM manipulation and
        // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
        // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
        // alternate JavaScript library (or a mock library for testing your views
        // outside of a browser).
        Backbone.setDomLibrary = function (lib) {
            $ = lib;
        };

        // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
        // to its previous owner. Returns a reference to this Backbone object.
        Backbone.noConflict = function () {
            root.Backbone = previousBackbone;
            return this;
        };

        // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
        // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
        // set a `X-Http-Method-Override` header.
        Backbone.emulateHTTP = false;

        // Turn on `emulateJSON` to support legacy servers that can't deal with direct
        // `application/json` requests ... will encode the body as
        // `application/x-www-form-urlencoded` instead and will send the model in a
        // form param named `model`.
        Backbone.emulateJSON = false;

        // Backbone.Events
        // -----------------

        // Regular expression used to split event strings
        var eventSplitter = /\s+/;

        // A module that can be mixed in to *any object* in order to provide it with
        // custom events. You may bind with `on` or remove with `off` callback functions
        // to an event; trigger`-ing an event fires all callbacks in succession.
        //
        //     var object = {};
        //     _.extend(object, Backbone.Events);
        //     object.on('expand', function(){ alert('expanded'); });
        //     object.trigger('expand');
        //
        var Events = Backbone.Events = {

            // Bind one or more space separated events, `events`, to a `callback`
            // function. Passing `"all"` will bind the callback to all events fired.
            on: function (events, callback, context) {

                var calls, event, node, tail, list;
                if (!callback) return this;
                events = events.split(eventSplitter);
                calls = this._callbacks || (this._callbacks = {});

                // Create an immutable callback list, allowing traversal during
                // modification.  The tail is an empty object that will always be used
                // as the next node.
                while (event = events.shift()) {
                    list = calls[event];
                    node = list ? list.tail : {};
                    node.next = tail = {};
                    node.context = context;
                    node.callback = callback;
                    calls[event] = {
                        tail: tail,
                        next: list ? list.next : node
                    };
                }

                return this;
            },

            // Remove one or many callbacks. If `context` is null, removes all callbacks
            // with that function. If `callback` is null, removes all callbacks for the
            // event. If `events` is null, removes all bound callbacks for all events.
            off: function (events, callback, context) {
                var event, calls, node, tail, cb, ctx;

                // No events, or removing *all* events.
                if (!(calls = this._callbacks)) return;
                if (!(events || callback || context)) {
                    delete this._callbacks;
                    return this;
                }

                // Loop through the listed events and contexts, splicing them out of the
                // linked list of callbacks if appropriate.
                events = events ? events.split(eventSplitter) : _.keys(calls);
                while (event = events.shift()) {
                    node = calls[event];
                    delete calls[event];
                    if (!node || !(callback || context)) continue;
                    // Create a new list, omitting the indicated callbacks.
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        cb = node.callback;
                        ctx = node.context;
                        if ((callback && cb !== callback) || (context && ctx !== context)) {
                            this.on(event, cb, ctx);
                        }
                    }
                }

                return this;
            },

            // Trigger one or many events, firing all bound callbacks. Callbacks are
            // passed the same arguments as `trigger` is, apart from the event name
            // (unless you're listening on `"all"`, which will cause your callback to
            // receive the true name of the event as the first argument).
            trigger: function (events) {
                var event, node, calls, tail, args, all, rest;
                if (!(calls = this._callbacks)) return this;
                all = calls.all;
                events = events.split(eventSplitter);
                rest = slice.call(arguments, 1);

                // For each event, walk through the linked list of callbacks twice,
                // first to trigger the event, then to trigger any `"all"` callbacks.
                while (event = events.shift()) {
                    if (node = calls[event]) {
                        tail = node.tail;
                        while ((node = node.next) !== tail) {
                            node.callback.apply(node.context || this, rest);
                        }
                    }
                    if (node = all) {
                        tail = node.tail;
                        args = [event].concat(rest);
                        while ((node = node.next) !== tail) {
                            node.callback.apply(node.context || this, args);
                        }
                    }
                }

                return this;
            }

        };

        // Aliases for backwards compatibility.
        Events.bind = Events.on;
        Events.unbind = Events.off;

        // Backbone.Model
        // --------------

        // Create a new model, with defined attributes. A client id (`cid`)
        // is automatically generated and assigned for you.
        var Model = Backbone.Model = function (attributes, options) {
            var defaults;
            attributes || (attributes = {});
            if (options && options.parse) attributes = this.parse(attributes);
            if (defaults = getValue(this, 'defaults')) {
                attributes = _.extend({}, defaults, attributes);
            }
            if (options && options.collection) this.collection = options.collection;
            this.attributes = {};
            this._escapedAttributes = {};
            this.cid = _.uniqueId('c');
            this.changed = {};
            this._silent = {};
            this._pending = {};
            this.set(attributes, {
                silent: true
            });
            // Reset change tracking.
            this.changed = {};
            this._silent = {};
            this._pending = {};
            this._previousAttributes = _.clone(this.attributes);
            this.initialize.apply(this, arguments);
        };

        // Attach all inheritable methods to the Model prototype.
        _.extend(Model.prototype, Events, {

            // A hash of attributes whose current and previous value differ.
            changed: null,

            // A hash of attributes that have silently changed since the last time
            // `change` was called.  Will become pending attributes on the next call.
            _silent: null,

            // A hash of attributes that have changed since the last `'change'` event
            // began.
            _pending: null,

            // The default name for the JSON `id` attribute is `"id"`. MongoDB and
            // CouchDB users may want to set this to `"_id"`.
            idAttribute: 'id',

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function () {},

            // Return a copy of the model's `attributes` object.
            toJSON: function (options) {
                return _.clone(this.attributes);
            },

            // Get the value of an attribute.
            get: function (attr) {
                return this.attributes[attr];
            },

            // Get the HTML-escaped value of an attribute.
            escape: function (attr) {
                var html;
                if (html = this._escapedAttributes[attr]) return html;
                var val = this.get(attr);
                return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
            },

            // Returns `true` if the attribute contains a value that is not null
            // or undefined.
            has: function (attr) {
                return this.get(attr) != null;
            },

            // Set a hash of model attributes on the object, firing `"change"` unless
            // you choose to silence it.
            set: function (key, value, options) {
                var attrs, attr, val;

                // Handle both `"key", value` and `{key: value}` -style arguments.
                if (_.isObject(key) || key == null) {
                    attrs = key;
                    options = value;
                } else {
                    attrs = {};
                    attrs[key] = value;
                }

                // Extract attributes and options.
                options || (options = {});
                if (!attrs) return this;
                if (attrs instanceof Model) attrs = attrs.attributes;
                if (options.unset) for (attr in attrs) attrs[attr] = void 0;

                // Run validation.
                if (!this._validate(attrs, options)) return false;

                // Check for changes of `id`.
                if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

                var changes = options.changes = {};
                var now = this.attributes;
                var escaped = this._escapedAttributes;
                var prev = this._previousAttributes || {};

                // For each `set` attribute...
                for (attr in attrs) {
                    val = attrs[attr];

                    // If the new and current value differ, record the change.
                    if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
                        delete escaped[attr];
                        (options.silent ? this._silent : changes)[attr] = true;
                    }

                    // Update or delete the current value.
                    options.unset ? delete now[attr] : now[attr] = val;

                    // If the new and previous value differ, record the change.  If not,
                    // then remove changes for this attribute.
                    if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
                        this.changed[attr] = val;
                        if (!options.silent) this._pending[attr] = true;
                    } else {
                        delete this.changed[attr];
                        delete this._pending[attr];
                    }
                }

                // Fire the `"change"` events.
                if (!options.silent) this.change(options);
                return this;
            },

            // Remove an attribute from the model, firing `"change"` unless you choose
            // to silence it. `unset` is a noop if the attribute doesn't exist.
            unset: function (attr, options) {
                (options || (options = {})).unset = true;
                return this.set(attr, null, options);
            },

            // Clear all attributes on the model, firing `"change"` unless you choose
            // to silence it.
            clear: function (options) {
                (options || (options = {})).unset = true;
                return this.set(_.clone(this.attributes), options);
            },

            // Fetch the model from the server. If the server's representation of the
            // model differs from its current attributes, they will be overriden,
            // triggering a `"change"` event.
            fetch: function (options) {
                options = options ? _.clone(options) : {};
                var model = this;
                var success = options.success;
                options.success = function (resp, status, xhr) {
                    if (!model.set(model.parse(resp, xhr), options)) return false;
                    if (success) success(model, resp);
                };
                options.error = Backbone.wrapError(options.error, model, options);
                return (this.sync || Backbone.sync).call(this, 'read', this, options);
            },

            // Set a hash of model attributes, and sync the model to the server.
            // If the server returns an attributes hash that differs, the model's
            // state will be `set` again.
            save: function (key, value, options) {
                var attrs, current;

                // Handle both `("key", value)` and `({key: value})` -style calls.
                if (_.isObject(key) || key == null) {
                    attrs = key;
                    options = value;
                } else {
                    attrs = {};
                    attrs[key] = value;
                }
                options = options ? _.clone(options) : {};

                // If we're "wait"-ing to set changed attributes, validate early.
                if (options.wait) {
                    if (!this._validate(attrs, options)) return false;
                    current = _.clone(this.attributes);
                }

                // Regular saves `set` attributes before persisting to the server.
                var silentOptions = _.extend({}, options, {
                    silent: true
                });
                if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
                    return false;
                }

                // After a successful server-side save, the client is (optionally)
                // updated with the server-side state.
                var model = this;
                var success = options.success;
                options.success = function (resp, status, xhr) {
                    var serverAttrs = model.parse(resp, xhr);
                    if (options.wait) {
                        delete options.wait;
                        serverAttrs = _.extend(attrs || {}, serverAttrs);
                    }
                    if (!model.set(serverAttrs, options)) return false;
                    if (success) {
                        success(model, resp);
                    } else {
                        model.trigger('sync', model, resp, options);
                    }
                };

                // Finish configuring and sending the Ajax request.
                options.error = Backbone.wrapError(options.error, model, options);
                var method = this.isNew() ? 'create' : 'update';
                var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
                if (options.wait) this.set(current, silentOptions);
                return xhr;
            },

            // Destroy this model on the server if it was already persisted.
            // Optimistically removes the model from its collection, if it has one.
            // If `wait: true` is passed, waits for the server to respond before removal.
            destroy: function (options) {
                options = options ? _.clone(options) : {};
                var model = this;
                var success = options.success;

                var triggerDestroy = function () {
                    model.trigger('destroy', model, model.collection, options);
                };

                if (this.isNew()) {
                    triggerDestroy();
                    return false;
                }

                options.success = function (resp) {
                    if (options.wait) triggerDestroy();
                    if (success) {
                        success(model, resp);
                    } else {
                        model.trigger('sync', model, resp, options);
                    }
                };

                options.error = Backbone.wrapError(options.error, model, options);
                var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
                if (!options.wait) triggerDestroy();
                return xhr;
            },

            // Default URL for the model's representation on the server -- if you're
            // using Backbone's restful methods, override this to change the endpoint
            // that will be called.
            url: function () {
                var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
                if (this.isNew()) return base;
                return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
            },

            // **parse** converts a response into the hash of attributes to be `set` on
            // the model. The default implementation is just to pass the response along.
            parse: function (resp, xhr) {
                return resp;
            },

            // Create a new model with identical attributes to this one.
            clone: function () {
                return new this.constructor(this.attributes);
            },

            // A model is new if it has never been saved to the server, and lacks an id.
            isNew: function () {
                return this.id == null;
            },

            // Call this method to manually fire a `"change"` event for this model and
            // a `"change:attribute"` event for each changed attribute.
            // Calling this will cause all objects observing the model to update.
            change: function (options) {
                options || (options = {});
                var changing = this._changing;
                this._changing = true;

                // Silent changes become pending changes.
                for (var attr in this._silent) this._pending[attr] = true;

                // Silent changes are triggered.
                var changes = _.extend({}, options.changes, this._silent);
                this._silent = {};
                for (var attr in changes) {
                    this.trigger('change:' + attr, this, this.get(attr), options);
                }
                if (changing) return this;

                // Continue firing `"change"` events while there are pending changes.
                while (!_.isEmpty(this._pending)) {
                    this._pending = {};
                    this.trigger('change', this, options);
                    // Pending and silent changes still remain.
                    for (var attr in this.changed) {
                        if (this._pending[attr] || this._silent[attr]) continue;
                        delete this.changed[attr];
                    }
                    this._previousAttributes = _.clone(this.attributes);
                }

                this._changing = false;
                return this;
            },

            // Determine if the model has changed since the last `"change"` event.
            // If you specify an attribute name, determine if that attribute has changed.
            hasChanged: function (attr) {
                if (!arguments.length) return !_.isEmpty(this.changed);
                return _.has(this.changed, attr);
            },

            // Return an object containing all the attributes that have changed, or
            // false if there are no changed attributes. Useful for determining what
            // parts of a view need to be updated and/or what attributes need to be
            // persisted to the server. Unset attributes will be set to undefined.
            // You can also pass an attributes object to diff against the model,
            // determining if there *would be* a change.
            changedAttributes: function (diff) {
                if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
                var val, changed = false,
                    old = this._previousAttributes;
                for (var attr in diff) {
                    if (_.isEqual(old[attr], (val = diff[attr]))) continue;
                    (changed || (changed = {}))[attr] = val;
                }
                return changed;
            },

            // Get the previous value of an attribute, recorded at the time the last
            // `"change"` event was fired.
            previous: function (attr) {
                if (!arguments.length || !this._previousAttributes) return null;
                return this._previousAttributes[attr];
            },

            // Get all of the attributes of the model at the time of the previous
            // `"change"` event.
            previousAttributes: function () {
                return _.clone(this._previousAttributes);
            },

            // Check if the model is currently in a valid state. It's only possible to
            // get into an *invalid* state if you're using silent changes.
            isValid: function () {
                return !this.validate(this.attributes);
            },

            // Run validation against the next complete set of model attributes,
            // returning `true` if all is well. If a specific `error` callback has
            // been passed, call that instead of firing the general `"error"` event.
            _validate: function (attrs, options) {
                if (options.silent || !this.validate) return true;
                attrs = _.extend({}, this.attributes, attrs);
                var error = this.validate(attrs, options);
                if (!error) return true;
                if (options && options.error) {
                    options.error(this, error, options);
                } else {
                    this.trigger('error', this, error, options);
                }
                return false;
            }

        });

        // Backbone.Collection
        // -------------------

        // Provides a standard collection class for our sets of models, ordered
        // or unordered. If a `comparator` is specified, the Collection will maintain
        // its models in sort order, as they're added and removed.
        var Collection = Backbone.Collection = function (models, options) {
            options || (options = {});
            if (options.model) this.model = options.model;
            if (options.comparator) this.comparator = options.comparator;
            this._reset();
            this.initialize.apply(this, arguments);
            if (models) this.reset(models, {
                silent: true,
                parse: options.parse
            });
        };

        // Define the Collection's inheritable methods.
        _.extend(Collection.prototype, Events, {

            // The default model for a collection is just a **Backbone.Model**.
            // This should be overridden in most cases.
            model: Model,

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function () {},

            // The JSON representation of a Collection is an array of the
            // models' attributes.
            toJSON: function (options) {
                return this.map(function (model) {
                    return model.toJSON(options);
                });
            },

            // Add a model, or list of models to the set. Pass **silent** to avoid
            // firing the `add` event for every new model.
            add: function (models, options) {
                var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
                options || (options = {});
                models = _.isArray(models) ? models.slice() : [models];

                // Begin by turning bare objects into model references, and preventing
                // invalid models or duplicate models from being added.
                for (i = 0, length = models.length; i < length; i++) {
                    if (!(model = models[i] = this._prepareModel(models[i], options))) {
                        throw new Error("Can't add an invalid model to a collection");
                    }
                    cid = model.cid;
                    id = model.id;
                    if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
                        dups.push(i);
                        continue;
                    }
                    cids[cid] = ids[id] = model;
                }

                // Remove duplicates.
                i = dups.length;
                while (i--) {
                    models.splice(dups[i], 1);
                }

                // Listen to added models' events, and index models for lookup by
                // `id` and by `cid`.
                for (i = 0, length = models.length; i < length; i++) {
                    (model = models[i]).on('all', this._onModelEvent, this);
                    this._byCid[model.cid] = model;
                    if (model.id != null) this._byId[model.id] = model;
                }

                // Insert models into the collection, re-sorting if needed, and triggering
                // `add` events unless silenced.
                this.length += length;
                index = options.at != null ? options.at : this.models.length;
                splice.apply(this.models, [index, 0].concat(models));
                if (this.comparator) this.sort({
                    silent: true
                });
                if (options.silent) return this;
                for (i = 0, length = this.models.length; i < length; i++) {
                    if (!cids[(model = this.models[i]).cid]) continue;
                    options.index = i;
                    model.trigger('add', model, this, options);
                }
                return this;
            },

            // Remove a model, or a list of models from the set. Pass silent to avoid
            // firing the `remove` event for every model removed.
            remove: function (models, options) {
                var i, l, index, model;
                options || (options = {});
                models = _.isArray(models) ? models.slice() : [models];
                for (i = 0, l = models.length; i < l; i++) {
                    model = this.getByCid(models[i]) || this.get(models[i]);
                    if (!model) continue;
                    delete this._byId[model.id];
                    delete this._byCid[model.cid];
                    index = this.indexOf(model);
                    this.models.splice(index, 1);
                    this.length--;
                    if (!options.silent) {
                        options.index = index;
                        model.trigger('remove', model, this, options);
                    }
                    this._removeReference(model);
                }
                return this;
            },

            // Add a model to the end of the collection.
            push: function (model, options) {
                model = this._prepareModel(model, options);
                this.add(model, options);
                return model;
            },

            // Remove a model from the end of the collection.
            pop: function (options) {
                var model = this.at(this.length - 1);
                this.remove(model, options);
                return model;
            },

            // Add a model to the beginning of the collection.
            unshift: function (model, options) {
                model = this._prepareModel(model, options);
                this.add(model, _.extend({
                    at: 0
                }, options));
                return model;
            },

            // Remove a model from the beginning of the collection.
            shift: function (options) {
                var model = this.at(0);
                this.remove(model, options);
                return model;
            },

            // Get a model from the set by id.
            get: function (id) {
                if (id == null) return void 0;
                return this._byId[id.id != null ? id.id : id];
            },

            // Get a model from the set by client id.
            getByCid: function (cid) {
                return cid && this._byCid[cid.cid || cid];
            },

            // Get the model at the given index.
            at: function (index) {
                return this.models[index];
            },

            // Return models with matching attributes. Useful for simple cases of `filter`.
            where: function (attrs) {
                if (_.isEmpty(attrs)) return [];
                return this.filter(function (model) {
                    for (var key in attrs) {
                        if (attrs[key] !== model.get(key)) return false;
                    }
                    return true;
                });
            },

            // Force the collection to re-sort itself. You don't need to call this under
            // normal circumstances, as the set will maintain sort order as each item
            // is added.
            sort: function (options) {
                options || (options = {});
                if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
                var boundComparator = _.bind(this.comparator, this);
                if (this.comparator.length == 1) {
                    this.models = this.sortBy(boundComparator);
                } else {
                    this.models.sort(boundComparator);
                }
                if (!options.silent) this.trigger('reset', this, options);
                return this;
            },

            // Pluck an attribute from each model in the collection.
            pluck: function (attr) {
                return _.map(this.models, function (model) {
                    return model.get(attr);
                });
            },

            // When you have more items than you want to add or remove individually,
            // you can reset the entire set with a new list of models, without firing
            // any `add` or `remove` events. Fires `reset` when finished.
            reset: function (models, options) {
                models || (models = []);
                options || (options = {});
                for (var i = 0, l = this.models.length; i < l; i++) {
                    this._removeReference(this.models[i]);
                }
                this._reset();
                this.add(models, _.extend({
                    silent: true
                }, options));
                if (!options.silent) this.trigger('reset', this, options);
                return this;
            },

            // Fetch the default set of models for this collection, resetting the
            // collection when they arrive. If `add: true` is passed, appends the
            // models to the collection instead of resetting.
            fetch: function (options) {
                options = options ? _.clone(options) : {};
                if (options.parse === undefined) options.parse = true;
                var collection = this;
                var success = options.success;
                options.success = function (resp, status, xhr) {
                    collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
                    if (success) success(collection, resp);
                };
                options.error = Backbone.wrapError(options.error, collection, options);
                return (this.sync || Backbone.sync).call(this, 'read', this, options);
            },

            // Create a new instance of a model in this collection. Add the model to the
            // collection immediately, unless `wait: true` is passed, in which case we
            // wait for the server to agree.
            create: function (model, options) {
                var coll = this;
                options = options ? _.clone(options) : {};
                model = this._prepareModel(model, options);
                if (!model) return false;
                if (!options.wait) coll.add(model, options);
                var success = options.success;
                options.success = function (nextModel, resp, xhr) {
                    if (options.wait) coll.add(nextModel, options);
                    if (success) {
                        success(nextModel, resp);
                    } else {
                        nextModel.trigger('sync', model, resp, options);
                    }
                };
                model.save(null, options);
                return model;
            },

            // **parse** converts a response into a list of models to be added to the
            // collection. The default implementation is just to pass it through.
            parse: function (resp, xhr) {
                return resp;
            },

            // Proxy to _'s chain. Can't be proxied the same way the rest of the
            // underscore methods are proxied because it relies on the underscore
            // constructor.
            chain: function () {
                return _(this.models).chain();
            },

            // Reset all internal state. Called when the collection is reset.
            _reset: function (options) {
                this.length = 0;
                this.models = [];
                this._byId = {};
                this._byCid = {};
            },

            // Prepare a model or hash of attributes to be added to this collection.
            _prepareModel: function (model, options) {
                options || (options = {});
                if (!(model instanceof Model)) {
                    var attrs = model;
                    options.collection = this;
                    model = new this.model(attrs, options);
                    if (!model._validate(model.attributes, options)) model = false;
                } else if (!model.collection) {
                    model.collection = this;
                }
                return model;
            },

            // Internal method to remove a model's ties to a collection.
            _removeReference: function (model) {
                if (this == model.collection) {
                    delete model.collection;
                }
                model.off('all', this._onModelEvent, this);
            },

            // Internal method called every time a model in the set fires an event.
            // Sets need to update their indexes when models change ids. All other
            // events simply proxy through. "add" and "remove" events that originate
            // in other collections are ignored.
            _onModelEvent: function (event, model, collection, options) {
                if ((event == 'add' || event == 'remove') && collection != this) return;
                if (event == 'destroy') {
                    this.remove(model, options);
                }
                if (model && event === 'change:' + model.idAttribute) {
                    delete this._byId[model.previous(model.idAttribute)];
                    this._byId[model.id] = model;
                }
                this.trigger.apply(this, arguments);
            }

        });

        // Underscore methods that we want to implement on the Collection.
        var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

        // Mix in each Underscore method as a proxy to `Collection#models`.
        _.each(methods, function (method) {
            Collection.prototype[method] = function () {
                return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
            };
        });

        // Backbone.Router
        // -------------------

        // Routers map faux-URLs to actions, and fire events when routes are
        // matched. Creating a new one sets its `routes` hash, if not set statically.
        var Router = Backbone.Router = function (options) {
            options || (options = {});
            if (options.routes) this.routes = options.routes;
            this._bindRoutes();
            this.initialize.apply(this, arguments);
        };

        // Cached regular expressions for matching named param parts and splatted
        // parts of route strings.
        var namedParam = /:\w+/g;
        var splatParam = /\*\w+/g;
        var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

        // Set up all inheritable **Backbone.Router** properties and methods.
        _.extend(Router.prototype, Events, {

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function () {},

            // Manually bind a single named route to a callback. For example:
            //
            //     this.route('search/:query/p:num', 'search', function(query, num) {
            //       ...
            //     });
            //
            route: function (route, name, callback) {
                Backbone.history || (Backbone.history = new History);
                if (!_.isRegExp(route)) route = this._routeToRegExp(route);
                if (!callback) callback = this[name];
                Backbone.history.route(route, _.bind(function (fragment) {
                    var args = this._extractParameters(route, fragment);
                    callback && callback.apply(this, args);
                    this.trigger.apply(this, ['route:' + name].concat(args));
                    Backbone.history.trigger('route', this, name, args);
                }, this));
                return this;
            },

            // Simple proxy to `Backbone.history` to save a fragment into the history.
            navigate: function (fragment, options) {
                Backbone.history.navigate(fragment, options);
            },

            // Bind all defined routes to `Backbone.history`. We have to reverse the
            // order of the routes here to support behavior where the most general
            // routes can be defined at the bottom of the route map.
            _bindRoutes: function () {
                if (!this.routes) return;
                var routes = [];
                for (var route in this.routes) {
                    routes.unshift([route, this.routes[route]]);
                }
                for (var i = 0, l = routes.length; i < l; i++) {
                    this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
                }
            },

            // Convert a route string into a regular expression, suitable for matching
            // against the current location hash.
            _routeToRegExp: function (route) {
                route = route.replace(escapeRegExp, '\\$&').replace(namedParam, '([^\/]+)').replace(splatParam, '(.*?)');
                return new RegExp('^' + route + '$');
            },

            // Given a route, and a URL fragment that it matches, return the array of
            // extracted parameters.
            _extractParameters: function (route, fragment) {
                return route.exec(fragment).slice(1);
            }

        });

        // Backbone.History
        // ----------------

        // Handles cross-browser history management, based on URL fragments. If the
        // browser does not support `onhashchange`, falls back to polling.
        var History = Backbone.History = function () {
            this.handlers = [];
            _.bindAll(this, 'checkUrl');
        };

        // Cached regex for cleaning leading hashes and slashes .
        var routeStripper = /^[#\/]/;

        // Cached regex for detecting MSIE.
        var isExplorer = /msie [\w.]+/;

        // Has the history handling already been started?
        History.started = false;

        // Set up all inheritable **Backbone.History** properties and methods.
        _.extend(History.prototype, Events, {

            // The default interval to poll for hash changes, if necessary, is
            // twenty times a second.
            interval: 50,

            // Gets the true hash value. Cannot use location.hash directly due to bug
            // in Firefox where location.hash will always be decoded.
            getHash: function (windowOverride) {
                var loc = windowOverride ? windowOverride.location : window.location;
                var match = loc.href.match(/#(.*)$/);
                return match ? match[1] : '';
            },

            // Get the cross-browser normalized URL fragment, either from the URL,
            // the hash, or the override.
            getFragment: function (fragment, forcePushState) {
                if (fragment == null) {
                    if (this._hasPushState || forcePushState) {
                        fragment = window.location.pathname;
                        var search = window.location.search;
                        if (search) fragment += search;
                    } else {
                        fragment = this.getHash();
                    }
                }
                if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
                return fragment.replace(routeStripper, '');
            },

            // Start the hash change handling, returning `true` if the current URL matches
            // an existing route, and `false` otherwise.
            start: function (options) {
                if (History.started) throw new Error("Backbone.history has already been started");
                History.started = true;

                // Figure out the initial configuration. Do we need an iframe?
                // Is pushState desired ... is it available?
                this.options = _.extend({}, {
                    root: '/'
                }, this.options, options);
                this._wantsHashChange = this.options.hashChange !== false;
                this._wantsPushState = !! this.options.pushState;
                this._hasPushState = !! (this.options.pushState && window.history && window.history.pushState);
                var fragment = this.getFragment();
                var docMode = document.documentMode;
                var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

                if (oldIE) {
                    this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
                    this.navigate(fragment);
                }

                // Depending on whether we're using pushState or hashes, and whether
                // 'onhashchange' is supported, determine how we check the URL state.
                if (this._hasPushState) {
                    $(window).bind('popstate', this.checkUrl);
                } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
                    $(window).bind('hashchange', this.checkUrl);
                } else if (this._wantsHashChange) {
                    this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
                }

                // Determine if we need to change the base url, for a pushState link
                // opened by a non-pushState browser.
                this.fragment = fragment;
                var loc = window.location;
                var atRoot = loc.pathname == this.options.root;

                // If we've started off with a route from a `pushState`-enabled browser,
                // but we're currently in a browser that doesn't support it...
                if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
                    this.fragment = this.getFragment(null, true);
                    window.location.replace(this.options.root + '#' + this.fragment);
                    // Return immediately as browser will do redirect to new url
                    return true;

                    // Or if we've started out with a hash-based route, but we're currently
                    // in a browser where it could be `pushState`-based instead...
                } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
                    this.fragment = this.getHash().replace(routeStripper, '');
                    window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
                }

                if (!this.options.silent) {
                    return this.loadUrl();
                }
            },

            // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
            // but possibly useful for unit testing Routers.
            stop: function () {
                $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
                clearInterval(this._checkUrlInterval);
                History.started = false;
            },

            // Add a route to be tested when the fragment changes. Routes added later
            // may override previous routes.
            route: function (route, callback) {
                this.handlers.unshift({
                    route: route,
                    callback: callback
                });
            },

            // Checks the current URL to see if it has changed, and if it has,
            // calls `loadUrl`, normalizing across the hidden iframe.
            checkUrl: function (e) {
                var current = this.getFragment();
                if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
                if (current == this.fragment) return false;
                if (this.iframe) this.navigate(current);
                this.loadUrl() || this.loadUrl(this.getHash());
            },

            // Attempt to load the current URL fragment. If a route succeeds with a
            // match, returns `true`. If no defined routes matches the fragment,
            // returns `false`.
            loadUrl: function (fragmentOverride) {
                var fragment = this.fragment = this.getFragment(fragmentOverride);
                var matched = _.any(this.handlers, function (handler) {
                    if (handler.route.test(fragment)) {
                        handler.callback(fragment);
                        return true;
                    }
                });
                return matched;
            },

            // Save a fragment into the hash history, or replace the URL state if the
            // 'replace' option is passed. You are responsible for properly URL-encoding
            // the fragment in advance.
            //
            // The options object can contain `trigger: true` if you wish to have the
            // route callback be fired (not usually desirable), or `replace: true`, if
            // you wish to modify the current URL without adding an entry to the history.
            navigate: function (fragment, options) {
                if (!History.started) return false;
                if (!options || options === true) options = {
                    trigger: options
                };
                var frag = (fragment || '').replace(routeStripper, '');
                if (this.fragment == frag) return;

                // If pushState is available, we use it to set the fragment as a real URL.
                if (this._hasPushState) {
                    if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
                    this.fragment = frag;
                    window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

                    // If hash changes haven't been explicitly disabled, update the hash
                    // fragment to store history.
                } else if (this._wantsHashChange) {
                    this.fragment = frag;
                    this._updateHash(window.location, frag, options.replace);
                    if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
                        // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
                        // When replace is true, we don't want this.
                        if (!options.replace) this.iframe.document.open().close();
                        this._updateHash(this.iframe.location, frag, options.replace);
                    }

                    // If you've told us that you explicitly don't want fallback hashchange-
                    // based history, then `navigate` becomes a page refresh.
                } else {
                    window.location.assign(this.options.root + fragment);
                }
                if (options.trigger) this.loadUrl(fragment);
            },

            // Update the hash location, either replacing the current entry, or adding
            // a new one to the browser history.
            _updateHash: function (location, fragment, replace) {
                if (replace) {
                    location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
                } else {
                    location.hash = fragment;
                }
            }
        });

        // Backbone.View
        // -------------

        // Creating a Backbone.View creates its initial element outside of the DOM,
        // if an existing element is not provided...
        var View = Backbone.View = function (options) {
            this.cid = _.uniqueId('view');
            this._configure(options || {});
            this._ensureElement();
            this.initialize.apply(this, arguments);
            this.delegateEvents();
        };

        // Cached regex to split keys for `delegate`.
        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        // List of view options to be merged as properties.
        var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

        // Set up all inheritable **Backbone.View** properties and methods.
        _.extend(View.prototype, Events, {

            // The default `tagName` of a View's element is `"div"`.
            tagName: 'div',

            // jQuery delegate for element lookup, scoped to DOM elements within the
            // current view. This should be prefered to global lookups where possible.
            $: function (selector) {
                return this.$el.find(selector);
            },

            // Initialize is an empty function by default. Override it with your own
            // initialization logic.
            initialize: function () {},

            // **render** is the core function that your view should override, in order
            // to populate its element (`this.el`), with the appropriate HTML. The
            // convention is for **render** to always return `this`.
            render: function () {
                return this;
            },

            // Remove this view from the DOM. Note that the view isn't present in the
            // DOM by default, so calling this method may be a no-op.
            remove: function () {
                this.$el.remove();
                return this;
            },

            // For small amounts of DOM Elements, where a full-blown template isn't
            // needed, use **make** to manufacture elements, one at a time.
            //
            //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
            //
            make: function (tagName, attributes, content) {
                var el = document.createElement(tagName);
                if (attributes) $(el).attr(attributes);
                if (content) $(el).html(content);
                return el;
            },

            // Change the view's element (`this.el` property), including event
            // re-delegation.
            setElement: function (element, delegate) {
                if (this.$el) this.undelegateEvents();
                this.$el = (element instanceof $) ? element : $(element);
                this.el = this.$el[0];
                if (delegate !== false) this.delegateEvents();
                return this;
            },

            // Set callbacks, where `this.events` is a hash of
            //
            // *{"event selector": "callback"}*
            //
            //     {
            //       'mousedown .title':  'edit',
            //       'click .button':     'save'
            //       'click .open':       function(e) { ... }
            //     }
            //
            // pairs. Callbacks will be bound to the view, with `this` set properly.
            // Uses event delegation for efficiency.
            // Omitting the selector binds the event to `this.el`.
            // This only works for delegate-able events: not `focus`, `blur`, and
            // not `change`, `submit`, and `reset` in Internet Explorer.
            delegateEvents: function (events) {
                if (!(events || (events = getValue(this, 'events')))) return;
                this.undelegateEvents();
                for (var key in events) {
                    var method = events[key];
                    if (!_.isFunction(method)) method = this[events[key]];
                    if (!method) throw new Error('Method "' + events[key] + '" does not exist');
                    var match = key.match(delegateEventSplitter);
                    var eventName = match[1],
                        selector = match[2];
                    method = _.bind(method, this);
                    eventName += '.delegateEvents' + this.cid;
                    if (selector === '') {
                        this.$el.bind(eventName, method);
                    } else {
                        this.$el.delegate(selector, eventName, method);
                    }
                }
            },

            // Clears all callbacks previously bound to the view with `delegateEvents`.
            // You usually don't need to use this, but may wish to if you have multiple
            // Backbone views attached to the same DOM element.
            undelegateEvents: function () {
                this.$el.unbind('.delegateEvents' + this.cid);
            },

            // Performs the initial configuration of a View with a set of options.
            // Keys with special meaning *(model, collection, id, className)*, are
            // attached directly to the view.
            _configure: function (options) {
                if (this.options) options = _.extend({}, this.options, options);
                for (var i = 0, l = viewOptions.length; i < l; i++) {
                    var attr = viewOptions[i];
                    if (options[attr]) this[attr] = options[attr];
                }
                this.options = options;
            },

            // Ensure that the View has a DOM element to render into.
            // If `this.el` is a string, pass it through `$()`, take the first
            // matching element, and re-assign it to `el`. Otherwise, create
            // an element from the `id`, `className` and `tagName` properties.
            _ensureElement: function () {
                if (!this.el) {
                    var attrs = getValue(this, 'attributes') || {};
                    if (this.id) attrs.id = this.id;
                    if (this.className) attrs['class'] = this.className;
                    this.setElement(this.make(this.tagName, attrs), false);
                } else {
                    this.setElement(this.el, false);
                }
            }

        });

        // The self-propagating extend function that Backbone classes use.
        var extend = function (protoProps, classProps) {
            var child = inherits(this, protoProps, classProps);
            child.extend = this.extend;
            return child;
        };

        // Set up inheritance for the model, collection, and view.
        Model.extend = Collection.extend = Router.extend = View.extend = extend;

        // Backbone.sync
        // -------------

        // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
        var methodMap = {
            'create': 'POST',
            'update': 'PUT',
            'delete': 'DELETE',
            'read': 'GET'
        };

        // Override this function to change the manner in which Backbone persists
        // models to the server. You will be passed the type of request, and the
        // model in question. By default, makes a RESTful Ajax request
        // to the model's `url()`. Some possible customizations could be:
        //
        // * Use `setTimeout` to batch rapid-fire updates into a single request.
        // * Send up the models as XML instead of JSON.
        // * Persist models via WebSockets instead of Ajax.
        //
        // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
        // as `POST`, with a `_method` parameter containing the true HTTP method,
        // as well as all requests with the body as `application/x-www-form-urlencoded`
        // instead of `application/json` with the model in a param named `model`.
        // Useful when interfacing with server-side languages like **PHP** that make
        // it difficult to read the body of `PUT` requests.
        Backbone.sync = function (method, model, options) {
            var type = methodMap[method];

            // Default options, unless specified.
            options || (options = {});

            // Default JSON-request options.
            var params = {
                type: type,
                dataType: 'json'
            };

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = getValue(model, 'url') || urlError();
            }

            // Ensure that we have the appropriate request data.
            if (!options.data && model && (method == 'create' || method == 'update')) {
                params.contentType = 'application/json';
                params.data = JSON.stringify(model.toJSON());
            }

            // For older servers, emulate JSON by encoding the request into an HTML-form.
            if (Backbone.emulateJSON) {
                params.contentType = 'application/x-www-form-urlencoded';
                params.data = params.data ? {
                    model: params.data
                } : {};
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (Backbone.emulateHTTP) {
                if (type === 'PUT' || type === 'DELETE') {
                    if (Backbone.emulateJSON) params.data._method = type;
                    params.type = 'POST';
                    params.beforeSend = function (xhr) {
                        xhr.setRequestHeader('X-HTTP-Method-Override', type);
                    };
                }
            }

            // Don't process data on a non-GET request.
            if (params.type !== 'GET' && !Backbone.emulateJSON) {
                params.processData = false;
            }

            // Make the request, allowing the user to override any Ajax options.
            return $.ajax(_.extend(params, options));
        };

        // Wrap an optional error callback with a fallback error event.
        Backbone.wrapError = function (onError, originalModel, options) {
            return function (model, resp) {
                resp = model === originalModel ? resp : model;
                if (onError) {
                    onError(originalModel, resp, options);
                } else {
                    originalModel.trigger('error', originalModel, resp, options);
                }
            };
        };

        // Helpers
        // -------

        // Shared empty constructor function to aid in prototype-chain creation.
        var ctor = function () {};

        // Helper function to correctly set up the prototype chain, for subclasses.
        // Similar to `goog.inherits`, but uses a hash of prototype properties and
        // class properties to be extended.
        var inherits = function (parent, protoProps, staticProps) {
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    parent.apply(this, arguments);
                };
            }

            // Inherit class (static) properties from parent.
            _.extend(child, parent);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Add static properties to the constructor function, if supplied.
            if (staticProps) _.extend(child, staticProps);

            // Correctly set child's `prototype.constructor`.
            child.prototype.constructor = child;

            // Set a convenience property in case the parent's prototype is needed later.
            child.__super__ = parent.prototype;

            return child;
        };

        // Helper function to get a value from a Backbone object as a property
        // or as a function.
        var getValue = function (object, prop) {
            if (!(object && object[prop])) return null;
            return _.isFunction(object[prop]) ? object[prop]() : object[prop];
        };

        // Throw an error when a URL is needed, and none is supplied.
        var urlError = function () {
            throw new Error('A "url" property or function must be specified');
        };


    }).call(this);

/**
 * Backbone-relational.js 0.5.0
 * (c) 2011 Paul Uithol
 * 
 * Backbone-relational may be freely distributed under the MIT license; see the accompanying LICENSE.txt.
 * For details and documentation: https://github.com/PaulUithol/Backbone-relational.
 * Depends on Backbone (and thus on Underscore as well): https://github.com/documentcloud/backbone.
 */
    
    /**
     * CommonJS shim
     **/
    var _, Backbone, exports;
    if ( typeof window === 'undefined' ) {
        _ = require( 'underscore' );
        Backbone = require( 'backbone' );
        exports = module.exports = Backbone;
    }
    else {
        _ = window._;
        Backbone = window.Backbone;
        exports = window;
    }

    Backbone.Relational = {
        showWarnings: true
    };

    /**
     * Semaphore mixin; can be used as both binary and counting.
     **/
    Backbone.Semaphore = {
        _permitsAvailable: null,
        _permitsUsed: 0,
        
        acquire: function() {
            if ( this._permitsAvailable && this._permitsUsed >= this._permitsAvailable ) {
                throw new Error( 'Max permits acquired' );
            }
            else {
                this._permitsUsed++;
            }
        },
        
        release: function() {
            if ( this._permitsUsed === 0 ) {
                throw new Error( 'All permits released' );
            }
            else {
                this._permitsUsed--;
            }
        },
        
        isLocked: function() {
            return this._permitsUsed > 0;
        },
        
        setAvailablePermits: function( amount ) {
            if ( this._permitsUsed > amount ) {
                throw new Error( 'Available permits cannot be less than used permits' );
            }
            this._permitsAvailable = amount;
        }
    };
    
    /**
     * A BlockingQueue that accumulates items while blocked (via 'block'),
     * and processes them when unblocked (via 'unblock').
     * Process can also be called manually (via 'process').
     */
    Backbone.BlockingQueue = function() {
        this._queue = [];
    };
    _.extend( Backbone.BlockingQueue.prototype, Backbone.Semaphore, {
        _queue: null,
        
        add: function( func ) {
            if ( this.isBlocked() ) {
                this._queue.push( func );
            }
            else {
                func();
            }
        },
        
        process: function() {
            while ( this._queue && this._queue.length ) {
                this._queue.shift()();
            }
        },
        
        block: function() {
            this.acquire();
        },
        
        unblock: function() {
            this.release();
            if ( !this.isBlocked() ) {
                this.process();
            }
        },
        
        isBlocked: function() {
            return this.isLocked();
        }
    });
    /**
     * Global event queue. Accumulates external events ('add:<key>', 'remove:<key>' and 'update:<key>')
     * until the top-level object is fully initialized (see 'Backbone.RelationalModel').
     */
    Backbone.Relational.eventQueue = new Backbone.BlockingQueue();
    
    /**
     * Backbone.Store keeps track of all created (and destruction of) Backbone.RelationalModel.
     * Handles lookup for relations.
     */
    Backbone.Store = function() {
        this._collections = [];
        this._reverseRelations = [];
        this._subModels = [];
        this._modelScopes = [ exports ];
    };
    _.extend( Backbone.Store.prototype, Backbone.Events, {
        addModelScope: function( scope ) {
            this._modelScopes.push( scope );
        },

        /**
         * Add a set of subModelTypes to the store, that can be used to resolve the '_superModel'
         * for a model later in 'setupSuperModel'.
         *
         * @param {Backbone.RelationalModel} subModelTypes
         * @param {Backbone.RelationalModel} superModelType
         */
        addSubModels: function( subModelTypes, superModelType ) {
            this._subModels.push({
                'superModelType': superModelType,
                'subModels': subModelTypes
            });
        },

        /**
         * Check if the given modelType is registered as another model's subModel. If so, add it to the super model's
         * '_subModels', and set the modelType's '_superModel', '_subModelTypeName', and '_subModelTypeAttribute'.
         *
         * @param {Backbone.RelationalModel} modelType
         */
        setupSuperModel: function( modelType ) {
            _.find( this._subModels, function( subModelDef ) {
                return _.find( subModelDef.subModels, function( subModelTypeName, typeValue ) {
                    var subModelType = this.getObjectByName( subModelTypeName );

                    if ( modelType === subModelType ) {
                        // Set 'modelType' as a child of the found superModel
                        subModelDef.superModelType._subModels[ typeValue ] = modelType;

                        // Set '_superModel', '_subModelTypeValue', and '_subModelTypeAttribute' on 'modelType'.
                        modelType._superModel = subModelDef.superModelType;
                        modelType._subModelTypeValue = typeValue;
                        modelType._subModelTypeAttribute = subModelDef.superModelType.prototype.subModelTypeAttribute;
                        return true;
                    }
                }, this );
            }, this );
        },
        
        /**
         * Add a reverse relation. Is added to the 'relations' property on model's prototype, and to
         * existing instances of 'model' in the store as well.
         * @param {Object} relation
         * @param {Backbone.RelationalModel} relation.model
         * @param {String} relation.type
         * @param {String} relation.key
         * @param {String|Object} relation.relatedModel
         */
        addReverseRelation: function( relation ) {
            var exists = _.any( this._reverseRelations, function( rel ) {
                    return _.all( relation, function( val, key ) {
                            return val === rel[ key ];
                        });
                });
            
            if ( !exists && relation.model && relation.type ) {
                this._reverseRelations.push( relation );
                
                var addRelation = function( model, relation ) {
                    if ( !model.prototype.relations ) {
                        model.prototype.relations = [];
                    }
                    model.prototype.relations.push( relation );
                    
                    _.each( model._subModels, function( subModel ) {
                            addRelation( subModel, relation );
                        }, this );
                };
                
                addRelation( relation.model, relation );
                
                this.retroFitRelation( relation );
            }
        },
        
        /**
         * Add a 'relation' to all existing instances of 'relation.model' in the store
         * @param {Object} relation
         */
        retroFitRelation: function( relation ) {
            var coll = this.getCollection( relation.model );
            coll.each( function( model ) {
                if ( !( model instanceof relation.model ) ) {
                    return;
                }

                new relation.type( model, relation );
            }, this);
        },
        
        /**
         * Find the Store's collection for a certain type of model.
         * @param {Backbone.RelationalModel} model
         * @return {Backbone.Collection} A collection if found (or applicable for 'model'), or null
         */
        getCollection: function( model ) {
            if ( model instanceof Backbone.RelationalModel ) {
                model = model.constructor;
            }
            
            var rootModel = model;
            while ( rootModel._superModel ) {
                rootModel = rootModel._superModel;
            }
            
            var coll = _.detect( this._collections, function( c ) {
                    return c.model === rootModel;
                });
            
            if ( !coll ) {
                coll = this._createCollection( model );
            }
            
            return coll;
        },
        
        /**
         * Find a type on the global object by name. Splits name on dots.
         * @param {String} name
         * @return {Object}
         */
        getObjectByName: function( name ) {
            var parts = name.split( '.' ),
                type = null;

            _.find( this._modelScopes, function( scope ) {
                type = _.reduce( parts, function( memo, val ) {
                    return memo[ val ];
                }, scope );

                if ( type && type !== scope ) {
                    return true;
                }
            }, this );

            return type;
        },
        
        _createCollection: function( type ) {
            var coll;
            
            // If 'type' is an instance, take its constructor
            if ( type instanceof Backbone.RelationalModel ) {
                type = type.constructor;
            }
            
            // Type should inherit from Backbone.RelationalModel.
            if ( type.prototype instanceof Backbone.RelationalModel ) {
                coll = new Backbone.Collection();
                coll.model = type;
                
                this._collections.push( coll );
            }
            
            return coll;
        },

        /**
         * Find the attribute that is to be used as the `id` on a given object
         * @param type
         * @param {String|Number|Object|Backbone.RelationalModel} item
         */
        resolveIdForItem: function( type, item ) {
            var id = _.isString( item ) || _.isNumber( item ) ? item : null;

            if ( id == null ) {
                if ( item instanceof Backbone.RelationalModel ) {
                    id = item.id;
                }
                else if ( _.isObject( item ) ) {
                    id = item[ type.prototype.idAttribute ];
                }
            }

            return id;
        },

        /**
         *
         * @param type
         * @param {String|Number|Object|Backbone.RelationalModel} item
         */
        find: function( type, item ) {
            var id = this.resolveIdForItem( type, item );
            var coll = this.getCollection( type );
            
            // Because the found object could be of any of the type's superModel
            // types, only return it if it's actually of the type asked for.
            if ( coll ) {
                var obj = coll.get( id );

                if ( obj instanceof type ) {
                    return obj;
                }
            }

            return null;
        },
        
        /**
         * Add a 'model' to it's appropriate collection. Retain the original contents of 'model.collection'.
         * @param {Backbone.RelationalModel} model
         */
        register: function( model ) {
            var modelColl = model.collection;
            var coll = this.getCollection( model );
            coll && coll.add( model );
            model.bind( 'destroy', this.unregister, this );
            model.collection = modelColl;
        },
        
        /**
         * Explicitly update a model's id in it's store collection
         * @param {Backbone.RelationalModel} model
         */
        update: function( model ) {
            var coll = this.getCollection( model );
            coll._onModelEvent( 'change:' + model.idAttribute, model, coll );
        },
        
        /**
         * Remove a 'model' from the store.
         * @param {Backbone.RelationalModel} model
         */
        unregister: function( model ) {
            model.unbind( 'destroy', this.unregister );
            var coll = this.getCollection( model );
            coll && coll.remove( model );
        }
    });
    Backbone.Relational.store = new Backbone.Store();
    
    /**
     * The main Relation class, from which 'HasOne' and 'HasMany' inherit. Internally, 'relational:<key>' events
     * are used to regulate addition and removal of models from relations.
     *
     * @param {Backbone.RelationalModel} instance
     * @param {Object} options
     * @param {string} options.key
     * @param {Backbone.RelationalModel.constructor} options.relatedModel
     * @param {Boolean|String} [options.includeInJSON=true] Serialize the given attribute for related model(s)' in toJSON, or just their ids.
     * @param {Boolean} [options.createModels=true] Create objects from the contents of keys if the object is not found in Backbone.store.
     * @param {Object} [options.reverseRelation] Specify a bi-directional relation. If provided, Relation will reciprocate
     *    the relation to the 'relatedModel'. Required and optional properties match 'options', except that it also needs
     *    {Backbone.Relation|String} type ('HasOne' or 'HasMany').
     */
    Backbone.Relation = function( instance, options ) {
        this.instance = instance;
        // Make sure 'options' is sane, and fill with defaults from subclasses and this object's prototype
        options = _.isObject( options ) ? options : {};
        this.reverseRelation = _.defaults( options.reverseRelation || {}, this.options.reverseRelation );
        this.reverseRelation.type = !_.isString( this.reverseRelation.type ) ? this.reverseRelation.type :
            Backbone[ this.reverseRelation.type ] || Backbone.Relational.store.getObjectByName( this.reverseRelation.type );
        this.model = options.model || this.instance.constructor;
        this.options = _.defaults( options, this.options, Backbone.Relation.prototype.options );
        
        this.key = this.options.key;
        this.keySource = this.options.keySource || this.key;
        this.keyDestination = this.options.keyDestination || this.keySource || this.key;

        // 'exports' should be the global object where 'relatedModel' can be found on if given as a string.
        this.relatedModel = this.options.relatedModel;
        if ( _.isString( this.relatedModel ) ) {
            this.relatedModel = Backbone.Relational.store.getObjectByName( this.relatedModel );
        }

        if ( !this.checkPreconditions() ) {
            return false;
        }

        if ( instance ) {
            this.keyContents = this.instance.get( this.keySource );

            // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
            if ( this.key !== this.keySource ) {
                this.instance.unset( this.keySource, { silent: true } );
            }

            // Add this Relation to instance._relations
            this.instance._relations.push( this );
        }

        // Add the reverse relation on 'relatedModel' to the store's reverseRelations
        if ( !this.options.isAutoRelation && this.reverseRelation.type && this.reverseRelation.key ) {
            Backbone.Relational.store.addReverseRelation( _.defaults( {
                    isAutoRelation: true,
                    model: this.relatedModel,
                    relatedModel: this.model,
                    reverseRelation: this.options // current relation is the 'reverseRelation' for it's own reverseRelation
                },
                this.reverseRelation // Take further properties from this.reverseRelation (type, key, etc.)
            ) );
        }

        _.bindAll( this, '_modelRemovedFromCollection', '_relatedModelAdded', '_relatedModelRemoved' );

        if ( instance ) {
            this.initialize();

            // When a model in the store is destroyed, check if it is 'this.instance'.
            Backbone.Relational.store.getCollection( this.instance )
                .bind( 'relational:remove', this._modelRemovedFromCollection );

            // When 'relatedModel' are created or destroyed, check if it affects this relation.
            Backbone.Relational.store.getCollection( this.relatedModel )
                .bind( 'relational:add', this._relatedModelAdded )
                .bind( 'relational:remove', this._relatedModelRemoved );
        }
    };
    // Fix inheritance :\
    Backbone.Relation.extend = Backbone.Model.extend;
    // Set up all inheritable **Backbone.Relation** properties and methods.
    _.extend( Backbone.Relation.prototype, Backbone.Events, Backbone.Semaphore, {
        options: {
            createModels: true,
            includeInJSON: true,
            isAutoRelation: false
        },
        
        instance: null,
        key: null,
        keyContents: null,
        relatedModel: null,
        reverseRelation: null,
        related: null,
        
        _relatedModelAdded: function( model, coll, options ) {
            // Allow 'model' to set up it's relations, before calling 'tryAddRelated'
            // (which can result in a call to 'addRelated' on a relation of 'model')
            var dit = this;
            model.queue( function() {
                dit.tryAddRelated( model, options );
            });
        },
        
        _relatedModelRemoved: function( model, coll, options ) {
            this.removeRelated( model, options );
        },
        
        _modelRemovedFromCollection: function( model ) {
            if ( model === this.instance ) {
                this.destroy();
            }
        },
        
        /**
         * Check several pre-conditions.
         * @return {Boolean} True if pre-conditions are satisfied, false if they're not.
         */
        checkPreconditions: function() {
            var i = this.instance,
                k = this.key,
                m = this.model,
                rm = this.relatedModel,
                warn = Backbone.Relational.showWarnings && typeof console !== 'undefined';

            if ( !m || !k || !rm ) {
                warn && console.warn( 'Relation=%o; no model, key or relatedModel (%o, %o, %o)', this, m, k, rm );
                return false;
            }
            // Check if the type in 'model' inherits from Backbone.RelationalModel
            if ( !( m.prototype instanceof Backbone.RelationalModel ) ) {
                warn && console.warn( 'Relation=%o; model does not inherit from Backbone.RelationalModel (%o)', this, i );
                return false;
            }
            // Check if the type in 'relatedModel' inherits from Backbone.RelationalModel
            if ( !( rm.prototype instanceof Backbone.RelationalModel ) ) {
                warn && console.warn( 'Relation=%o; relatedModel does not inherit from Backbone.RelationalModel (%o)', this, rm );
                return false;
            }
            // Check if this is not a HasMany, and the reverse relation is HasMany as well
            if ( this instanceof Backbone.HasMany && this.reverseRelation.type === Backbone.HasMany ) {
                warn && console.warn( 'Relation=%o; relation is a HasMany, and the reverseRelation is HasMany as well.', this );
                return false;
            }

            // Check if we're not attempting to create a duplicate relationship
            if ( i && i._relations.length ) {
                var exists = _.any( i._relations, function( rel ) {
                        var hasReverseRelation = this.reverseRelation.key && rel.reverseRelation.key;
                        return rel.relatedModel === rm && rel.key === k &&
                            ( !hasReverseRelation || this.reverseRelation.key === rel.reverseRelation.key );
                    }, this );

                if ( exists ) {
                    warn && console.warn( 'Relation=%o between instance=%o.%s and relatedModel=%o.%s already exists',
                        this, i, k, rm, this.reverseRelation.key );
                    return false;
                }
            }

            return true;
        },

        /**
         * Set the related model(s) for this relation
         * @param {Backbone.Mode|Backbone.Collection} related
         * @param {Object} [options]
         */
        setRelated: function( related, options ) {
            this.related = related;

            this.instance.acquire();
            this.instance.set( this.key, related, _.defaults( options || {}, { silent: true } ) );
            this.instance.release();
        },
        
        /**
         * Determine if a relation (on a different RelationalModel) is the reverse
         * relation of the current one.
         * @param {Backbone.Relation} relation
         * @return {Boolean}
         */
        _isReverseRelation: function( relation ) {
            if ( relation.instance instanceof this.relatedModel && this.reverseRelation.key === relation.key &&
                    this.key === relation.reverseRelation.key ) {
                return true;
            }
            return false;
        },
        
        /**
         * Get the reverse relations (pointing back to 'this.key' on 'this.instance') for the currently related model(s).
         * @param {Backbone.RelationalModel} [model] Get the reverse relations for a specific model.
         *    If not specified, 'this.related' is used.
         * @return {Backbone.Relation[]}
         */
        getReverseRelations: function( model ) {
            var reverseRelations = [];
            // Iterate over 'model', 'this.related.models' (if this.related is a Backbone.Collection), or wrap 'this.related' in an array.
            var models = !_.isUndefined( model ) ? [ model ] : this.related && ( this.related.models || [ this.related ] );
            _.each( models , function( related ) {
                    _.each( related.getRelations(), function( relation ) {
                            if ( this._isReverseRelation( relation ) ) {
                                reverseRelations.push( relation );
                            }
                        }, this );
                }, this );
            
            return reverseRelations;
        },
        
        /**
         * Rename options.silent to options.silentChange, so events propagate properly.
         * (for example in HasMany, from 'addRelated'->'handleAddition')
         * @param {Object} [options]
         * @return {Object}
         */
        sanitizeOptions: function( options ) {
            options = options ? _.clone( options ) : {};
            if ( options.silent ) {
                options.silentChange = true;
                delete options.silent;
            }
            return options;
        },

        /**
         * Rename options.silentChange to options.silent, so events are silenced as intended in Backbone's
         * original functions.
         * @param {Object} [options]
         * @return {Object}
         */
        unsanitizeOptions: function( options ) {
            options = options ? _.clone( options ) : {};
            if ( options.silentChange ) {
                options.silent = true;
                delete options.silentChange;
            }
            return options;
        },
        
        // Cleanup. Get reverse relation, call removeRelated on each.
        destroy: function() {
            Backbone.Relational.store.getCollection( this.instance )
                .unbind( 'relational:remove', this._modelRemovedFromCollection );
            
            Backbone.Relational.store.getCollection( this.relatedModel )
                .unbind( 'relational:add', this._relatedModelAdded )
                .unbind( 'relational:remove', this._relatedModelRemoved );
            
            _.each( this.getReverseRelations(), function( relation ) {
                    relation.removeRelated( this.instance );
                }, this );
        }
    });
    
    Backbone.HasOne = Backbone.Relation.extend({
        options: {
            reverseRelation: { type: 'HasMany' }
        },
        
        initialize: function() {
            _.bindAll( this, 'onChange' );

            this.instance.bind( 'relational:change:' + this.key, this.onChange );

            var model = this.findRelated( { silent: true } );
            this.setRelated( model );

            // Notify new 'related' object of the new relation.
            _.each( this.getReverseRelations(), function( relation ) {
                    relation.addRelated( this.instance );
                }, this );
        },
        
        findRelated: function( options ) {
            var item = this.keyContents;
            var model = null;
            
            if ( item instanceof this.relatedModel ) {
                model = item;
            }
            else if ( item ) {
                model = this.relatedModel.findOrCreate( item, { create: this.options.createModels } );
            }
            
            return model;
        },
        
        /**
         * If the key is changed, notify old & new reverse relations and initialize the new relation
         */
        onChange: function( model, attr, options ) {
            // Don't accept recursive calls to onChange (like onChange->findRelated->findOrCreate->initializeRelations->addRelated->onChange)
            if ( this.isLocked() ) {
                return;
            }
            this.acquire();
            options = this.sanitizeOptions( options );
            
            // 'options._related' is set by 'addRelated'/'removeRelated'. If it is set, the change
            // is the result of a call from a relation. If it's not, the change is the result of 
            // a 'set' call on this.instance.
            var changed = _.isUndefined( options._related );
            var oldRelated = changed ? this.related : options._related;
            
            if ( changed ) {    
                this.keyContents = attr;
                
                // Set new 'related'
                if ( attr instanceof this.relatedModel ) {
                    this.related = attr;
                }
                else if ( attr ) {
                    var related = this.findRelated( options );
                    this.setRelated( related );
                }
                else {
                    this.setRelated( null );
                }
            }
            
            // Notify old 'related' object of the terminated relation
            if ( oldRelated && this.related !== oldRelated ) {
                _.each( this.getReverseRelations( oldRelated ), function( relation ) {
                        relation.removeRelated( this.instance, options );
                    }, this );
            }
            
            // Notify new 'related' object of the new relation. Note we do re-apply even if this.related is oldRelated;
            // that can be necessary for bi-directional relations if 'this.instance' was created after 'this.related'.
            // In that case, 'this.instance' will already know 'this.related', but the reverse might not exist yet.
            _.each( this.getReverseRelations(), function( relation ) {
                    relation.addRelated( this.instance, options );
                }, this);
            
            // Fire the 'update:<key>' event if 'related' was updated
            if ( !options.silentChange && this.related !== oldRelated ) {
                var dit = this;
                Backbone.Relational.eventQueue.add( function() {
                    dit.instance.trigger( 'update:' + dit.key, dit.instance, dit.related, options );
                });
            }
            this.release();
        },
        
        /**
         * If a new 'this.relatedModel' appears in the 'store', try to match it to the last set 'keyContents'
         */
        tryAddRelated: function( model, options ) {
            if ( this.related ) {
                return;
            }
            options = this.sanitizeOptions( options );
            
            var item = this.keyContents;
            if ( item ) {
                var id = Backbone.Relational.store.resolveIdForItem( this.relatedModel, item );
                if ( model.id === id ) {
                    this.addRelated( model, options );
                }
            }
        },
        
        addRelated: function( model, options ) {
            if ( model !== this.related ) {
                var oldRelated = this.related || null;
                this.setRelated( model );
                this.onChange( this.instance, model, { _related: oldRelated } );
            }
        },
        
        removeRelated: function( model, options ) {
            if ( !this.related ) {
                return;
            }
            
            if ( model === this.related ) {
                var oldRelated = this.related || null;
                this.setRelated( null );
                this.onChange( this.instance, model, { _related: oldRelated } );
            }
        }
    });
    
    Backbone.HasMany = Backbone.Relation.extend({
        collectionType: null,
        
        options: {
            reverseRelation: { type: 'HasOne' },
            collectionType: Backbone.Collection,
            collectionKey: true,
            collectionOptions: {}
        },
        
        initialize: function() {
            _.bindAll( this, 'onChange', 'handleAddition', 'handleRemoval', 'handleReset' );
            this.instance.bind( 'relational:change:' + this.key, this.onChange );
            
            // Handle a custom 'collectionType'
            this.collectionType = this.options.collectionType;
            if ( _.isString( this.collectionType ) ) {
                this.collectionType = Backbone.Relational.store.getObjectByName( this.collectionType );
            }
            if ( !this.collectionType.prototype instanceof Backbone.Collection ){
                throw new Error( 'collectionType must inherit from Backbone.Collection' );
            }

            // Handle cases where a model/relation is created with a collection passed straight into 'attributes'
            if ( this.keyContents instanceof Backbone.Collection ) {
                this.setRelated( this._prepareCollection( this.keyContents ) );
            }
            else {
                this.setRelated( this._prepareCollection() );
            }

            this.findRelated( { silent: true } );
        },
        
        _getCollectionOptions: function() {
            return _.isFunction( this.options.collectionOptions ) ?
                this.options.collectionOptions( this.instance ) :
                this.options.collectionOptions;
        },

        /**
         * Bind events and setup collectionKeys for a collection that is to be used as the backing store for a HasMany.
         * If no 'collection' is supplied, a new collection will be created of the specified 'collectionType' option.
         * @param {Backbone.Collection} [collection]
         */
        _prepareCollection: function( collection ) {
            if ( this.related ) {
                this.related
                    .unbind( 'relational:add', this.handleAddition )
                    .unbind( 'relational:remove', this.handleRemoval )
                    .unbind( 'relational:reset', this.handleReset )
            }

            if ( !collection || !( collection instanceof Backbone.Collection ) ) {
                collection = new this.collectionType( [], this._getCollectionOptions() );
            }

            collection.model = this.relatedModel;
            
            if ( this.options.collectionKey ) {
                var key = this.options.collectionKey === true ? this.options.reverseRelation.key : this.options.collectionKey;
                
                if ( collection[ key ] && collection[ key ] !== this.instance ) {
                    if ( Backbone.Relational.showWarnings && typeof console !== 'undefined' ) {
                        console.warn( 'Relation=%o; collectionKey=%s already exists on collection=%o', this, key, this.options.collectionKey );
                    }
                }
                else if ( key ) {
                    collection[ key ] = this.instance;
                }
            }
            
            collection
                .bind( 'relational:add', this.handleAddition )
                .bind( 'relational:remove', this.handleRemoval )
                .bind( 'relational:reset', this.handleReset );
            
            return collection;
        },
        
        findRelated: function( options ) {
            if ( this.keyContents ) {
                var models = [];

                if ( this.keyContents instanceof Backbone.Collection ) {
                    models = this.keyContents.models;
                }
                else {
                    // Handle cases the an API/user supplies just an Object/id instead of an Array
                    this.keyContents = _.isArray( this.keyContents ) ? this.keyContents : [ this.keyContents ];

                    // Try to find instances of the appropriate 'relatedModel' in the store
                    _.each( this.keyContents, function( item ) {
                            var model = null;
                            if ( item instanceof this.relatedModel ) {
                                model = item;
                            }
                            else {
                                model = this.relatedModel.findOrCreate( item, { create: this.options.createModels } );
                            }

                            if ( model && !this.related.getByCid( model ) && !this.related.get( model ) ) {
                                models.push( model );
                            }
                        }, this );
                }

                // Add all found 'models' in on go, so 'add' will only be called once (and thus 'sort', etc.)
                if ( models.length ) {
                    options = this.unsanitizeOptions( options );
                    this.related.add( models, options );
                }
            }
        },
        
        /**
         * If the key is changed, notify old & new reverse relations and initialize the new relation
         */
        onChange: function( model, attr, options ) {
            options = this.sanitizeOptions( options );
            this.keyContents = attr;
            
            // Notify old 'related' object of the terminated relation
            _.each( this.getReverseRelations(), function( relation ) {
                    relation.removeRelated( this.instance, options );
                }, this );
            
            // Replace 'this.related' by 'attr' if it is a Backbone.Collection
            if ( attr instanceof Backbone.Collection ) {
                this._prepareCollection( attr );
                this.related = attr;
            }
            // Otherwise, 'attr' should be an array of related object ids.
            // Re-use the current 'this.related' if it is a Backbone.Collection, and remove any current entries.
            // Otherwise, create a new collection.
            else {
                var coll;

                if ( this.related instanceof Backbone.Collection ) {
                    coll = this.related;
                    coll.remove( coll.models );
                }
                else {
                    coll = this._prepareCollection();
                }

                this.setRelated( coll );
                this.findRelated( options );
            }
            
            // Notify new 'related' object of the new relation
            _.each( this.getReverseRelations(), function( relation ) {
                    relation.addRelated( this.instance, options );
                }, this );
            
            var dit = this;
            Backbone.Relational.eventQueue.add( function() {
                !options.silentChange && dit.instance.trigger( 'update:' + dit.key, dit.instance, dit.related, options );
            });
        },
        
        tryAddRelated: function( model, options ) {
            options = this.sanitizeOptions( options );
            if ( !this.related.getByCid( model ) && !this.related.get( model ) ) {
                // Check if this new model was specified in 'this.keyContents'
                var item = _.any( this.keyContents, function( item ) {
                        var id = Backbone.Relational.store.resolveIdForItem( this.relatedModel, item );
                        return id && id === model.id;
                    }, this );
                
                if ( item ) {
                    this.related.add( model, options );
                }
            }
        },
        
        /**
         * When a model is added to a 'HasMany', trigger 'add' on 'this.instance' and notify reverse relations.
         * (should be 'HasOne', must set 'this.instance' as their related).
         */
        handleAddition: function( model, coll, options ) {
            //console.debug('handleAddition called; args=%o', arguments);
            // Make sure the model is in fact a valid model before continuing.
            // (it can be invalid as a result of failing validation in Backbone.Collection._prepareModel)
            if ( !( model instanceof Backbone.Model ) ) {
                return;
            }
            
            options = this.sanitizeOptions( options );
            
            _.each( this.getReverseRelations( model ), function( relation ) {
                    relation.addRelated( this.instance, options );
                }, this );

            // Only trigger 'add' once the newly added model is initialized (so, has it's relations set up)
            var dit = this;
            Backbone.Relational.eventQueue.add( function() {
                !options.silentChange && dit.instance.trigger( 'add:' + dit.key, model, dit.related, options );
            });
        },
        
        /**
         * When a model is removed from a 'HasMany', trigger 'remove' on 'this.instance' and notify reverse relations.
         * (should be 'HasOne', which should be nullified)
         */
        handleRemoval: function( model, coll, options ) {
            //console.debug('handleRemoval called; args=%o', arguments);
            if ( !( model instanceof Backbone.Model ) ) {
                return;
            }

            options = this.sanitizeOptions( options );
            
            _.each( this.getReverseRelations( model ), function( relation ) {
                    relation.removeRelated( this.instance, options );
                }, this );
            
            var dit = this;
            Backbone.Relational.eventQueue.add( function() {
                !options.silentChange && dit.instance.trigger( 'remove:' + dit.key, model, dit.related, options );
            });
        },

        handleReset: function( coll, options ) {
            options = this.sanitizeOptions( options );

            var dit = this;
            Backbone.Relational.eventQueue.add( function() {
                !options.silentChange && dit.instance.trigger( 'reset:' + dit.key, dit.related, options );
            });
        },
        
        addRelated: function( model, options ) {
            var dit = this;
            options = this.unsanitizeOptions( options );
            model.queue( function() { // Queued to avoid errors for adding 'model' to the 'this.related' set twice
                if ( dit.related && !dit.related.getByCid( model ) && !dit.related.get( model ) ) {
                    dit.related.add( model, options );
                }
            });
        },
        
        removeRelated: function( model, options ) {
            options = this.unsanitizeOptions( options );
            if ( this.related.getByCid( model ) || this.related.get( model ) ) {
                this.related.remove( model, options );
            }
        }
    });
    
    /**
     * A type of Backbone.Model that also maintains relations to other models and collections.
     * New events when compared to the original:
     *  - 'add:<key>' (model, related collection, options)
     *  - 'remove:<key>' (model, related collection, options)
     *  - 'update:<key>' (model, related model or collection, options)
     */
    Backbone.RelationalModel = Backbone.Model.extend({
        relations: null, // Relation descriptions on the prototype
        _relations: null, // Relation instances
        _isInitialized: false,
        _deferProcessing: false,
        _queue: null,
        
        subModelTypeAttribute: 'type',
        subModelTypes: null,
        
        constructor: function( attributes, options ) {
            // Nasty hack, for cases like 'model.get( <HasMany key> ).add( item )'.
            // Defer 'processQueue', so that when 'Relation.createModels' is used we:
            // a) Survive 'Backbone.Collection.add'; this takes care we won't error on "can't add model to a set twice"
            //    (by creating a model from properties, having the model add itself to the collection via one of
            //    it's relations, then trying to add it to the collection).
            // b) Trigger 'HasMany' collection events only after the model is really fully set up.
            // Example that triggers both a and b: "p.get('jobs').add( { company: c, person: p } )".
            var dit = this;
            if ( options && options.collection ) {
                this._deferProcessing = true;
                
                var processQueue = function( model ) {
                    if ( model === dit ) {
                        dit._deferProcessing = false;
                        dit.processQueue();
                        options.collection.unbind( 'relational:add', processQueue );
                    }
                };
                options.collection.bind( 'relational:add', processQueue );
                
                // So we do process the queue eventually, regardless of whether this model really gets added to 'options.collection'.
                _.defer( function() {
                    processQueue( dit );
                });
            }
            
            this._queue = new Backbone.BlockingQueue();
            this._queue.block();
            Backbone.Relational.eventQueue.block();
            
            Backbone.Model.apply( this, arguments );
            
            // Try to run the global queue holding external events
            Backbone.Relational.eventQueue.unblock();
        },
        
        /**
         * Override 'trigger' to queue 'change' and 'change:*' events
         */
        trigger: function( eventName ) {
            if ( eventName.length > 5 && 'change' === eventName.substr( 0, 6 ) ) {
                var dit = this, args = arguments;
                Backbone.Relational.eventQueue.add( function() {
                        Backbone.Model.prototype.trigger.apply( dit, args );
                    });
            }
            else {
                Backbone.Model.prototype.trigger.apply( this, arguments );
            }
            
            return this;
        },
        
        /**
         * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
         * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
         */
        initializeRelations: function() {
            this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
            this._relations = [];
            
            _.each( this.relations, function( rel ) {
                    var type = !_.isString( rel.type ) ? rel.type : Backbone[ rel.type ] || Backbone.Relational.store.getObjectByName( rel.type );
                    if ( type && type.prototype instanceof Backbone.Relation ) {
                        new type( this, rel ); // Also pushes the new Relation into _relations
                    }
                    else {
                        Backbone.Relational.showWarnings && typeof console !== 'undefined' && console.warn( 'Relation=%o; missing or invalid type!', rel );
                    }
                }, this );
            
            this._isInitialized = true;
            this.release();
            this.processQueue();
        },

        /**
         * When new values are set, notify this model's relations (also if options.silent is set).
         * (Relation.setRelated locks this model before calling 'set' on it to prevent loops)
         */
        updateRelations: function( options ) {
            if ( this._isInitialized && !this.isLocked() ) {
                _.each( this._relations, function( rel ) {
                    // Update from data in `rel.keySource` if set, or `rel.key` otherwise
                    var val = this.attributes[ rel.keySource ] || this.attributes[ rel.key ];
                    if ( rel.related !== val ) {
                        this.trigger( 'relational:change:' + rel.key, this, val, options || {} );
                    }
                }, this );
            }
        },
        
        /**
         * Either add to the queue (if we're not initialized yet), or execute right away.
         */
        queue: function( func ) {
            this._queue.add( func );
        },
        
        /**
         * Process _queue
         */
        processQueue: function() {
            if ( this._isInitialized && !this._deferProcessing && this._queue.isBlocked() ) {
                this._queue.unblock();
            }
        },
        
        /**
         * Get a specific relation.
         * @param key {string} The relation key to look for.
         * @return {Backbone.Relation} An instance of 'Backbone.Relation', if a relation was found for 'key', or null.
         */
        getRelation: function( key ) {
            return _.detect( this._relations, function( rel ) {
                if ( rel.key === key ) {
                    return true;
                }
            }, this );
        },
        
        /**
         * Get all of the created relations.
         * @return {Backbone.Relation[]}
         */
        getRelations: function() {
            return this._relations;
        },
        
        /**
         * Retrieve related objects.
         * @param key {string} The relation key to fetch models for.
         * @param options {Object} Options for 'Backbone.Model.fetch' and 'Backbone.sync'.
         * @param update {boolean} Whether to force a fetch from the server (updating existing models).
         * @return {jQuery.when[]} An array of request objects
         */
        fetchRelated: function( key, options, update ) {
            options || ( options = {} );
            var setUrl,
                requests = [],
                rel = this.getRelation( key ),
                keyContents = rel && rel.keyContents,
                toFetch = keyContents && _.select( _.isArray( keyContents ) ? keyContents : [ keyContents ], function( item ) {
                    var id = Backbone.Relational.store.resolveIdForItem( rel.relatedModel, item );
                    return id && ( update || !Backbone.Relational.store.find( rel.relatedModel, id ) );
                }, this );
            
            if ( toFetch && toFetch.length ) {
                // Create a model for each entry in 'keyContents' that is to be fetched
                var models = _.map( toFetch, function( item ) {
                    var model;

                    if ( _.isObject( item ) ) {
                        model = rel.relatedModel.build( item );
                    }
                    else {
                        var attrs = {};
                        attrs[ rel.relatedModel.prototype.idAttribute ] = item;
                        model = rel.relatedModel.build( attrs );
                    }

                    return model;
                }, this );
                
                // Try if the 'collection' can provide a url to fetch a set of models in one request.
                if ( rel.related instanceof Backbone.Collection && _.isFunction( rel.related.url ) ) {
                    setUrl = rel.related.url( models );
                }
                
                // An assumption is that when 'Backbone.Collection.url' is a function, it can handle building of set urls.
                // To make sure it can, test if the url we got by supplying a list of models to fetch is different from
                // the one supplied for the default fetch action (without args to 'url').
                if ( setUrl && setUrl !== rel.related.url() ) {
                    var opts = _.defaults(
                        {
                            error: function() {
                                var args = arguments;
                                _.each( models, function( model ) {
                                        model.trigger( 'destroy', model, model.collection, options );
                                        options.error && options.error.apply( model, args );
                                    });
                            },
                            url: setUrl
                        },
                        options,
                        { add: true }
                    );

                    requests = [ rel.related.fetch( opts ) ];
                }
                else {
                    requests = _.map( models, function( model ) {
                        var opts = _.defaults(
                            {
                                error: function() {
                                    model.trigger( 'destroy', model, model.collection, options );
                                    options.error && options.error.apply( model, arguments );
                                }
                            },
                            options
                        );
                        return model.fetch( opts );
                    }, this );
                }
            }
            
            return requests;
        },
        
        set: function( key, value, options ) {
            Backbone.Relational.eventQueue.block();
            
            // Duplicate backbone's behavior to allow separate key/value parameters, instead of a single 'attributes' object
            var attributes;
            if ( _.isObject( key ) || key == null ) {
                attributes = key;
                options = value;
            }
            else {
                attributes = {};
                attributes[ key ] = value;
            }
            
            var result = Backbone.Model.prototype.set.apply( this, arguments );
            
            // Ideal place to set up relations :)
            if ( !this._isInitialized && !this.isLocked() ) {
                this.constructor.initializeModelHierarchy();

                Backbone.Relational.store.register( this );

                this.initializeRelations();
            }
            // Update the 'idAttribute' in Backbone.store if; we don't want it to miss an 'id' update due to {silent:true}
            else if ( attributes && this.idAttribute in attributes ) {
                Backbone.Relational.store.update( this );
            }
            
            if ( attributes ) {
                this.updateRelations( options );
            }
            
            // Try to run the global queue holding external events
            Backbone.Relational.eventQueue.unblock();
            
            return result;
        },
        
        unset: function( attribute, options ) {
            Backbone.Relational.eventQueue.block();
            
            var result = Backbone.Model.prototype.unset.apply( this, arguments );
            this.updateRelations( options );
            
            // Try to run the global queue holding external events
            Backbone.Relational.eventQueue.unblock();
            
            return result;
        },
        
        clear: function( options ) {
            Backbone.Relational.eventQueue.block();
            
            var result = Backbone.Model.prototype.clear.apply( this, arguments );
            this.updateRelations( options );
            
            // Try to run the global queue holding external events
            Backbone.Relational.eventQueue.unblock();
            
            return result;
        },
        
        /**
         * Override 'change', so the change will only execute after 'set' has finised (relations are updated),
         * and 'previousAttributes' will be available when the event is fired.
         */
        change: function( options ) {
            var dit = this, args = arguments;
            Backbone.Relational.eventQueue.add( function() {
                    Backbone.Model.prototype.change.apply( dit, args );
                });
        },

        clone: function() {
            var attributes = _.clone( this.attributes );
            if ( !_.isUndefined( attributes[ this.idAttribute ] ) ) {
                attributes[ this.idAttribute ] = null;
            }

            _.each( this.getRelations(), function( rel ) {
                    delete attributes[ rel.key ];
                });

            return new this.constructor( attributes );
        },
        
        /**
         * Convert relations to JSON, omits them when required
         */
        toJSON: function() {
            // If this Model has already been fully serialized in this branch once, return to avoid loops
            if ( this.isLocked() ) {
                return this.id;
            }
            
            this.acquire();
            var json = Backbone.Model.prototype.toJSON.call( this );
            
            if ( this.constructor._superModel && !( this.constructor._subModelTypeAttribute in json ) ) {
                json[ this.constructor._subModelTypeAttribute ] = this.constructor._subModelTypeValue;
            }
            
            _.each( this._relations, function( rel ) {
                    var value = json[ rel.key ];

                    if ( rel.options.includeInJSON === true) {
                        if ( value && _.isFunction( value.toJSON ) ) {
                            json[ rel.keyDestination ] = value.toJSON();
                        }
                        else {
                            json[ rel.keyDestination ] = null;
                        }
                    }
                    else if ( _.isString( rel.options.includeInJSON ) ) {
                        if ( value instanceof Backbone.Collection ) {
                            json[ rel.keyDestination ] = value.pluck( rel.options.includeInJSON );
                        }
                        else if ( value instanceof Backbone.Model ) {
                            json[ rel.keyDestination ] = value.get( rel.options.includeInJSON );
                        }   
                        else {
                            json[ rel.keyDestination ] = null;
                        }
                    }
                    else if ( _.isArray( rel.options.includeInJSON ) ) {
                        if ( value instanceof Backbone.Collection ) {
                            var valueSub = [];
                            value.each( function( model ) {
                                var curJson = {};
                                _.each( rel.options.includeInJSON, function( key ) {
                                    curJson[ key ] = model.get( key );
                                });
                                valueSub.push( curJson );
                            });
                            json[ rel.keyDestination ] = valueSub;
                        }
                        else if ( value instanceof Backbone.Model ) {
                            var valueSub = {};
                            _.each( rel.options.includeInJSON, function( key ) {
                                valueSub[ key ] = value.get( key );
                            });
                            json[ rel.keyDestination ] = valueSub;
                        }
                        else {
                            json[ rel.keyDestination ] = null;
                        }
                    }
                    else {
                        delete json[ rel.key ];
                    }

                    if ( rel.keyDestination !== rel.key ) {
                        delete json[ rel.key ];
                    }
                });
            
            this.release();
            return json;
        }
    },
    {
        setup: function( superModel ) {
            // We don't want to share a relations array with a parent, as this will cause problems with
            // reverse relations.
            this.prototype.relations = ( this.prototype.relations || [] ).slice( 0 );

            this._subModels = {};
            this._superModel = null;

            // If this model has 'subModelTypes' itself, remember them in the store
            if ( this.prototype.hasOwnProperty( 'subModelTypes' ) ) {
                Backbone.Relational.store.addSubModels( this.prototype.subModelTypes, this );
            }
            // The 'subModelTypes' property should not be inherited, so reset it.
            else {
                this.prototype.subModelTypes = null;
            }

            // Initialize all reverseRelations that belong to this new model.
            _.each( this.prototype.relations, function( rel ) {
                    if ( !rel.model ) {
                        rel.model = this;
                    }

                    if ( rel.reverseRelation && rel.model === this ) {              
                        var preInitialize = true;
                        if ( _.isString( rel.relatedModel ) ) {
                            /**
                             * The related model might not be defined for two reasons
                             *  1. it never gets defined, e.g. a typo
                             *  2. it is related to itself
                             * In neither of these cases do we need to pre-initialize reverse relations.
                             */
                            var relatedModel = Backbone.Relational.store.getObjectByName( rel.relatedModel );
                            preInitialize = relatedModel && ( relatedModel.prototype instanceof Backbone.RelationalModel );
                        }

                        var type = !_.isString( rel.type ) ? rel.type : Backbone[ rel.type ] || Backbone.Relational.store.getObjectByName( rel.type );
                        if ( preInitialize && type && type.prototype instanceof Backbone.Relation ) {
                            new type( null, rel );
                        }
                    }
                }, this );
        },

        /**
         * Create a 'Backbone.Model' instance based on 'attributes'.
         * @param {Object} attributes
         * @param {Object} [options]
         * @return {Backbone.Model}
         */
        build: function( attributes, options ) {
            var model = this;

            // 'build' is a possible entrypoint; it's possible no model hierarchy has been determined yet.
            this.initializeModelHierarchy();

            // Determine what type of (sub)model should be built if applicable.
            // Lookup the proper subModelType in 'this._subModels'.
            if ( this._subModels && this.prototype.subModelTypeAttribute in attributes ) {
                var subModelTypeAttribute = attributes[ this.prototype.subModelTypeAttribute ];
                var subModelType = this._subModels[ subModelTypeAttribute ];
                if ( subModelType ) {
                    model = subModelType;
                }
            }
            
            return new model( attributes, options );
        },

        initializeModelHierarchy: function() {
            // If we're here for the first time, try to determine if this modelType has a 'superModel'.
            if ( _.isUndefined( this._superModel ) || _.isNull( this._superModel ) ) {
                Backbone.Relational.store.setupSuperModel( this );

                // If a superModel has been found, copy relations from the _superModel if they haven't been
                // inherited automatically (due to a redefinition of 'relations').
                // Otherwise, make sure we don't get here again for this type by making '_superModel' false so we fail
                // the isUndefined/isNull check next time.
                if ( this._superModel ) {
                    //
                    if ( this._superModel.prototype.relations ) {
                        var supermodelRelationsExist = _.any( this.prototype.relations, function( rel ) {
                            return rel.model && rel.model !== this;
                        }, this );

                        if ( !supermodelRelationsExist ) {
                            this.prototype.relations = this._superModel.prototype.relations.concat( this.prototype.relations );
                        }
                    }
                }
                else {
                    this._superModel = false;
                }
            }

            // If we came here through 'build' for a model that has 'subModelTypes', and not all of them have been resolved yet, try to resolve each.
            if ( this.prototype.subModelTypes && _.keys( this.prototype.subModelTypes ).length !== _.keys( this._subModels ).length ) {
                _.each( this.prototype.subModelTypes, function( subModelTypeName ) {
                    var subModelType = Backbone.Relational.store.getObjectByName( subModelTypeName );
                    subModelType && subModelType.initializeModelHierarchy();
                });
            }
        },

        /**
         * Find an instance of `this` type in 'Backbone.Relational.store'.
         * - If `attributes` is a string or a number, `findOrCreate` will just query the `store` and return a model if found.
         * - If `attributes` is an object, the model will be updated with `attributes` if found.
         *   Otherwise, a new model is created with `attributes` (unless `options.create` is explicitly set to `false`).
         * @param {Object|String|Number} attributes Either a model's id, or the attributes used to create or update a model.
         * @param {Object} [options]
         * @param {Boolean} [options.create=true]
         * @return {Backbone.RelationalModel}
         */
        findOrCreate: function( attributes, options ) {
            // Try to find an instance of 'this' model type in the store
            var model = Backbone.Relational.store.find( this, attributes );

            // If we found an instance, update it with the data in 'item'; if not, create an instance
            // (unless 'options.create' is false).
            if ( _.isObject( attributes ) ) {
                if ( model ) {
                    model.set( attributes, options );
                }
                else if ( !options || ( options && options.create !== false ) ) {
                    model = this.build( attributes, options );
                }
            }

            return model;
        }
    });
    _.extend( Backbone.RelationalModel.prototype, Backbone.Semaphore );
    
    /**
     * Override Backbone.Collection._prepareModel, so objects will be built using the correct type
     * if the collection.model has subModels.
     */
    Backbone.Collection.prototype.__prepareModel = Backbone.Collection.prototype._prepareModel;
    Backbone.Collection.prototype._prepareModel = function ( model, options ) {
        options || (options = {});
        if ( !( model instanceof Backbone.Model ) ) {
            var attrs = model;
            options.collection = this;
            
            if ( typeof this.model.build !== 'undefined' ) {
                model = this.model.build( attrs, options );
            }
            else {
                model = new this.model( attrs, options );
            }
            
            if ( !model._validate( model.attributes, options ) ) {
                model = false;
            }
        }
        else if ( !model.collection ) {
            model.collection = this;
        }
        
        return model;
    }
    
    /**
     * Override Backbone.Collection.add, so objects fetched from the server multiple times will
     * update the existing Model. Also, trigger 'relational:add'.
     */
    var add = Backbone.Collection.prototype.__add = Backbone.Collection.prototype.add;
    Backbone.Collection.prototype.add = function( models, options ) {
        options || (options = {});
        if ( !_.isArray( models ) ) {
            models = [ models ];
        }

        var modelsToAdd = [];

        //console.debug( 'calling add on coll=%o; model=%o, options=%o', this, models, options );
        _.each( models, function( model ) {
                if ( !( model instanceof Backbone.Model ) ) {
                    // Try to find 'model' in Backbone.store. If it already exists, set the new properties on it.
                    var existingModel = Backbone.Relational.store.find( this.model, model[ this.model.prototype.idAttribute ] );
                    if ( existingModel ) {
                        existingModel.set( existingModel.parse ? existingModel.parse( model ) : model, options );
                        model = existingModel;
                    }
                    else {
                        model = Backbone.Collection.prototype._prepareModel.call( this, model, options );
                    }
                }

                if ( model instanceof Backbone.Model && !this.get( model ) && !this.getByCid( model ) ) {
                    modelsToAdd.push( model );
                }
            }, this );


        // Add 'models' in a single batch, so the original add will only be called once (and thus 'sort', etc).
        if ( modelsToAdd.length ) {
            add.call( this, modelsToAdd, options );

            _.each( modelsToAdd, function( model ) {
                    this.trigger( 'relational:add', model, this, options );
                }, this );
        }
        
        return this;
    };
    
    /**
     * Override 'Backbone.Collection.remove' to trigger 'relational:remove'.
     */
    var remove = Backbone.Collection.prototype.__remove = Backbone.Collection.prototype.remove;
    Backbone.Collection.prototype.remove = function( models, options ) {
        options || (options = {});
        if ( !_.isArray( models ) ) {
            models = [ models ];
        }
        else {
            models = models.slice( 0 );
        }

        //console.debug('calling remove on coll=%o; models=%o, options=%o', this, models, options );
        _.each( models, function( model ) {
                model = this.getByCid( model ) || this.get( model );

                if ( model instanceof Backbone.Model ) {
                    remove.call( this, model, options );
                    this.trigger('relational:remove', model, this, options);
                }
            }, this );
        
        return this;
    };

    /**
     * Override 'Backbone.Collection.reset' to trigger 'relational:reset'.
     */
    var reset = Backbone.Collection.prototype.__reset = Backbone.Collection.prototype.reset;
    Backbone.Collection.prototype.reset = function( models, options ) {
        reset.call( this, models, options );
        this.trigger( 'relational:reset', this, options );

        return this;
    };

    /**
     * Override 'Backbone.Collection.sort' to trigger 'relational:reset'.
     */
    var sort = Backbone.Collection.prototype.__sort = Backbone.Collection.prototype.sort;
    Backbone.Collection.prototype.sort = function( options ) {
        sort.call( this, options );
        this.trigger( 'relational:reset', this, options );

        return this;
    };
    
    /**
     * Override 'Backbone.Collection.trigger' so 'add', 'remove' and 'reset' events are queued until relations
     * are ready.
     */
    var trigger = Backbone.Collection.prototype.__trigger = Backbone.Collection.prototype.trigger;
    Backbone.Collection.prototype.trigger = function( eventName ) {
        if ( eventName === 'add' || eventName === 'remove' || eventName === 'reset' ) {
            var dit = this, args = arguments;
            
            if (eventName === 'add') {
                args = _.toArray(args);
                // the fourth argument in case of a regular add is the option object.
                // we need to clone it, as it could be modified while we wait on the eventQueue to be unblocked
                if (_.isObject(args[3])) {
                    args[3] = _.clone(args[3]);
                }
            }
            
            Backbone.Relational.eventQueue.add( function() {
                    trigger.apply( dit, args );
                });
        }
        else {
            trigger.apply( this, arguments );
        }
        
        return this;
    };

    // Override .extend() to automatically call .setup()
    Backbone.RelationalModel.extend = function( protoProps, classProps ) {
        var child = Backbone.Model.extend.apply( this, arguments );
        
        child.setup( this );

        return child;
    };

    return Backbone.noConflict();
})