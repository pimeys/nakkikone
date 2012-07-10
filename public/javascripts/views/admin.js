"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/users.html',
	'libs/text!templates/selector.html',
	'libs/text!templates/party-description.html'],
       function($, _, bb, collections, models, usr_tmpl, slctr_tmpl, party_tmpl) {

	   var vent = {};
	   _.extend(vent, bb.Events);

	   var selector_template = _.template(slctr_tmpl);

	   var party_description_template = _.template(party_tmpl);

	   var userlist_template = _.template(usr_tmpl);

	   var parties = new collections.Parties();
	   
	   var users = new collections.Users();

	   var Party_Selector = bb.View.extend({
	       events: {
		   "change .selector" : "select",
		   "click .creator"  : "create"
	       },

	       initialize: function() {
		   _.bindAll(this);
		   parties.on('add', this.render);
		   this.render();
	       },

	       render: function(){
		   this.$el.html(selector_template({data:parties.toJSON()}));
		   return this.$el;
	       },
	       
	       select: function(target) {
		   var optionIndex = target.currentTarget.options.selectedIndex;
		   var partyId = target.currentTarget.options[optionIndex].value;
		   vent.trigger('changeParty',partyId);
	       },

	       create: function() {
		   parties.add({title:"uudet bileet"});
	       }
	   });

	   var User_List = bb.View.extend({
	       initialize: function(){
		   _.bindAll(this);
		   vent.on('changeParty', this.refresh);
		   this.render();
	       },
	       
	       refresh: function(partyId) {
		   var self = this;
		   var party = parties.get(partyId);

		   users.partyId = party.get('title');
		   users.fetch({
		       success: this.render, 
		   
		       error: function(){
			   self.$el.html('none');
		       }
		   });
	       },

	       render: function(){
		   this.$el.html(userlist_template({data:users.toJSON()}));
		   return this.$el;
	       }
	   });

	   var Party_Viewer = bb.View.extend({
	       events: {
		   "change .selector"   : "select",
		   "click .creator"     : "create",
		   "click .editor"    : "save"
	       },
	       
	       initialize: function(){
		   _.bindAll(this);
		   vent.on('changeParty', this.select);
		   this.render();
	       },
	       
	       render: function(){
		   this.$el.html(party_description_template({party:this.model.toJSON()}));
		   return this.$el;
	       },

	       select: function(partyId) {
		   this.model = parties.get(partyId);
		   this.render();
	       },

	       create: function() {
		   parties.add({title:"uudet bileet"});
		   this.render();
	       },

	       save: function() {
		   var arr = this.$el.serializeArray();
		   alert(arr);
	       }
	   });
	   
	   var initialize = function() {
	       var latestParty;

	       parties.fetch({success:function(){
		   latestParty = parties.at(0);
		   users.partyId = latestParty.get('title');
		   users.fetch({success:function(){
		       new Party_Selector({el:$('#partyselector')});
		       new Party_Viewer({el:$('#party'), model: latestParty});
		       new User_List({el:$('#users')});
		   }});
	       }});	       
	   };

	   return { initialize: initialize };
       });