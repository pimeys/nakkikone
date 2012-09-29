define([
    'jquery',
    'backbone',
    'models',
    'collections',
    'views/admin',
    'views/public',
    'views/signup',
    'libs/text!templates/admin-screen.html',
    'libs/text!templates/signup-screen.html',
    'libs/text!templates/public-screen.html'
], function($, bb, models, collections, admin, pub, signup, adminScreen, signupScreen, publicScreen) {

    var adminScreen_template = _.template(adminScreen);

    var publicScreen_template = _.template(publicScreen);

    var signupScreen_template = _.template(signupScreen);

    var contentEl = $('#content');

    var router;

    var Login_View = bb.View.extend({
	events: {'submit':'login'},

	initialize: function() {
	    _.bindAll(this, 'login');
	},

	login: function() {
	    alert('trying to log in');
	    router.navigate('admin',{trigger:true});
	    return false;
	}
    });

    var Router = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'sign_up' : 'showSignUpScreen'
	},
	
	showAdminScreen: function(){
	    contentEl.html(adminScreen_template);
	    admin.initialize({el:contentEl});
	},

	showSignUpScreen: function(){
	    contentEl.html(signupScreen_template);
	    signup.initialize({el:contentEl});
	},

	showPublicScreen: function(id){
	    contentEl.html(publicScreen_template);
	    pub.initialize({el:contentEl, partyId:id});
	}
    });

    var initialize = function(){
	new Login_View({el:$('#login')});
	router = new Router();
	bb.history.start();
    };

    return {initialize: initialize};
});
