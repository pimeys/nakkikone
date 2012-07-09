define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/users.html',
	'libs/text!templates/selector.html',
	'libs/text!templates/party-description.html'],
       function($, _, bb, collections, models, usr_tmpl, slctr_tmpl, party_tmpl) {

	   var selector_template = _.template(slctr_tmpl);
	   var parties = new collections.Parties();

	   var userlist_template = _.template(usr_tmpl);
	   var users = new collections.Users();

	   var party_description_template = _.template(party_tmpl);

	   var party_selector = bb.View.extend({
	       events: {
		   "change .selector" : "select",
		   "click .creator"  : "create"
	       },

	       initialize: function() {
		   _.bindAll(this);
		   parties.fetch({success:this.render});
	       },

	       render: function(){
		   this.$el.html(selector_template({data:parties.toJSON()}));
		   return this.$el;
	       },
	       
	       select: function(target) {
		   var optionIndex = target.currentTarget.options.selectedIndex;
		   var partyIndex = target.currentTarget.options[optionIndex].value;
		   var party = parties.get(partyIndex).toJSON();
		   alert(party.title + "\n" + party.description);
	       },

	       create: function() {
		   parties.add({title:"uudet bileet"});
		   this.render();
	       }
	   });

	   var user_list = bb.View.extend({
	       initialize: function(){
		   _.bindAll(this);
		   users.fetch({success:this.render});
	       },
	       
	       render: function(){
		   this.$el.html(userlist_template({data:users.toJSON()}));
		   return this.$el;
	       }
	   });

	   var party_viewer = bb.View.extend({
	       initialize: function(){
		   _.bindAll(this);
		   this.render();
	       },
	       
	       render: function(){
		   this.$el.html(party_description_template({party:this.model.toJSON()}));
		   new user_list({el: this.$('#parcipitants')});
		   return this.$el;
	       }
	   });

	   var assign_form = bb.View.extend({
	       events: {'submit': 'save'},

	       initialize: function() {
		   _.bindAll(this, 'save');
	       },
	       
	       render: function() {
		   return this.$el;
	       },

	       save: function() {
		   var arr = this.$el.serializeArray();
		   var data = _(arr).reduce(function(acc, field) {
		       acc[field.name] = field.value;
		       return acc;
		   }, {});
		   this.model.save(data);
		   return false;
	       }
	   });

	   return { Selector: party_selector,
		    Assign_Form: assign_form,
		    Party_Viewer: party_viewer
		  };
});