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
	       
	       render: function() {
		   return this.$el;
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
	       new SignUp_Form({el:options.el, model: new models.Person()}).render();
	   };
	 
	   return {initialize:initialize};
       });
