"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/selector'
], function($, _, bb, collections, models, selector) {

    var vent;

    var Party_Selector = bb.View.extend({
	events: {
	    "change .selector" : "select",
	    "click #creator"  : "create",
	    "click .deletor"  : "destroy"
	},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.collection, 'add remove', this.render);
	    vent.on('partyEdited', this.render);
	    vent.on('detach', this.remove);
	    this.render();
	},

	render: function() {
	    this.$el.html(selector({
		parties: this.collection.toJSONWithClientID()
	    }));
	    return this.$el;
	},

	select: function(target) {
	    var partyId = this.$('form').serializeArray()[0].value;
	    if (partyId) {
		vent.trigger('changeParty', this.collection.get(partyId));
	    } else {
		vent.trigger('noPartySelected');
	    }
	},

	create: function() {
	    var self = this;
	    var partyTitle = this.$('#party-title-input').val();
	    this.collection.create({
		title: partyTitle,
		auxJobsEnabled: true
	    }, {
		wait: true,
		success: function(model, options) {
		    self.model = model;
		    vent.trigger('createdParty', model);
		    self.render();
		},
		error: this.alert
	    });
	    return false;
	},

	//TODO removing party doesn't trigger nakkitypes
	destroy: function(){
	    var self = this;
	    var partyId = this.$('form').serializeArray()[0].value;
	    var model = this.collection.get(partyId);
	    var r = confirm("Are you sure to want to delete party " + model.get('title') + " ?");
	    if (r) {
		model.destroy({
		    wait: true, 
		    success: this.notify,
		    error: this.alert
		});
	    }
	    return false;
	},

	notify: function(model, options) {
	    var message = {
		title: 'Success',
		text: "Party " + model.get('title') + " successfully removed."
	    };
	    vent.trigger('notify', message);
	    vent.trigger('changeParty', this.collection.at(0));
	    this.render();
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent;
	    return new Party_Selector(options);
	}
    };
});
