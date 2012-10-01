"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'models',
    'vent',
    'libs/text!templates/signup-screen.html',
    'libs/text!templates/outer-template.html'
], function($, _, bb, models, vent, signupScreen, outer_template) {
    
    var signupScreen_template = _.template(signupScreen);
    
    var SubmitModel = models.Person.extend({
	defaults: {
	    name: "Your name",
	    email: "your@email.com",
	    number: "0123456",
	    password: "password",
	    password_confirmation: ""
	},
	
	urlRoot: 'users',

	validate: function(attr) {
	    if (attr.password !== attr.password_confirmation) {
		return "you miss typed your password";
	    }
	}
    });

    var getSubmitUser = function() {
	var user = new SubmitModel(); 
	return user;
    };

    var SignUp_Form = bb.View.extend({
	events: {'submit': 'save'},

	initialize: function() {
	    _.bindAll(this, 'save');
	},

	render: function() {
	    return this.$el.html(signupScreen_template({user:this.model.toJSON()}));
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
		    vent.trigger('created-user');
		},

		error: function(model, err) {
		    alert('Failed to create user, ' + err);
		    self.reset();
		}
	    });
	    return false;
	},

	reset: function() {
	    this.model = getSubmitUser();
	    this.render();
	}
    });
    
    var initialize = function(options){
	var rootDiv = options.el.html(outer_template);
	new SignUp_Form({el:$('#signup', rootDiv), model: getSubmitUser()}).render();
    };
    
    return {initialize:initialize};
});
