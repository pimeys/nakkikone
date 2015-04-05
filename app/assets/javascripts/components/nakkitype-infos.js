"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/nakkitype-infos',
    'hbs!templates/nakkitype-info-details',
    'hbs!templates/info-selector'
], function($, _, bb, collections, models,
	    nakkitype_infos_template,
	    nakkitype_info_details_template,
	    info_selector) {

    var vent; //FIXME replace with global notification bus

    var NakkiTypeEditorView = bb.View.extend({
	events: {
	    "click .save" : 'save',
	    "click .delete" : 'delete'
	},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.model, 'change', this.render);
	    this.listenTo(this.model, 'invalid', this.alertValidationError);
	},

	setModel: function(newModel) {
	    this.stopListening(this.model);
	    this.model = newModel;
	    this.listenTo(this.model, 'change', this.render);
	    this.listenTo(this.model, 'invalid', this.alertValidationError);
	},

	render: function() {
	    this.$el.html(nakkitype_info_details_template(this.model.toJSON()));
	    return this;
	},

	noSelection: function() {
	    this.$el.html("select nakki info to edit");
	    return this;
	},

	save: function() {
	    var inputElements = this.$el.find('form').serializeArray();
	    var data = _(inputElements).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});
	    var self = this;
	    this.model.save(data, {
		success: function() {
		    self.notify(self.model);
		    self.$el.html("select nakki info...");
		},
		error: this.alert,
		wait: true
	    });
	},

	delete: function() {
	    var self = this;
	    this.model.destroy({
		success: function() {
		    self.notify(self.model);
		    self.$el.html("select nakki info...");
		},
		error: this.alert,
		wait: true
	    });
	},

	notify: function(model, options) {
	    var message = {
		title: 'Success',
		text: "Nakki info " + model.get('title') + " successfully modified/removed."
	    };
	    vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure to operate for "+ model.get('title') + " (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	},

	alertValidationError: function() {
	    var message = {
		title: "Validation error for modifying values:",
		text: this.model.validationError
	    };
	    vent.trigger('alert', message);
	}
    });

    var NakkitypeInfoView = bb.View.extend({
	events: {
	    "change .selector" : 'selected',
	    "click .create" : 'create'
	},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.collection, 'change', this.renderSelector);
	    this.listenTo(this.collection, 'destroy', this.renderSelector);
	    this.render();
	},

	render: function() {
	    this.$el.html(nakkitype_infos_template);
	    this.renderSelector();
	    this.editor = new NakkiTypeEditorView({
		el: this.$el.find('.nakki-info-details'),
		model: this.collection.at(1)
	    });
	    return this;
	},

	renderSelector: function() {
	    this.$el.find('#nakkitype-info-selector').html(info_selector({
		infos: this.collection.toJSONWithClientID()
	    }));
	    return this;
	},

	selected: function(target) {
	    var modelId = $(target.currentTarget).val();
	    if (modelId) {
		this.editor.setModel(this.collection.get(modelId));
		this.editor.render();
	    } else {
		this.editor.noSelection();
	    }
	},

	create: function() {
	    var newModel = this.collection.create({
		title: "new nakki info",
		description: "create informative description here...",
		wait: true
	    });
	    this.editor.setModel(newModel);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent;
	    return new NakkitypeInfoView(options);
	}
    };
});
