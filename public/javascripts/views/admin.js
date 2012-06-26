define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'libs/text!templates/users.html'], 
       function($, _, bb, collections, usersTemplate) {

	   var compiledTemplate = _.template(usersTemplate);

	   var users = new collections.Users();

	   var userList = bb.View.extend({
	       initialize: function(){
		   _.bindAll(this);
		   users.fetch({success:this.render});
	       },
	       
	       render: function(){
		   this.$el.html(compiledTemplate({data:users.toJSON()}));
		   return this.$el;
	       }
	   });

	   return {View:userList};
});