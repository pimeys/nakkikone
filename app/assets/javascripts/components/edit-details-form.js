"use strict";
define([
    'jquery',
    'underscore',
    'components/submit-form',
    'hbs!templates/edit-screen'
], function($, _, signupForm, editScreen) {

    var Edit_Form = signupForm.Component.extend({

	render: function() {
	    return this.$el.html(editScreen({user: this.model.toJSON()}));
	},

	save: function() {
	    var arr = this.$el.serializeArray();
	    var data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});
	    var self = this;
	    this.model.save(data, {url: "yourself",
		wait:true,
		success: function() {
		    alert('Successfully changed your details');
		},

		error: this.alert
	    });
	    return false;
	}
   });

    return {createComponent: function(options, _vent) {
	var editForm = new Edit_Form(options);
	editForm.vent = _vent;
	return editForm;
    }};
});
