"use strict";
define([
    'jquery',
    'backbone',
    'authentication',
    'models',
    'collections',
    'vent',
    'views/admin',
    'views/public',
    'views/signup'
], function($, bb, authentication, models, collections, vent, admin, pub, signup) {

    var contentEl = $('#content');

    var ApplicationRouter = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'party/id/:id' : 'showPublicScreenById',
	    'sign_up' : 'showSignUpScreen',
	    'login'   : 'startingPage'
	},

	initialize: function() {
	    _.bindAll(this);
	    vent.on('user-created', this.startingPage);
	    vent.on('logged-in', this.loggedIn);
	},
	
	loggedIn: function(hash) {
	    if(hash) {
		this.navigate(hash, {trigger: true});
	    } else {
		this.navigate('party/id/1', {trigger: true});
	    }
	},

	startingPage: function() {
	    new authentication.LoginView({el:contentEl});
	},

	showAdminScreen: function() {
	    pub.detach();
	    admin.initialize({el:contentEl});
	},

	showSignUpScreen: function() {
	    signup.initialize({el:contentEl});
	},

	showPublicScreen: function(title) {
	    admin.detach();
	    pub.initialize({el:contentEl, partyTitle:title, currentUser: authentication.currentUser});
	},

	showPublicScreenById: function(id) {
	    admin.detach();
	    pub.initialize({el:contentEl, partyId:id, currentUser: authentication.currentUser});
	}
    });

    var initialize = function() {
	authentication.initialize(function() {
	    if (!authentication.currentUser()) {
		new authentication.LoginView({el:contentEl});
	    }
	    new ApplicationRouter();
	    bb.history.start();
	});
    };

    return {initialize: initialize};
});
