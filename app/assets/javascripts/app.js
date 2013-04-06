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
	    'sign_up' : 'showSignUpScreen'
	},

	initialize: function() {
	    vent.on('user-created', function(){ location.href='/'}); //todo trigger route to show login page, now reloads whole page..
	    vent.on('logged-in', function(){ router.navigate('party/id/1', {trigger:true});}); //todo remove or make dynamic query of latest
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
	    new authentication.LoginView({el:$('#login')});
	    router = new Router();
	    bb.history.start();
	});
    };

    return {initialize: initialize};
});
