"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/users.html',
	'libs/text!templates/nakit.html',
	'libs/text!templates/edit-nakkis.html',
	'libs/text!templates/selector.html',
	'libs/text!templates/party-description.html',
	'libs/text!templates/party-editor-form.html'],
       function($, _, bb, collections, models, usr_tmpl, nakit_tmpl, edit_nakki_tmpl, slctr_tmpl, party_tmpl, party_edit_tmpl) {

	   var vent = {};
	   _.extend(vent, bb.Events);

	   var selector_template = _.template(slctr_tmpl);

	   var party_description_template = _.template(party_tmpl);

	   var party_edit_template = _.template(party_edit_tmpl);

	   var userlist_template = _.template(usr_tmpl);

	   var nakkilist_template = _.template(nakit_tmpl);

	   var nakkilist_edit_template = _.template(edit_nakki_tmpl);

	   var parties = new collections.Parties();
	   
	   var users = new collections.Users();

	   var nakkitypes = new collections.Nakkitypes();

	   var counter = 1;

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
		   this.render();
	       },

	       render: function(partyTitle){
		   
		   this.$el.html(selector_template({data:parties.toJSON(), selected:partyTitle}));
		   return this.$el;
	       },
	       
	       select: function(target) {
		   var partyId = this.$('form').serializeArray()[0].value;
		   vent.trigger('changeParty',partyId);
	       },

	       create: function() {
		   var partyTitle = prompt("Give name to the party (cannot be changed afterwards)","party");
		   parties.add({title:partyTitle});
		   vent.trigger('changeParty',partyTitle);
		   this.render(partyTitle);
	       },

	       destroy: function(){
		   var partyId = this.$('form').serializeArray()[0].value;
		   parties.remove(partyId);
		   vent.trigger('changeParty',parties.at(0));
		   this.render();
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
		   'click .editor' : 'edit',
		   'click .setter' : 'saveCollection',
		   'click .creator' : 'create',
		   'click .deletor' : 'remove'
	       },

	       initialize: function(){
		   _.bindAll(this);
		   vent.on('changeParty', this.refresh);
		   nakkitypes.on('add', this.edit);
		   nakkitypes.on('remove', this.edit);
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
		   nakkitypes.add(new models.Nakkitype({type:'tyyppi' + counter++}));
	       },

	       edit: function(){
		   this.$el.html(nakkilist_edit_template({data:nakkitypes.models}));
		   return this.$el;
	       },

	       remove: function(target){
		   var removeId = target.currentTarget.attributes['value'].nodeValue;
		   nakkitypes.remove(removeId);
	       },

	       saveCollection: function(){
		   //TODO here we would reset whole collection based on input of the edit table.
		   $('#nakit form').each(function(){
		       var arr = $(this).serializeArray();
		       var data = _(arr).reduce(function(acc, field) {
			   acc[field.name] = field.value;
			   return acc;
		       }, {});
		       var model = nakkitypes.getByCid(data["cid"]);
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
		   this.render();
	       },
	       
	       render: function(){
		   this.$el.html(party_description_template({party:this.model.toJSON(), editable:true}));
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

	   var initialize = function(options) {
	       var latestParty;
	       var rootel = options.el;

	       parties.fetch({success:function(){
		   latestParty = parties.at(0);
		   users.partyId = latestParty.get('title');
		   nakkitypes.partyId = latestParty.get('title');
		   
		   var _ready = _.after(2, function(){
		       new Party_Selector({el:$('#partyselector',rootel), selected: latestParty.title});
		       new Party_Viewer({el:$('#party',rootel), model: latestParty});
		       new Nakki_List({el:$('#nakit',rootel)});
		       new User_List({el:$('#users',rootel)});
		   });
		   users.fetch({success: _ready}); 
		   nakkitypes.fetch({success: _ready}); 
	       }});
	   };

	   return { initialize: initialize };
       });