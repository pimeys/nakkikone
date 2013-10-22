"use strict";
define([
    'backbone',
    'jquery',
    'models',
    'collections',
    'vent',
    'authentication',
    'hbs!templates/navigation'
], function(Backbone, $, models, collections, vent, authentication, navigationTemplate) {

    var loggedUser; //todo kill with fire!

    //todo, move parties behind collections component...
    var createNavigation = function() {
    	var parties = new collections.Parties();
    	parties.fetch({success: function(collection, response, options){
    	    new Navigation({el:$("#navigation"), model: authentication.currentUser(), collection: collection});
    	}});
    };

    var Navigation = Backbone.View.extend({
	initialize: function() {
	    this.render();
	},

	render: function() {
	    var shownParties = this.isUserAdmin() ? this.collection : this.collection.onlyFutureParties();
	    this.$el.html(navigationTemplate({
		parties: shownParties.toJSON(), 
		user: this.model.toJSON(), 
		isAdmin: this.isUserAdmin() }))
		.show();
	    return this;
	},

	isUserAdmin: function() {
	    return this.model.get('role') === 'admin';
	}
    });

    return {
	createComponent: function (options) {
	    return new Navigation(options);
	},

	createNavigation: function() {
	    createNavigation();
	}
    };
});
