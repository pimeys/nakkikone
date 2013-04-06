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

    var router;

    var Router = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'party/id/:id' : 'showPublicScreenById',
	    'sign_up' : 'showSignUpScreen',
	    'login'   : 'startingPage'
	},

	initialize: function() {
	    vent.on('user-created', this.startingPage);
	    vent.on('logged-in', function(hash){ 
		if(hash) {
		    router.navigate(hash, {trigger: true});
		} else {
		    router.navigate('party/id/1', {trigger: true});
		}
	    }); //todo remove or make dynamic query of latest
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
	    router = new Router();
	    bb.history.start();
	});
    };

    return {initialize: initialize};
});
