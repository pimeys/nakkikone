"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'moment',
    'languages',
    'bootstrapDatepicker',
    'bootstrapTimepicker',
    'hbs!templates/nakit',
    'hbs!templates/edit-nakkis'
], function($, _, bb, collections, models, moment, languages, bootstarpDP, bootstarpTP, nakkilist, nakkilist_edit) {

    var vent;

    var nakkitypeInfos;

    var defaultNakkiTypes = [
	{type: "Ticket Sales", start: 0, end: 6},
	{type: "Kiosk", start: 0, end: 6},
	{type: "Cloackroom", start: 0, end: 6},
	{type: "Bouncer", start: 0, end: 6},
	{type: "Light Controller", start: 0, end: 6}
    ];

    //TODO refactor to use maybe subviews for each models 
    var Nakki_Editor = bb.View.extend({
	events: {
	    'click .editor' : 'edit',
	    'click .setter' : 'saveCollection',
	    'click .creator' : 'create',
	    'click .deletor' : 'delete'
	},

	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty', this.refresh);
	    vent.on('createdParty', this.createDefaults);
	    vent.on('detach', this.remove);
	    this.listenTo(this.collection, 'add remove', this.edit);
	    this.listenTo(this.collection, 'reset', this.render);
	    this.render();
	},

	setParty: function(model) {
	    this.model = model;
	    this.collection.partyId = this.model.get('id');
	},

	createDefaults: function(party) {
	    this.setParty(party);
	    this.createDefaultNakkiTypes();
	},

	createDefaultNakkiTypes: function() {
	    this.collection.reset();
	    _.each(defaultNakkiTypes, function(el) {
		this.collection.create(el, {wait:true});
	    }, this);
	},

	refresh: function(model) {
	    this.setParty(model);
	    var self = this;
	    this.collection.fetch({
		success: this.render,

		error: function() {
		    self.collection.reset();
		}
	    });
	},

	render: function(){
	    this.$el.html(nakkilist({nakit:this.collection.toJSONWithClientID(), party: this.model.toJSON()}));
	    return this;
	},

	create: function(){
	    this.collection.add(new models.Nakkitype({type:'<define type>'}));
	},

	edit: function(){
	    this.$el.html(nakkilist_edit({
		nakkitypeInfos: nakkitypeInfos.toJSON(),
		nakkitypes: this.collection.toJSONWithClientID(),
		party: this.model.toJSON() 
	    }));
	    $('.time-picker', this.$el).timepicker({
		showMeridian: false,
		showSeconds: false,
		minuteStep: 60,
		template: 'modal',
		modalBackdrop: true,
		defaultTime: '22:00'
	    });
	    return this;
	},

	delete: function(target){
	    var self = this;
	    var removeId = target.currentTarget.attributes['value'].nodeValue;
	    var model = this.collection.get(removeId);
	    model.destroy({
		wait:true,

		success: function(model, options) {
		    self.notify(model, options);
		    self.render();
		},

		error: this.alert 
	    });
	    return false;
	},

	parseSlotFromTime: function(timeString, date) {
	    var time = timeString.split(":");
	    return (Number(time[0]) + 24 - date.getHours()) % 24;
	},

	parseData: function(data) {
	    delete data.hour;
	    delete data.minute;
	    data.start = this.parseSlotFromTime(data.start, this.model.get('date'));
	    data.end = this.parseSlotFromTime(data.end, this.model.get('date'));
	    return data;
	},

	saveCollection: function() {
	    var self = this;
	    //TODO here we would reset whole collection based on input of the edit table.
	    $('#nakit form').each(function() {
		var arr = $(this).serializeArray();
		var data = _(arr).reduce(function(acc, field) {
		    acc[field.name] = field.value;
		    return acc;
		}, {});
		var model = self.collection.get(data["cid"]);
		delete data['cid'];
		var modelData = self.parseData(data);
		if(model.set(modelData) && model.hasChanged()) {
		    model.save(modelData, {
			success: self.notify,
			error: self.alert
		    });
		}
	    });

	    var errors = _.reduce(this.collection.models, function(memo, model) {
		if (!!model.validationError) {
		    memo[model.cid] = model.validationError;
		};
		return memo;
	    }, {});

	    if (!_.isEmpty(errors)) {
		_.each(_.keys(errors), function(el) {
		    var message = {
			title: "Validation failed in nakkitype id=" + el,
			text: errors[el]
		    };
		    vent.trigger('alert', message);
		});
	    } else {
		this.render();
	    }
	},

	notify: function(model, options) {
	    var message = {
		title: 'Success',
		text: "Nakki " + model.get('type') + " successfully created/modified/removed."
	    };
	    vent.trigger('notify', message);
	    vent.trigger('changeParty', this.model);
	    this.render();
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure in nakkitype "+ model.get('type') + " (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent;
	    nakkitypeInfos = options.nakkitypeInfos;
	    return new Nakki_Editor(options);
	}
    };
});
