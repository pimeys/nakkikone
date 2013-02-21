"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'hbs!templates/users',
	'hbs!templates/nakit',
	'hbs!templates/edit-nakkis',
	'hbs!templates/selector',
	'hbs!templates/party-description',
	'hbs!templates/party-editor-form'],
       function($, _, bb, collections, models, userlist, nakkilist, nakkilist_edit, selector, party_description, party_edit) {

	   //TODO fix party creation refresh for nakkitypes editor.

	   var vent = {};
	   _.extend(vent, bb.Events);

	   var parties = new collections.Parties();
	   
	   var users = new collections.Users();

	   var nakkitypes = new collections.Nakkitypes();

	   var counter = 1;

	   var errorHandle = function(){
	       alert('wat?');
	   }

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
		   this.$el.html(selector({parties:parties.toJSON(), selected:partyTitle}));
		   return this.$el;
	       },
	       
	       select: function(target) {
		   var partyId = this.$('form').serializeArray()[0].value;
		   vent.trigger('changeParty',partyId);
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
		   var model = parties.getByCid(partyId);
		   model.destroy({wait:true, 
				  success:function(){
				      vent.trigger('changeParty',parties.at(0));
				      self.render();
				  },
				  error: errorHandle });
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
		   var party = parties.getByCid(partyId);

		   users.partyId = party.get('id');
		   users.fetch({
		       success: this.render, 
		       
		       error: function(){
			   users.reset();
			   self.$el.html('none');
		       }
		   });
	       },

	       render: function(){
		   this.$el.html(userlist({persons:users.toJSON()}));
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
		   var party = parties.getByCid(partyId);

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

	       remove: function(target){
		   var self = this;
		   var removeId = target.currentTarget.attributes['value'].nodeValue;
		   var model = nakkitypes.getByCid(removeId);
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
		   vent.on('createdParty', this.creationEdit);
		   this.render();
	       },
	       
	       render: function(){
		   this.$el.html(party_description({party:this.model.toJSON(), editable:true}));
		   return this.$el;
	       },

	       select: function(partyId) {
		   this.model = parties.getByCid(partyId);
		   this.render();
	       },

	       edit: function() {
		   this.$el.html(party_edit({party:this.model.toJSON()}))
	       },

	       creationEdit: function(partyId){
		   this.model = parties.getByCid(partyId);
		   this.edit();
	       },

	       save: function() {
		   var arr = this.$("#edit_party").serializeArray();
		   var data = _(arr).reduce(function(acc, field) {
		       acc[field.name] = field.value;
		       return acc;
		   }, {});
		   this.model.save(data, {success:this.render, 
					  error:function(){alert('saving of the party failed in backend')}});
		   vent.trigger('partyEdited');
		   return false;
	       }
	   });

	   var initialize = function(options) {
	       var latestParty;
	       var rootel = options.el;
	       var _error = function(col, error) {
		   alert('failure: ' + error.statusText)
	       };

	       parties.fetch( {
		   success: function() {
		       //TODO remove this stuff
		       if (parties.length > 0) {
			   latestParty = parties.at(0);
			   users.partyId = latestParty.get('id');
			   nakkitypes.partyId = latestParty.get('id');
			   
			   var _ready = _.after(2, function(){
			       new Party_Selector({el:$('#party-selector',rootel), selected: latestParty.title});
			       new Party_Viewer({el:$('#party',rootel), model: latestParty});
			       new Nakki_List({el:$('#nakit',rootel)});
			       new User_List({el:$('#users',rootel)});
			   });

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

	   return { initialize: initialize };
       });
