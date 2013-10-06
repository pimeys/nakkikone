"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'components/notification-area',
    'components/users-list',
    'components/party-selector',
    'components/party-editor',
    'components/nakkitype-editor',
    'hbs!templates/admin-screen',
    'hbs!templates/email-button'
], function($, _, bb, collections, models, notificationArea, usersList, partySelector, partyEditor, nakkiEditor, adminScreen, emailButton) {

    var vent = {};
    _.extend(vent, bb.Events);

    var parties = new collections.Parties();

    var users = new collections.Users();

    var auxUsers = new collections.AuxUsers();

    var nakkitypes = new collections.Nakkitypes();

    var _error = function(collection, xhr, options) {
	//notify shitty accidents, ignore 403 and 401
    };

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
	    return _.uniq(_.union(users.pluck('email'),auxUsers.pluck('email'))); 
	},

	sendMail: function() {
	    var toAll = _.uniq(this.allPartyParcipitantsEmails());
	    window.open("mailto:" + toAll, "_email");
	}
    });

    var createFirstParty = function() {
	var title = prompt("We noticed that there are no parties, lets create one! Give title to first nakkikone party");
	parties.create( {title: title}, {
	    success: function() {
		initialize();
	    }, 
	    error: _error
	});
    };

    var setToLatest = function() {
	var party = parties.last();
	users.partyId = party.get('id');
	auxUsers.partyId = party.get('id');
	nakkitypes.partyId = party.get('id');
	return party;
    };

    var collectionsReady = function(rootel, party) {
	partySelector.createComponent({el: $('#party-selector',rootel), collection: parties, model: party}, vent);
	partyEditor.createComponent({el: $('#party', rootel), collection: parties, model: party}, vent);
	nakkiEditor.createComponent({el: $('#nakit', rootel), collection: nakkitypes, model: party}, vent);

	usersList.createUsers({el: $('#users', rootel), collection: users}, vent);

	usersList.createConstructors({el: $('#constructors', rootel), collection: auxUsers}, vent);
	usersList.createCleaners({el: $('#cleaners', rootel), collection: auxUsers}, vent);

	new EmailToAll({el: $('#email-all', rootel)});
    };

    var initialize = function(options) {
	var latestParty;
	var rootel = options.el;
	rootel.html(adminScreen);
	vent.off(); //hard reset!

	notificationArea.createComponent({el: $('#admin-alert-area', rootel)}, vent);

	parties.fetch( {
	    success: function() {
		if (parties.length > 0) {
		    latestParty = setToLatest();

		    var _ready = _.after(3, function() {
			collectionsReady(rootel, latestParty);
		    });

		    auxUsers.fetch({success: _ready, error: _error});
		    users.fetch({success: _ready, error: _error});
		    nakkitypes.fetch({success: _ready, error: _error});
		} else { 
		    createFirstParty();
		}
	    },
	    error: _error
	});
    };

    return { 
	initialize: initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
