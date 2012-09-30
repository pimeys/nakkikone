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

    var loggedUser;

    var Login_View = bb.View.extend({
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
		router.navigate('party/1',{trigger: true});
	    });
	    return false;
	}
    });

    var Router = bb.Router.extend({
	routes: {
	    'admin' : 'showAdminScreen',
	    'party/:id' : 'showPublicScreen',
	    'sign_up' : 'showSignUpScreen'
	},
	
	showAdminScreen: function() {
	    contentEl.html(adminScreen_template);
	    admin.initialize({el:contentEl});
	},

	showSignUpScreen: function() {
	    contentEl.html(signupScreen_template);
	    signup.initialize({el:contentEl});
	},

	showPublicScreen: function(id) {
	    contentEl.html(publicScreen_template);
	    pub.initialize({el:contentEl, partyId:id, loggedUser: loggedUser});
	}
    });

    var initialize = function(){
	new Login_View({el:$('#login')});
	router = new Router();
	bb.history.start();
    };

    return {initialize: initialize};
});
