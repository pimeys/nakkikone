"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'models',
    'vent',
    'components/notification-area',
    'hbs!templates/signup-screen',
    'hbs!templates/edit-screen',
    'hbs!templates/outer-template',
    'hbs!templates/edit-own-details'
], function($, _, bb, models, vent, noficationArea, signupScreen, editScreen, outer_template, edit_own_details) {

    var internalVent = {};
    _.extend(internalVent, bb.Events);

    var SubmitModel = models.Person.extend({
	defaults: {
	    name: null,
	    nick: null,
	    email: null,
	    number: null,
	    password: null,
	    password_confirmation: null
	},
	
	urlRoot: 'users',

	validate: function(attr, options) {
	    if (!attr['name']) {
		return "name missing (mandatory)";
	    }
	    if (!attr['nick']) {
		return "nick name missing (mandatory)";
	    }
	    if (!attr['email']) {
		return "missing email (mandatory)";
	    }
	    if (!attr['password']) {
		return "you must have a password!";
	    }
	    if (attr.password !== attr.password_confirmation) {
		return "you miss typed your password";
	    }
	    return null;
	}
    });

    var getSubmitUser = function() {
	var user = new SubmitModel(); 
	return user;
    };

    var SignUp_Form = bb.View.extend({
	events: {'submit': 'save'},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.model,'invalid',this.notifyValidation);
	},

	notifyValidation: function() {
	    var message = {
		title: "validation failed!",
		text: "Your input is invalid: " + this.model.validationError
	    };
	    internalVent.trigger('alert', message);
	},

	render: function() {
	    return this.$el.html(signupScreen({user: this.model.toJSON()}));
	},

	save: function() {
	    var arr = this.$el.serializeArray();
	    var data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});
	    var self = this;
	    this.model.save(data, {
		wait:true, 
		success: function() {
		    alert('Succesfully created new user! Go on and login.');
		    vent.trigger('user-created');
		},

		error: this.alert
	    });
	    return false;
	},

	notify: function(model, options) {
	    var message = {
		title: "Success!",
		text: ""
	    };
	    internalVent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your request failed because: " + xhr.responseText
	    };
	    internalVent.trigger('alert', message);
	}
    });

    var Edit_Form = SignUp_Form.extend({
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

    var initialize = function(options){
	var rootDiv = options.el.html(outer_template);
	
	new SignUp_Form({el: $('#signup', rootDiv), model: getSubmitUser()}).render();
	noficationArea.createComponent({el: $('#signup-alert-area', rootDiv)}, internalVent);
    };

    var initializeWithEditDetails = function(options){
	var rootDiv = options.el.html(edit_own_details);
	
	new Edit_Form({el: $('#signup', rootDiv), model: options.currentUser()}).render();
	noficationArea.createComponent({el: $('#signup-alert-area', rootDiv)}, internalVent);
    };
    
    return {initialize:initialize, initializeWithEditDetails:initializeWithEditDetails};
});
