"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/users.html',
	'libs/text!templates/nakit.html',
	'libs/text!templates/selector.html',
	'libs/text!templates/party-description.html',
	'libs/text!templates/party-editor-form.html'],
       function($, _, bb, collections, models, usr_tmpl, nakit_tmpl, slctr_tmpl, party_tmpl, party_edit_tmpl) {

	   var vent = {};
	   _.extend(vent, bb.Events);

	   var selector_template = _.template(slctr_tmpl);

	   var party_description_template = _.template(party_tmpl);

	   var party_edit_template = _.template(party_edit_tmpl);

	   var userlist_template = _.template(usr_tmpl);

	   var nakkilist_template = _.template(nakit_tmpl);

	   var parties = new collections.Parties();
	   
	   var users = new collections.Users();

	   var nakkitypes = new collections.Nakkitypes();

	   var Party_Selector = bb.View.extend({
	       events: {
		   "change .selector" : "select",
		   "click .creator"  : "create"
	       },

	       initialize: function() {
		   _.bindAll(this);
		   parties.on('add', this.render);
		   vent.on('partyEdited', this.render);
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
			   users.reset();
			   self.$el.html('none');
		       }
		   });
	       },

	       render: function(){
		   this.$el.html(userlist_template({data:users.toJSON()}));
		   return this.$el;
	       }
	   });

	   var Nakki_List = bb.View.extend({
	       events: {
		   'click .creator' : 'create',
		   'click .deletor' : 'remove'
	       },

	       initialize: function(){
		   _.bindAll(this);
		   vent.on('changeParty', this.refresh);
		   nakkitypes.on('add', this.render);
		   nakkitypes.on('remove', this.render);
		   this.render();
	       },
	       
	       refresh: function(partyId) {
		   var self = this;
		   var party = parties.get(partyId);

		   nakkitypes.partyId = party.get('title');
		   nakkitypes.fetch({
		       success: this.render, 
		   
		       error: function(){
			   nakkitypes.reset();
			   self.$el.html(nakkilist_template({data:{}}));
		       }
		   });
	       },

	       render: function(){
		   this.$el.html(nakkilist_template({data:nakkitypes.toJSON()}));
		   return this.$el;
	       },

	       create: function(){
		   nakkitypes.add(new models.Nakkitype());
	       },

	       //TODO not work if created model, which doesn't have id yet(maybe disable delete for tehm...).
	       remove: function(target){
		   var removeId = target.currentTarget.attributes['value'].nodeValue;
		   nakkitypes.remove(removeId);
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

	       edit: function() {
		   this.$el.html(party_edit_template({party:this.model.toJSON()}))
	       },
	       
	       save: function() {
		   var arr = this.$("#edit_party").serializeArray();
		   var data = _(arr).reduce(function(acc, field) {
		       acc[field.name] = field.value;
		       return acc;
		   }, {});
		   this.model.save(data,{sucess:this.render,error:this.render});
		   vent.trigger('partyEdited');
		   return false;
	       }
	   });

	   var initialize = function() {
	       var latestParty;

	       parties.fetch({success:function(){
		   latestParty = parties.at(0);
		   users.partyId = latestParty.get('title');
		   nakkitypes.partyId = latestParty.get('title');
		   
		   var _ready = _.after(2, function(){
		       new Party_Selector({el:$('#partyselector')});
		       new Party_Viewer({el:$('#party'), model: latestParty});
		       new Nakki_List({el:$('#nakit')});
		       new User_List({el:$('#users')});
		   });
		   users.fetch({success: _ready}); 
		   nakkitypes.fetch({success: _ready}); 
	       }});
	   };

	   return { initialize: initialize };
       });