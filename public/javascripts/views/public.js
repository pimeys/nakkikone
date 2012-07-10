"use strict";
define(['jquery',
	'underscore',
	'backbone',
	'collections',
	'models',
	'libs/text!templates/party-description.html'],
       function($, _, bb, collections, models, party_tmpl) {

	   var party_description_template = _.template(party_tmpl);
	   
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

	   return {Assign_Form:assign_form};
       });