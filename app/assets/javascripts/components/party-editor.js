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
    'bootstrapWysivyg',
    'hbs!templates/party-description',
    'hbs!templates/party-editor-form'
], function($, _, bb, collections, models, moment, languages, bootstarpDP, bootstarpTP, bootstarpEditor, party_description, party_edit) {

    var vent;

    var Party_Editor = bb.View.extend({
	events: {
	    'change .selector' : 'select',
	    'click .editor'    : 'edit',
	    'submit'           : 'save',
	    'click .cancel'    : 'cancelEditAction'
	},

	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty', this.select);
	    vent.on('createdParty', this.creationEdit);
	    vent.on('detach', this.remove);
	    this.listenTo(this.model, 'invalid', this.notifyValidity);
	    this.render();
	},

	changeModel: function(newModel) {
	    this.stopListening(this.model);
	    this.model = newModel;
	    this.listenTo(this.model, 'invalid', this.notifyValidity);
	},

	notifyValidity: function() {
	    var message = {
		title: "Party edit validation",
		text: "Input is invalid, " + this.model.validationError
	    };
	    vent.trigger('alert', message);
	},

	render: function(){
	    this.$el.html(party_description({party: this.model.toJSON(), editable: true}));
	    return this;
	},

	cancelEditAction: function() {
	    this.render();
	    return false;
	},

	select: function(partyId) {
	    this.model = this.collection.get(partyId);
	    this.render();
	},

	edit: function() {
	    this.$el.html(party_edit({party: this.model.toJSON()}));
	    $('.datepicker', this.$el).datepicker({
		format: "dd.mm.yyyy",
		startDate: new Date(),
		autoclose: true
	    });
	    $('.timepicker', this.$el).timepicker({
		showMeridian: false,
		showSeconds: false,
		minuteStep: 30
	    });
	    $('textarea[name="description"]').wysihtml5({
		color: false,
		stylesheets: []
	    });
	},

	creationEdit: function(partyId){
	    this.changeModel(this.collection.get(partyId));
	    this.edit();
	},

	//todo move to time/date parsing module
	parseData: function(data) {
	    var parseDate = function(dateString, timeString) {
		var date = moment(dateString, "DD.MM.YYYY");
		var time = timeString.split(":");
		date.hours(time[0]);
		date.minutes(time[1]);
		return date.toDate();
	    };

	    var parsed = {};
	    parsed.title = data.title;
	    parsed.description = data.description;
	    parsed.date = parseDate(data.date, data.startTime);
	    parsed.infoDate = parseDate(data.date, data.infoTime);
	    parsed.auxJobsEnabled = data.auxJobsEnabled === "enabled" ? true : false;
	    return parsed;
	},

	save: function() {
	    var arr = this.$("#edit_party").serializeArray();
	    var input_data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});
	    var data = this.parseData(input_data);
	    this.model.save(data, {
		success: this.notify, 
		error: this.alert,
		wait:true
	    });
	    return false;
	},

	notify: function(model, options) {
	    var message = {
		title: 'Success',
		text: "Party " + model.get('title') + " successfully modified."
	    };
	    vent.trigger('notify', message);
	    vent.trigger('partyEdited', model);
	    this.render();
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure in Party modification "+ model.get('title') + " (Something went wrong in server)!",
		text: "Your request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent;
	    return new Party_Editor(options);
	}
    };
});
