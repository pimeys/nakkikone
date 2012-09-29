"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'models'],
       function($, _, bb, models) {
	   
	   var SignUp_Form = bb.View.extend({
	       events: {'submit': 'save'},

	       initialize: function() {
	       	   _.bindAll(this, 'save');
	       },

	       save: function() {
		   var arr = this.$el.serializeArray();
		   var data = _(arr).reduce(function(acc, field) {
		       acc[field.name] = field.value;
		       return acc;
		   }, {});
		   this.model.save(data, {
		       wait:true, 
		       success: function() {
			   alert('successfully created new user!');
		       },
		       error: function() {
			   alert('failed to create new user!');
		       }
		   });
		   return false;
	       }
	   });
	   
	   var initialize = function(options){
	       var user = new models.Person(); 
	       user.urlRoot = 'users';
	       new SignUp_Form({el:$('#signup', options.el), model: user});
	   };
	 
	   return {initialize:initialize};
       });
