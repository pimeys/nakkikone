define([
    'jquery',
    'backbone',
    'models',
    'collections',
    'views/admin',
    'views/public',
    'libs/text!templates/admin-screen.html',
    'libs/text!templates/public-screen.html'
], function($, bb, models, collections, admin, pub, adminScreen, publicScreen) {

	var adminScreen_template = _.template(adminScreen);

	var publicScreen_template = _.template(publicScreen);

	var Router = bb.Router.extend({
	    routes: {
		'admin' : 'showAdminScreen',
		'public' : 'showLatestParty'
	    },
	    
	    showAdminScreen: function(){
		var contentEl = $('#content');
		contentEl.html(adminScreen_template);
		admin.initialize({el:contentEl});
	    },

	    showLatestParty: function() {
		this.showPublicScreen('latest');
	    },

	    showPublicScreen: function(partyId){
		var contentEl = $('#content');
		contentEl.html(publicScreen_template);
		pub.initialize({el:contentEl, partyId:partyId});
	    }
	});

	var initialize = function(){
	    var router = new Router();
	    bb.history.start({pushState: true});
	};

	return {initialize: initialize};
    });