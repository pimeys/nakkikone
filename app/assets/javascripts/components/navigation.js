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
	    this.$el.html(navigationTemplate({parties: this.collection.toJSON(), user: this.model.toJSON(), isAdmin: this.model.get('role') === 'admin'})).show(); //TODO encapsulate to view..
	    return this;
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
