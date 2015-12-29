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

    //TODO refactor to use maybe subviews for each models 
    var Nakki_Editor = bb.View.extend({
	events: {
	    'click .editor' : 'edit',
	    'click .setter' : 'saveCollection',
	    'click .creator' : 'create',
	    'click .deletor' : 'delete'
	},

	initialize: function(options) {
	    _.bindAll(this);
	    this.nakkitypeInfos = options.nakkitypeInfos;
	    vent.on('changeParty', this.refresh);
	    vent.on('createdParty', this.refresh);
	    vent.on('detach', this.remove);
	    this.listenTo(this.collection, 'add reset', this.render);
	    this.render();
	},

	setParty: function(model) {
	    this.model = model;
	    this.collection.partyId = this.model.get('id');
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
	    this.$el.html(nakkilist({
		party: this.model.toJSON(),
		nakit: this.collection.toJSONWithClientID()
	    }));
	    return this;
	},

	create: function(){
	    var nakkitype_info_id = this.nakkitypeInfos.first().get("id");
	    this.collection.create({ nakkitype_info_id: nakkitype_info_id }, { wait:true });
	},

	edit: function(){
	    this.$el.html(nakkilist_edit({
		nakkitypeInfos: this.nakkitypeInfos.toJSON(),
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
	    data.start_time = this.parseSlotFromTime(data.start_time, this.model.get('date'));
	    data.end_time = this.parseSlotFromTime(data.end_time, this.model.get('date'));
	    return data;
	},

	//FIXME not like this.... should use something like PUT?
	saveCollection: function() {
	    var self = this;
	    //TODO here we would reset whole collection based on input of the edit table.
	    $('#nakki-timetable form').each(function() {
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
		text: "Nakki " + model.get('info').title + " successfully created/modified/removed."
	    };
	    vent.trigger('notify', message);
	    vent.trigger('changeParty', this.model);
	    this.render();
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure in nakkitype "+ model.get('info').title + " (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent;
	    return new Nakki_Editor(options);
	}
    };
});
