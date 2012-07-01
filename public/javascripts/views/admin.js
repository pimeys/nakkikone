define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/users.html',
	'libs/text!templates/selector.html',
	'libs/text!templates/input.html'], 
       function($, _, bb, collections, models, usr_tmpl, slctr_tmpl, input_tmpl) {

	   var selector_template = _.template(slctr_tmpl);
	   var parties = new collections.Parties();

	   var userlist_template = _.template(usr_tmpl);
	   var users = new collections.Users();

	   var input_template = _.template(input_tmpl);

	   var party_selector = bb.View.extend({
	       initialize: function() {
		   _.bindAll(this);
		   parties.fetch({success:this.render});
	       },

	       render: function(){
		   this.$el.html(selector_template({data:parties.toJSON()}));
		   return this.$el;
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

	   return { Parcipitants: user_list,
		    Selector: party_selector,
		    Assign_Form: assign_form
		  };
});