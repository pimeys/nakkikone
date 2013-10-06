"use strict";
define([
    'backbone',
    'jquery',
    'models',
    'collections',
    'vent',
    'hbs!templates/navigation',
    'hbs!templates/loginForm'
], function(Backbone, $, models, collections, vent, navigationTemplate, loginForm) {

    //Adding session authentication token to each request.
    Backbone.old_sync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
	var new_options = _.extend({
            beforeSend: function(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
            }
    }, options);
	Backbone.old_sync(method, model, new_options);
    };
    
    /* 
     * Fixing reseting of the Rails session after each ajax call.
     * http://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails
     */
    $(document).ajaxSend(function(e, xhr, options) {
	var token = $("meta[name='csrf-token']").attr("content");
	xhr.setRequestHeader("X-CSRF-Token", token);
    });

    var followUpHash;

    $.ajaxSetup({
	statusCode: {
	    401: function() {
		followUpHash = window.location.hash;
		alert('redirection to login');
		window.location.hash = 'login';
	    },
	    
	    403: function() {
		alert('denied');
		window.location.hash = 'denied';
	    }
	}
    });

    var loggedUser; //todo kill with fire!

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
		loggedUser = new models.Person(data);
		createNavigation();
		vent.trigger('logged-in', followUpHash);
		followUpHash = undefined;
	    });
	    return false;
	}
    });

    var attemptLoginWithSessionCookie = function(cb) {
	$.ajax({
	    url: '/login',
	    dataType: 'json',
	    success: function(data) {
		loggedUser = new models.Person(data);
		console.log("logged in with session cookie (user:" + loggedUser.get("name") + ")");
		createNavigation();
		cb();
	    }, 
	    statusCode: {
		401: function() {
		    console.log("no session cookie present...");
		    cb();
		}
	    }
	});
    };

    //todo this horribility removed to app level... 
    var createNavigation = function() {
	var parties = new collections.Parties();
	parties.fetch({success: function(collection, response, options){
	    new Navigation({el:$("#navigation"), model: loggedUser, collection: collection}).render();
	}});
    };

    var Navigation = Backbone.View.extend({
	render: function() {
	    this.$el.html(navigationTemplate({parties: this.collection.toJSON(), user: this.model.toJSON(), isAdmin: this.model.get('role') === 'admin'})).show(); //TODO encapsulate to view..
	    return this;
	}
    });

    return {
	initialize: attemptLoginWithSessionCookie,
	LoginView: Login_View, 
	Signup: null,
	currentUser: function() {return loggedUser;}
    };
});
