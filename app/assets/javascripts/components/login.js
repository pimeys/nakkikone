"use strict";
define([
    'backbone',
    'underscore',
    'jquery',
    'models',
    'vent',
    'authentication',
    'hbs!templates/loginForm'
], function(Backbone, _, $, models, vent, authentication, loginForm) {

    var Login_View = Backbone.View.extend({
	events: {'submit': 'login'},

	initialize: function() {
	    _.bindAll(this);
	    this.render();
	},

	render: function() {
	    this.$el.html(loginForm());
	},

	login: function() {
	    var arr = $('#login', this.$el).serializeArray();
	    var data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});

	    $.post('/login', data, function(data) {
		authentication.setLoggedUser(new models.Person(data));
		vent.trigger('logged-in');
	    });
	    return false;
	}
    });

    return {
	createComponent: function(options) {
	    return new Login_View(options);
	}
    };
});
