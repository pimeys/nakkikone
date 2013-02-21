"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/party-description',
    'hbs!templates/nakki-table'
], function($, _, bb, collections, models, party_description, nakki_table) {

    var vent = {};
    _.extend(vent, bb.Events);

    var party = new models.Party();
    var nakit = new collections.Nakit();

    var Party_Viewer = bb.View.extend({
	initialize: function(){
	    this.render();
	},
	
	render: function(){
	    this.$el.html(party_description({party:this.model.toJSON(), editable:false}));
	    return this.$el;
	},
    });

    var Nakki_Table = bb.View.extend({
	initialize: function() {
	    _.bindAll(this,'save');
	    vent.on('assignPerson',this.save)
	    this.render();
	},

	render: function(){
	    var data = _.groupBy(nakit.toJSON(),'slot');
	    var titles = _.map(_.sortBy(data[0],'type'), function(current){
		return current.type;
	    });
	    this.$el.html(nakki_table({titles: titles, nakit: _.toArray(data)}));
	},

	save: function(assignedPerson){
	    var ids = _.map(this.$('form').serializeArray(), function(el) {
		return el.value;
	    });
	    
	    var self = this;
	    var _setted = _.after(ids.length, function(){
		self.render();
	    });
	    _.each(ids, function(current){
		var model = nakit.get(current);
		model.save({assign: assignedPerson.id},{
		    wait:true, 
		    success: _setted, 
		    error:function(col, error) {
			alert('failure: ' + error.statusText);
		    }});
	    });
	}
    });
    
    var Assign_Form = bb.View.extend({
	events: {'submit': 'assign'},

	initialize: function() {
	    _.bindAll(this, 'assign');
	},
	
	assign: function() {
	    vent.trigger('assignPerson', this.model);
	    return false;
	}
    });
    
    var initialize = function(options){
	var rootel = options.el;
	var partyId = options.partyId;
	
	var _error = function(col, error) {
	    alert('failure: ' + error.statusText);
	};

	party.fetch({url:'/parties/' + partyId, success:function(){
	    nakit.partyId = party.get('id');
	    
	    var _ready = function(){
	        new Party_Viewer({el:$('#party-description',rootel), model: party}); 
		new Nakki_Table({el:$('#nakki-table',rootel)});
	        new Assign_Form({el:$('#assign',rootel), model: options.loggedUser}); // TODO fix race condition
	    };

	    nakit.fetch({success:_ready,error:_error});
	},error: _error});
    };

    return {initialize:initialize};
});
