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
    'views/signup',
    'hbs!templates/admin-screen',
    'hbs!templates/public-screen'
], function($, bb, authentication, models, collections, vent, admin, pub, signup, adminScreen, publicScreen) {

    var contentEl = $('#content');

    var router;

    var Router = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'sign_up' : 'showSignUpScreen'
	},

	initialize: function() {
	    vent.on('logged-in', function(){ router.navigate('party/1', {trigger:true});});
	},
	
	showAdminScreen: function() {
	    contentEl.html(adminScreen);
	    admin.initialize({el:contentEl});
	},

	showSignUpScreen: function() {
	    signup.initialize({el:contentEl});
	},

	showPublicScreen: function(id) {
	    contentEl.html(publicScreen);
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
