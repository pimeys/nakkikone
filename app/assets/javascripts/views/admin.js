"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'bootstrapDatepicker',
    'bootstrapTimepicker',
    'hbs!templates/admin-screen',
    'hbs!templates/users',
    'hbs!templates/nakit',
    'hbs!templates/edit-nakkis',
    'hbs!templates/selector',
    'hbs!templates/party-description',
    'hbs!templates/party-editor-form'
], function($, _, bb, collections, models, bootstarpDP, bootstarpTP, adminScreen, userlist, nakkilist, nakkilist_edit, selector, party_description, party_edit) {

    //TODO fix party creation refresh for nakkitypes editor.

    var vent = {};
    _.extend(vent, bb.Events);

    var parties = new collections.Parties();
    
    var users = new collections.Users();

    var auxUsers = new collections.AuxUsers();

    var nakkitypes = new collections.Nakkitypes();

    var counter = 1;

    //todo move to separate error-handling-module
    var _error = function(col, error) {
	alert('Failure: ' + error.statusText);
	//todo proper delegatation to router
	location.href = '/';
    };

    var Party_Selector = bb.View.extend({
	events: {
	    "change .selector" : "select",
	    "click .creator"  : "create",
	    "click .deletor"  : "destroy"
	},

	initialize: function() {
	    _.bindAll(this);
	    parties.on('add', this.render);
	    vent.on('partyEdited', this.render);
	    vent.on('detach', this.remove);
	    this.render();
	},

	render: function(partyTitle){
	    this.$el.html(selector({parties:parties.toJSONWithClientID(), selected:partyTitle}));
	    return this.$el;
	},
	
	select: function(target) {
	    var partyId = this.$('form').serializeArray()[0].value;
	    vent.trigger('changeParty', partyId);
	},

	create: function() {
	    var partyTitle = prompt("Give name to the party (cannot be changed afterwards)","party");
	    var party = new models.Party({title:partyTitle});
	    parties.add(party);
	    vent.trigger('createdParty', party.cid);
	    this.render(partyTitle);
	},

	destroy: function(){
	    var self = this;
	    var partyId = this.$('form').serializeArray()[0].value;
	    var model = parties.get(partyId);
	    model.destroy({wait:true, 
			   success:function(){
			       vent.trigger('changeParty',parties.at(0));
			       self.render();
			   },
			   error: _error });
	}
    });

    var User_List = bb.View.extend({
	collection: users, //TODO maybe as an constructor parameter

	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty', this.refresh);
	    vent.on('detach', this.remove);
	    this.render();
	},
	
	refresh: function(partyId) {
	    var self = this;
	    var party = parties.get(partyId);

	    this.collection.partyId = party.get('id');
	    this.collection.fetch({
		success: this.render, 
		
		error: function(){
		    this.collection.reset();
		    self.$el.html('none');
		}
	    });
	},

	render: function(){
	    this.$el.html(userlist({persons:this.collection.toJSON()}));
	    return this;
	}
    });

    var Constructors_List = User_List.extend({
	collection: auxUsers,
	filterRules: {type: 'const'},

	render: function(){
	    this.$el.html(userlist({persons: new bb.Collection().add(this.collection.where(this.filterRules)).toJSON()})); //TODO please kill me now
	    return this;
	}
    });

    var Cleaners_List = Constructors_List.extend({
	filterRules: {type: 'clean'}
    });

    var Nakki_List = bb.View.extend({
	events: {
	    'click .editor' : 'edit',
	    'click .setter' : 'saveCollection',
	    'click .creator' : 'create',
	    'click .deletor' : 'delete'
	},

	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty', this.refresh);
	    nakkitypes.on('add', this.edit);
	    nakkitypes.on('remove', this.edit);
	    vent.on('detach', this.remove);
	    this.render();
	},
	
	refresh: function(partyId) {
	    var self = this;
	    var party = parties.get(partyId);

	    nakkitypes.partyId = party.get('id');
	    nakkitypes.fetch({
		success: this.render, 
		
		error: function(){
		    nakkitypes.reset();
		    self.$el.html(nakkilist({nakit:{}}));
		}
	    });
	},

	render: function(){
	    this.$el.html(nakkilist({nakit:nakkitypes.toJSONWithClientID()}));
	    return this.$el;
	},

	create: function(){
	    nakkitypes.add(new models.Nakkitype({type:'tyyppi' + counter++}));
	},

	edit: function(){
	    //todo get cid to here somehow...
	    this.$el.html(nakkilist_edit({nakkitypes:nakkitypes.toJSONWithClientID()}));
	    return this.$el;
	},

	delete: function(target){
	    var self = this;
	    var removeId = target.currentTarget.attributes['value'].nodeValue;
	    var model = nakkitypes.get(removeId);
	    model.destroy({wait:true,
			   success:function(){
			       self.render();
			   },
			   error: errorHandle });
	},

	saveCollection: function(){
	    //TODO here we would reset whole collection based on input of the edit table.
	    $('#nakit form').each(function(){
		var arr = $(this).serializeArray();
		var data = _(arr).reduce(function(acc, field) {
		    acc[field.name] = field.value;
		    return acc;
		}, {});
		var model = nakkitypes.get(data["cid"]);
		delete data['cid'];
		model.save(data);
	    });
	    this.render();
	}
    });
    
    var Party_Viewer = bb.View.extend({
	events: {
	    'change .selector' : 'select',
	    'click .editor'    : 'edit',
	    'submit'           : 'save'
	},
	
	initialize: function(){
	    _.bindAll(this);
	    vent.on('changeParty', this.select);
	    vent.on('createdParty', this.creationEdit);
	    vent.on('detach', this.remove);
	    this.render();
	},
	
	render: function(){
	    this.$el.html(party_description({party: this.model.toJSON(), editable: true}));
	    return this;
	},

	select: function(partyId) {
	    this.model = parties.get(partyId);
	    this.render();
	},

	edit: function() {
	    this.$el.html(party_edit({party:this.model.toJSON()}));
	    $('.datepicker', this.$el).datepicker({
		format: 'dd.mm.yyyy',
		startDate: new Date(),
		autoclose: true
	    });
	    $('#start-time', this.$el).timepicker({
		showMeridian: false,
		showSeconds: false,
		minuteStep: 30
	    });
	    $('#info-time', this.$el).timepicker({
		showMeridian: false,
		showSeconds: false,
		minuteStep: 30
	    });
	},

	creationEdit: function(partyId){
	    this.model = parties.get(partyId);
	    this.edit();
	},
	
	//todo move to time/date parsing module
	parseData: function(data) {
	    var parseDate = function(dateString, timeString) {
		var date = new Date(dateString);
		var time = timeString.split(":");
		date.setHours(time[0]);
		date.setMinutes(time[1]);
		return date;
	    };

	    var parsed = {};
	    parsed.title = data.title;
	    parsed.description = data.description;
	    parsed.date = parseDate(data.date, data.startTime);
	    parsed.infoDate = parseDate(data.date, data.infoTime);
	    
	    return parsed;
	},

	save: function() {
	    var arr = this.$("#edit_party").serializeArray();
	    var input_data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});
	    var data = this.parseData(input_data);

	    var self = this;
	    this.model.save(data, {
		success: function(model) {
		    vent.trigger('changeParty', model.get('id'));
		    vent.trigger('partyEdited', model.get('title'));
		    self.render();
		},
		
		error: function(){
		    alert('saving of the party failed in backend')
		},
		
		wait:true
	    });
	    return false;
	}
    });

    var initialize = function(options) {
	var latestParty;
	var rootel = options.el;
	rootel.html(adminScreen);
	vent.off(); //hard reset!

	parties.fetch( {
	    success: function() {
		//TODO remove this stuff
		if (parties.length > 0) {
		    latestParty = parties.at(0);
		    users.partyId = latestParty.get('id');
		    auxUsers.partyId = latestParty.get('id');
		    nakkitypes.partyId = latestParty.get('id');
		    
		    var _ready = _.after(3, function(){
			new Party_Selector({el:$('#party-selector',rootel), selected: latestParty.title});
			new Party_Viewer({el: $('#party', rootel), model: latestParty});
			new Nakki_List({el: $('#nakit', rootel)});
			
			new Constructors_List({el: $('#constructors', rootel)});
			new User_List({el: $('#users', rootel)});
			new Cleaners_List({el: $('#cleaners', rootel)});
		    });

		    auxUsers.fetch({success: _ready, error: _error}); 
		    users.fetch({success: _ready, error: _error}); 
		    nakkitypes.fetch({success: _ready, error: _error}); 
		} else {
		    new Party_Selector({el:$('#party-selector',rootel)});
		    new Party_Viewer({el:$('#party',rootel), model: new models.Party({title:'No parties yet'})});
		    new Nakki_List({el:$('#nakit',rootel)});
		    new User_List({el:$('#users',rootel)});
		}
	    },
	    error: _error
	});
    };

    return { 
	initialize: initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
