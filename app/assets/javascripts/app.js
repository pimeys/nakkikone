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

    /* 
     * Fixing reseting of the Rails session after each ajax call.
     *
     * http://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails
     */
    $(document).ajaxSend(function(e, xhr, options) {
	var token = $("meta[name='csrf-token']").attr("content");
	xhr.setRequestHeader("X-CSRF-Token", token);
    });

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
	
	// automatically login 
	$.getJSON('/login', function(data) {
	    loggedUser = new models.Person(data);
	    alert("session present, setting logged user")
	})
	.error(function() {
	    alert("no session present, needs manual login");
	});
    };

    return {initialize: initialize};
});
