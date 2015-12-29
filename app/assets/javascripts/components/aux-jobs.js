"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'bs',
    'hbs!templates/aux-job-selector',
    'hbs!templates/aux-job-counter'
], function($, _, bb, collections, models, bs, auxJobSelector, auxjobList) {

    var vent;

    var AuxJob = models.PartyResource.extend({
	resource: 'aux_nakit'
    });

    function mapToServerTypes(type) {
	var mapping = {
	    "cleaning" : "clean",
	    "construction" : "const"
	};
	return mapping[type];
    }

    // horrible piece of shit, please die.
    var AuxJobsSelect = bb.View.extend({
	initialize: function(options) {
	    this.currentUser = options.user;
	    _.bindAll(this);
	    this.listenTo(vent, 'assignPerson', this.submit);
	    this.listenTo(vent, 'detach', this.detach);
	    this.listenTo(this.collection, 'reset add destroy remove', this.render);
	    this.render();
	},

	detach: function() {
	    this.stopListening();
	    this.remove();
	},

	createSingleUseModel: function() {
	    var model = new AuxJob();
	    model.partyId = this.model.get('id');
	    return model;
	},

	submit: function(assigned) {
	    var self = this;
	    var selected = _(this.$('form').serializeArray()).pluck('value').map(mapToServerTypes);
	    var refreshView = _.after(selected.length, this.doFetch);
	    _.each(selected, function(type) {
		self.createSingleUseModel().save(
		    { type: type },
		    { wait:true,
		      success: self.notifyAndFetch(refreshView),
		      error: self.alert
		    }
		);
	    });
	    return false;
	},

	doFetch: function(count) {
	    this.collection.fetch({reset: true});
	},

	notifyAndFetch: function(doFetch) {
	    var self = this;
	    return function(model, options) {
		self.notify(model, options);
		doFetch();
	    };
	},

	notify: function(model, options) {
	    var message = {
		title: "Success!",
		text: "Your " + model.get('type') + " has been succesfully registered for you."
	    };
	    vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	},

	render: function() {
	    var user = this.currentUser;
	    var auxialirySelections = this.collection
		    .filter(function(model) {
			return model.get("name") === user.get("nick");
		    });
	    this.$el.html(auxJobSelector({
		notSelected: {
		    construction: !auxialirySelections.some(function(model) {
			return model.get("type") == "const";
		    }),
		    cleaning: !auxialirySelections.some(function(model) {
			return model.get("type") == "clean";
		    })
		}}));
	    return this;
	}
    });

    var AuxJobList = bb.View.extend({
	titleForList: "ovrride this",
	filterRules: {type: "none"},

	initialize: function(){
	    _.bindAll(this);
	    this.listenTo(vent, 'detach', this.detach);
	    this.listenTo(this.collection, 'reset add destroy remove', this.render);
	    this.render();
	},

	render: function(){
	    var filtered = new bb.Collection().add(this.collection.where(this.filterRules));
	    this.$el.html(auxjobList({name: this.titleForList ,count: filtered.size(), auxJobs: filtered.toJSON()}));
	}
    });

    var CleanJobList = AuxJobList.extend({
	titleForList: "Number of Taking it Down:",
	filterRules: {type: "clean"}
    });

    var ConstJobList = AuxJobList.extend({
	titleForList: "Number of Builders:",
	filterRules: {type: "const"}
    });

    return {
	createSelector: function(options, _vent) {
	    vent = _vent; //todo remvoe
	    return new AuxJobsSelect(options);
	},
	
	createCleanersList: function(options, _vent) {
	    vent = _vent; //todo remvoe
	    return new CleanJobList(options);
	},
	createConstructorsList: function(options, _vent) {
	    vent = _vent; //todo remvoe
	    return new ConstJobList(options);
	}
    };
});
