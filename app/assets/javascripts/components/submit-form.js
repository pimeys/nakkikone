"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'models',
    'hbs!templates/signup-screen'
], function($, _, bb, models, signupScreen) {

    var vent;

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
	    this.render();
	},

	notifyValidation: function() {
	    var message = {
		title: "validation failed!",
		text: "Your input is invalid: " + this.model.validationError
	    };
	    this.vent.trigger('alert', message);
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
		    self.vent.trigger('user-created');
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
	    this.vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your request failed because: " + xhr.responseText
	    };
	    this.vent.trigger('alert', message);
	}
    });

    return {
	Component: SignUp_Form,
	createComponent: function(options, _vent) {
	    var signup = new SignUp_Form(_.extend(options, {model: getSubmitUser()}));
	    signup.vent = _vent;
	    return signup;
	}
    };
});
