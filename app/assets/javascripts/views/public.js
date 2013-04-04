"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/public-screen',
    'hbs!templates/party-description',
    'hbs!templates/nakki-table', 
    'hbs!templates/aux-job-selector', 
], function($, _, bb, collections, models, publicScreen, party_description, nakki_table, auxJobSelector) {

    var vent = {};
    _.extend(vent, bb.Events);

    var AuxJob = models.PartyResource.extend({
	resource: 'aux_nakit'
    });

    var party = new models.Party();
    var nakit = new collections.Nakit();

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
	    vent.on('assignPerson', this.submit);
	    vent.on('detach', this.detach);
	    this.render();
	},
	
	detach: function() {
	    this.model1.stopListening();
	    this.model2.stopListening();
	    this.remove();
	},

	submit: function(assigned) {
	    // TODO refactor to trigger event to status view
	    var notify = function(){ alert("your cleaning/construction has been registered.")};
	    var type = this.$('form').serializeArray()[0].value;
	    if (type === "both") {
	    	this.model1.save({type:"clean"}, {wait:true, success:notify, error: _errorDebug});
		this.model2.save({type:"const"}, {wait:true, success:notify, error: _errorDebug});
	    } else if (type === "none"){
		return false;
	    } else {
		this.model1.save({type:type}, {wait:true, success:notify, error: _errorDebug});
	    }
	    return false;
	},

	render: function(){
	    this.$el.html(auxJobSelector());
	    return this;
	}
    });

    var Nakki_Table = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
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
	    
	    var self = this;
	    var _setted = _.after(ids.length, function(){
		self.render();
		alert("your nakkis have been registered."); // todo trigger event in notify
	    });

	    _.each(ids, function(current){
		var model = nakit.get(current);
		model.save({assign: assignedPerson.id}, 
			   { 
			       wait:true, 
			       success: _setted, 
			       error: _errorDebug
			   });
	    });
	    return false;
	}
    });
    
    var Assign_Form = bb.View.extend({
	events: {'submit': 'assign'},

	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	},
	
	assign: function() {
	    vent.trigger('assignPerson', this.model);
	    return false;
	}
    });

    //todo move to separate error-handling-module
    var _error = function(col, error) {
	alert('Failure: ' + error.statusText);
	//todo proper delegatation to router
	location.href = '/';
    };

    var _errorDebug = function(col, error) {
	alert('Failure: ' + error.statusText);
    };
    
    var initialize = function(options) {
	var rootel = options.el;
	rootel.html(publicScreen);
	vent.off(); //hard reset!

	//todo hide to model
	var partyFindUrl = '/parties/';
	if (options.partyId) {
	    partyFindUrl += options.partyId;
	} else if (options.partyTitle) {
	    partyFindUrl += options.partyTitle + '?by_title=true';
	}

	party.fetch({url:partyFindUrl, success:function(){
	    nakit.partyId = party.get('id');

	    //todo remove these when refactoring single click UI responses
	    var model1 = new AuxJob();
	    model1.partyId = party.get('id');;
	    var model2 = new AuxJob();
	    model2.partyId = party.get('id');;

	    var _ready = function(){
	        new Party_Viewer({el:$('#party-description',rootel), model: party}); 
		new Nakki_Table({el:$('#nakki-table',rootel)});
	        new Assign_Form({el:$('#assign',rootel), model: options.currentUser()});
		
		//todo refactor to oblivion
		var auxjobs = new AuxJobsSelect({el: $('#auxJob-selector', rootel)});
		auxjobs.model1 = model1;
		auxjobs.model2 = model2;
	    };

	    nakit.fetch({success:_ready, error:_error});
	}, error: _error});
    };

    return {
	initialize:initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
