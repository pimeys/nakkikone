"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'components/party-viewer',
    'components/nakki-table',
    'components/notification-area',
    'bs',
    'hbs!templates/public-screen',
    'hbs!templates/aux-job-selector',
    'hbs!templates/aux-job-counter'
], function($, _, bb, collections, models, partyViewer, nakkiTable, notificationArea, bs, publicScreen, auxJobSelector, auxjobList) {

    var vent = {};
    _.extend(vent, bb.Events);

    var AuxJob = models.PartyResource.extend({
	resource: 'aux_nakit'
    });

    var party = new models.Party();
    var nakit = new collections.Nakit();
    var AuxUsers = collections.AuxUsers.extend({
	resource: 'aux_parcipitants_names'
    });
    var auxUsers = new AuxUsers();

    // horrible piece of shit, please die.
    var AuxJobsSelect = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(vent, 'assignPerson', this.submit);
	    this.listenTo(vent, 'detach', this.detach);
	    this.render();
	},

	detach: function() {
	    this.stopListening();
	    this.remove();
	},

	createSingleUseModel: function() {
	    var model = new AuxJob();
	    model.partyId = party.get('id');
	    return model;
	},

	submit: function(assigned) {
	    var type = this.$('form').serializeArray()[0].value;
	    if (type === "both") {
	    	this.createSingleUseModel().save({type:"clean"}, {wait:true, success:this.notify, error: this.alert});
		this.createSingleUseModel().save({type:"const"}, {wait:true, success:this.notify, error: this.alert});
	    } else if (type === "none"){
		return false;
	    } else {
		this.createSingleUseModel().save({type:type}, {wait:true, success: this.notify, error: this.alert});
	    }
	    return false;
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

	render: function(){
	    this.$el.html(auxJobSelector());
	    return this;
	}
    });

    var Assign_Form = bb.View.extend({
	events: {
	    'submit': 'assign',
	    'click .cancel-all': 'unAssignAll'
	},

	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	},

	assign: function() {
	    vent.trigger('assignPerson', this.model);
	    return false;
	},

	unAssignAll: function() {
	    $.ajax({
		url: '/parties/' + party.id + '/cancel_all',
		dataType: 'json',
		type: 'DELETE'
	    }).success(function(){
		nakit.fetch({
		    success: function() {
			var message = {
			    title: "Successfully Cancelled Reservations"
			};
			vent.trigger('notify', message);
		    }
		});
	    });
	}
    });

    var AuxJobList = bb.View.extend({
	titleForList: "ovrride this",
	filterRules: {type: "none"},

	initialize: function(){
	    _.bindAll(this);
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

    //todo move to separate error-handling-module
    var _error = function(col, error) {
    };

    var initialize = function(options) {
	var rootel = options.el;
	rootel.html(publicScreen);
	vent.off(); //hard reset!

	notificationArea.createComponent({el: $('#alert-area', rootel)}, vent);

	//todo hide to model
	var partyFindUrl = '/parties/';
	if (options.partyId || options.partyId == 0) {
	    partyFindUrl += options.partyId;
	} else if (options.partyTitle) {
	    partyFindUrl += options.partyTitle + '?by_title=true';
	}

	party.fetch({url:partyFindUrl, success:function(){
	    nakit._party = party;
	    nakit.partyId = party.get('id');
	    auxUsers.partyId = party.get('id');

	    var _ready = _.after(2, function() {
		partyViewer.createComponent({el: $('#party-description',rootel), model: party}, vent); 
		nakkiTable.createComponent({el:$('#nakki-table',rootel), collection: nakit}, vent);
		new Assign_Form({el:$('#assign',rootel), model: options.currentUser()});

		//todo refactor to oblivion
		var auxjobs = new AuxJobsSelect({el: $('#auxJob-selector', rootel)});
		new CleanJobList({el: $('#auxJob-cleaners', rootel), collection: auxUsers});
		new ConstJobList({el: $('#auxJob-constructors', rootel), collection: auxUsers});
	    });

	    nakit.fetch({success: _ready, error: _error});
	    auxUsers.fetch({success: _ready, error: _error});
	}, error: _error});
    };

    return {
	initialize:initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
