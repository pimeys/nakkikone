"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/users'
], function($, _, bb, collections, models, userlist) {

    var vent;
 
    var User_List = bb.View.extend({
	events: {
	    'click .unassign': 'unassign'
	},

	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty createdParty', this.refresh);
	    vent.on('detach', this.remove);
	    this.listenTo(this.collection, 'remove', this.render);
	    this.render();
	},

	refresh: function(model) {
	    var self = this;
	    var party = model;

	    this.collection.partyId = party.get('id');
	    this.collection.fetch({
		success: this.render, 

		error: function(){
		    this.collection.reset();
		    self.$el.html('none');
		}
	    });
	},

	render: function() {
	    this.$el.html(userlist({persons: this.collection.toJSON()}));
	    return this;
	},
	
	unassign: function(event) {
	    var self = this;
	    var cancelledUser = this.collection.get($(event.target).data('id'));
	    cancelledUser.partyId = this.collection.partyId;
	    cancelledUser.destroy({
		success: this.notify,
		error: this.error
	    });
	},

	notify: function(model, options) {
	    var message = {
		title: 'Success',
		text: "User " + model.get('name') + " successfully removed from parcipitants list."
	    };
	    vent.trigger('notify', message);
	    this.collection.remove(model);
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

    var Constructors_List = User_List.extend({
	filterRules: {type: 'const'},

	render: function(){
	    this.$el.html(userlist({persons: new bb.Collection().add(this.collection.where(this.filterRules)).toJSON()})); //TODO please kill me now
	    return this;
	}
    });

    var Cleaners_List = Constructors_List.extend({
	filterRules: {type: 'clean'}
    });

    return {
	createConstructors: function(options, _vent) {
	    vent = _vent;
	    return new Constructors_List(options);
	},

	createUsers: function(options, _vent) {
	    vent = _vent;
	    return new User_List(options);
	},

	createCleaners: function(options, _vent) {
	    vent = _vent;
	    return new Cleaners_List(options);
	}
    };
});
