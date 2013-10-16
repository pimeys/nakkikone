"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'hbs!templates/email-button'
], function($, _, bb, collections, models, emailButton) {

    var vent;

    var users;

    var auxUsers;

    var EmailToAll = bb.View.extend({
	events: {
	    'click .mail-to' : 'sendMail'
	},

	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	    this.listenTo(users, "reset add destroy remove", this.render);
	    this.listenTo(auxUsers, "reset add destroy remove", this.render);
	    this.render();
	},

	render: function() {
	    this.$el.html(emailButton({emails: this.allPartyParcipitantsEmails()}));
	    return this;
	},

	allPartyParcipitantsEmails: function() {
	    return _.uniq(_.union(users.pluck('email'), auxUsers.pluck('email'))); 
	},

	sendMail: function() {
	    var toAll = _.uniq(this.allPartyParcipitantsEmails());
	    window.open("mailto:" + toAll, "_email");
	}
    });

    return {
	createComponent: function(options, _vent, _users, _auxUsers) {
	    vent = _vent;
	    users = _users;
	    auxUsers = _auxUsers;
	    return new EmailToAll(options);
	}
    };
});
