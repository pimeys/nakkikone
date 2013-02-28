"use strict"
define([
    'backbone',
    'jquery',
    'models',
    'vent'
], function(Backbone, $, models, vent) {

    //Adding session authentication token to each request.
    Backbone.old_sync = Backbone.sync
    Backbone.sync = function(method, model, options) {
	var new_options =  _.extend({
            beforeSend: function(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
            }
    }, options)
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

    var loggedUser;

    var Login_View = Backbone.View.extend({
	events: {'submit':'login'},

	initialize: function() {
	    _.bindAll(this, 'login');
	},

	login: function() {
	    var arr = this.$el.serializeArray();
	    var data = _(arr).reduce(function(acc, field) {
		acc[field.name] = field.value;
		return acc;
	    }, {});

	    $.post('/login', data, function(data) {
		loggedUser = new models.Person(data);
		vent.trigger('logged-in');
	    });
	    return false;
	}
    });

    var attemptLoginWithSessionCookie = function(cb) {
	$.getJSON('/login', function(data) {
	    loggedUser = new models.Person(data);
	    console.log("logged in with session cookie (user:" + loggedUser.get("name") + ")");
	    cb();
	}).error(function() {
	    console.log("no session cookie present, should do redirect...");
	    cb();
	});
    };
    
    return {
	initialize: attemptLoginWithSessionCookie,
	LoginView: Login_View, 
	Signup: null,
	currentUser: function() {return loggedUser},
    }
});
