"use strict";
define([
    'jquery',
    'backbone',
    'models',
    'authentication',
    'vent',
    'components/login',
    'components/navigation',
    'views/admin',
    'views/public',
    'views/signup',
    'views/edit-details'
], function($, bb, models, authentication, vent, login, navigation, admin, pub, signup, editDetails) {

    var contentEl;

    var ApplicationRouter = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'party/id/:id' : 'showPublicScreenById',
	    'sign_up' : 'showSignUpScreen',
	    'forgot_password' : 'showForgotDialog',
	    'edit-own-details' : 'showOwnDetailsEditor',
	    'login'   : 'startingPage'
	},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(vent.itself(), 'user-created', this.startingPage);
	    this.listenTo(vent.itself(), 'logged-in', this.loggedIn);
	},

	loggedIn: function() {
	    this.createNavigation();
	    var hash = authentication.getFollowUp();
	    if(hash) {
		this.navigate(hash, {trigger: true});
	    } else {
		this.navigate('party/id/0', {trigger: true});
	    }
	},

	createNavigation: function() {
	    navigation.createNavigation();
	},

	startingPage: function() {
	    pub.detach();
	    admin.detach();
	    initLogin();
	},

	showAdminScreen: function() {
	    pub.detach();
	    admin.initialize({el:contentEl});
	},

	showSignUpScreen: function() {
	    signup.initialize({el:contentEl});
	},

	showForgotDialog: function() {
	    var email = prompt("write here your account email");
	    if (email) {
		sendResetMail(email);
	    }
	    window.location.hash = 'login';
	},

	showOwnDetailsEditor: function() {
	    editDetails.initialize({el:contentEl, currentUser: authentication.currentUser});
	},

	_showPublicScreen: function(party) {
	    admin.detach();
	    pub.initialize({el:contentEl, party: party, currentUser: authentication.currentUser});
	},

	showPublicScreen: function(title) {
	    var party = new models.PartyFinder({title:title});
	    this._showPublicScreen(party);
	},

	showPublicScreenById: function(id) {
	    var party = new models.PartyFinder({id:id});
	    this._showPublicScreen(party);
	}
    });

    var loginView;
    var initLogin = function() {
	loginView = loginView || login.createComponent({el:contentEl});
	loginView.render();
    };

    var sendResetMail = function(email) {
	$.get("/reset_password?email=" + email, function(data) {
	    alert("Email has sent to email address, go check your mails");
	}).fail(function(data) {
	    alert("something went wrong, contact webmaster@entropy.fi");
	});
    };

    var afterAuth = function() {
	if (!authentication.currentUser()) {
	    initLogin();
	}
    };

    var initialize = function(options) {
	contentEl = options.el;
	new ApplicationRouter();
	bb.history.start();
	authentication.initialize(afterAuth);
    };

    return {initialize: initialize};
});
