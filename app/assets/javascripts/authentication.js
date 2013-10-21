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
    var loggedUser; //todo kill with fire!

    $.ajaxSetup({
	statusCode: {
	    401: function() {
		followUpHash = followUpHash || window.location.hash;
		alert('redirection to login');
		window.location.hash = 'login';
	    },

	    403: function() {
		alert('denied');
		window.location.hash = 'denied';
	    }
	}
    });

    var attemptLoginWithSessionCookie = function(cb) {
	$.ajax({
	    url: '/login',
	    dataType: 'json',
	    success: function(data) {
		loggedUser = new models.Person(data);
		window.console.log("logged in with session cookie (user:" + loggedUser.get("name") + ")");
		vent.trigger('logged-in');
		cb();
	    },
	    statusCode: {
		401: function() {
		    window.console.log("no session cookie present...");
		    cb();
		}
	    }
	});
    };

    return {
	initialize: attemptLoginWithSessionCookie,

	getFollowUp: function() {
	    var hash = followUpHash;
	    followUpHash = undefined;
	    return hash;
	},

	currentUser: function() {return loggedUser;},

	//todo figure out how to remove this and set user only internally... 
	setLoggedUser: function(user) {
	    loggedUser = user;
	}
    };
});
