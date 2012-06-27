define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'libs/text!templates/users.html',
	'libs/text!templates/selector.html'], 
       function($, _, bb, collections, usr_tmpl, slctr_tmpl) {

	   var selector_template = _.template(slctr_tmpl);
	   var parties = new collections.Parties();

	   var userlist_template = _.template(usr_tmpl);
	   var users = new collections.Users();

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

	   return { Parcipitants: user_list,
		    Selector: party_selector};
});