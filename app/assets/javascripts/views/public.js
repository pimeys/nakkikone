"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'bs',
    'hbs!templates/public-screen',
    'hbs!templates/party-description',
    'hbs!templates/nakki-table', 
    'hbs!templates/aux-job-selector',
    'hbs!templates/alert'
], function($, _, bb, collections, models, bs, publicScreen, party_description, nakki_table, auxJobSelector, alertTmpl) {

    var vent = {};
    _.extend(vent, bb.Events);

    var AuxJob = models.PartyResource.extend({
	resource: 'aux_nakit'
    });

    var party = new models.Party();
    var nakit = new collections.Nakit();

    //TODO refactor to common-module
    var NotificationArea = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	    this.listenTo(vent, 'alert', this.showAlert);
	    this.listenTo(vent, 'notify', this.showNotify);
	    this.render();
	},

	showAlert: function(message) {
	    message.type = 'error';
	    this.appendAlert(message);
	},

	showNotify: function(message) {
	    message.type = 'success';
	    this.appendAlert(message);
	},	

	appendAlert: function(message) {
	    this.$el.append(alertTmpl({message: message}));
	}
    });

    var Party_Viewer = bb.View.extend({
	initialize: function(){
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	    this.render();
	},
	
	render: function(){
	    this.$el.html(party_description({party:this.model.toJSON(), editable:false}));
	    return this;
	}
    });

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
	    }
	    vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    }
	    vent.trigger('alert', message);
	},

	render: function(){
	    this.$el.html(auxJobSelector());
	    return this;
	}
    });

    var Nakki_Table = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.collection, 'reset', this.render);
	    vent.on('assignPerson', this.save);
	    vent.on('detach', this.remove);
	    this.render();
	},

	render: function(){ 
	    var startingTime = party.get('date');
	    var data = _.sortBy(_.groupBy(nakit.toJSON(),'slot'),'type');
	    var titles = _.uniq(_.pluck(nakit.toJSON(),'type'));
	    this.$el.html(nakki_table({titles: titles.sort(), nakit: _.toArray(data), startTime: startingTime.toJSON()}));
	    return this;
	},

	save: function(assignedPerson){
	    var ids = _.map(this.$('form').serializeArray(), function(el) {
		return el.value;
	    });
	    if (ids.length == 0) {
		return false;
	    }
	    this.returned = _.after(ids.length, this.render); //todo safe?
	    var self = this;
	    _.each(ids, function(current){
		var model = nakit.get(current);
		model.save({assign: assignedPerson.id}, 
			   { 
			       wait: true, 
			       success: self.notify, 
			       error: self.alert
			   });
	    });
	    return false;
	},

	notify: function(model, options) {
	    this.returned();
	    var message = {
		title: "Success!",
		text: "Your " + model.get('type') + " has been succesfully registered for you."
	    }
	    vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    this.returned();
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    }
	    vent.trigger('alert', message);
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

    //todo move to separate error-handling-module
    var _error = function(col, error) {
    };
   
    var initialize = function(options) {
	var rootel = options.el;
	rootel.html(publicScreen);
	vent.off(); //hard reset!
	
	new NotificationArea({el: $('#alert-area', rootel)});

	//todo hide to model
	var partyFindUrl = '/parties/';
	if (options.partyId) {
	    partyFindUrl += options.partyId;
	} else if (options.partyTitle) {
	    partyFindUrl += options.partyTitle + '?by_title=true';
	}

	party.fetch({url:partyFindUrl, success:function(){
	    nakit.partyId = party.get('id');

	    var _ready = function(){
	        new Party_Viewer({el:$('#party-description',rootel), model: party}); 
		new Nakki_Table({el:$('#nakki-table',rootel), collection: nakit});
	        new Assign_Form({el:$('#assign',rootel), model: options.currentUser()});
		
		//todo refactor to oblivion
		var auxjobs = new AuxJobsSelect({el: $('#auxJob-selector', rootel)});
	    };

	    nakit.fetch({success: _ready, error: _error});
	}, error: _error});
    };

    return {
	initialize:initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
