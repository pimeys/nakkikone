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

    //TODO fix party creation refresh for nakkitypes editor.

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

    var initialize = function(options) {
	var latestParty;
	var rootel = options.el;
	rootel.html(adminScreen);
	vent.off(); //hard reset!

	notificationArea.createComponent({el: $('#admin-alert-area', rootel)}, vent);

	parties.fetch( {
	    success: function() {
		//TODO remove this stuff
		if (parties.length > 0) {

		    latestParty = parties.last();
		    users.partyId = latestParty.get('id');
		    auxUsers.partyId = latestParty.get('id');
		    nakkitypes.partyId = latestParty.get('id');

		    var _ready = _.after(3, function(){
			partySelector.createComponent({el: $('#party-selector',rootel), collection: parties, model: latestParty}, vent);
			partyEditor.createComponent({el: $('#party', rootel), collection: parties, model: latestParty}, vent);
			nakkiEditor.createComponent({el: $('#nakit', rootel), model: latestParty, collection: nakkitypes}, vent);

			usersList.createConstructors({el: $('#constructors', rootel), collection: auxUsers}, vent);
			usersList.createUsers({el: $('#users', rootel), collection: users}, vent);
			usersList.createCleaners({el: $('#cleaners', rootel), collection: auxUsers}, vent);

			new EmailToAll({el: $('#email-all', rootel)});
		    });

		    auxUsers.fetch({success: _ready, error: _error});
		    users.fetch({success: _ready, error: _error});
		    nakkitypes.fetch({success: _ready, error: _error});
		} else { //TODO remove?
		    partySelector.createComponent({el: $('#party-selector',rootel), collection: parties}, vent);
		    partyEditor.createComponent({el:$('#party',rootel), collection: parties, model: new models.Party({title:'No parties yet'})}, vent);
		    nakkiEditor.createComponent({el: $('#nakit', rootel), collection: nakkitypes}, vent);

		    usersList.createUsers({el: $('#users', rootel), collection: users}, vent);
		    new EmailToAll({el: $('#email-all', rootel)});
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
