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
    'components/nakkitype-infos',
    'components/email',
    'hbs!templates/admin-screen',
    'hbs!templates/email-button'
], function(
    $,
    _,
    bb,
    collections,
    models,
    notificationArea,
    usersList,
    partySelector,
    partyEditor,
    nakkiEditor,
    nakkitypeInfoEditor,
    email,
    adminScreen,
    emailButton) {

    var vent = {};
    _.extend(vent, bb.Events);

    var parties = new collections.Parties();

    var users = new collections.Users();

    var auxUsers = new collections.AuxUsers();

    var nakkitypes = new collections.Nakkitypes();

    var nakkitypeInfos = new collections.NakkitypeInfos();

    var _error = function(collection, xhr, options) {
	//notify shitty accidents, ignore 403 and 401
    };

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
	nakkitypeInfoEditor.createComponent({el: $('#nakki-infos',rootel), collection: nakkitypeInfos}, vent);
	nakkiEditor.createComponent({el: $('#nakki-timetable', rootel), collection: nakkitypes, model: party, nakkitypeInfos: nakkitypeInfos}, vent);

	usersList.createUsers({el: $('#users', rootel), collection: users}, vent);

	usersList.createConstructors({el: $('#constructors', rootel), collection: auxUsers}, vent);
	usersList.createCleaners({el: $('#cleaners', rootel), collection: auxUsers}, vent);
	email.createComponent({el: $('#email-all', rootel)}, vent, users, auxUsers);
    };

    var initialize = function(options) {
	var latestParty;
	var rootel = options.el;
	rootel.html(adminScreen);
	vent.off(); //hard reset!

	disablePartyEditionSections();

	vent.on('changeParty', toggleSectionsOpen);
	vent.on('createdParty', toggleSectionsOpen);
	vent.on('noPartySelected', disablePartyEditionSections);

	notificationArea.createComponent({el: $('#admin-alert-area', rootel)}, vent);

	parties.fetch({
	    success: function() {
		if (parties.length > 0) {
		    latestParty = setToLatest();

		    var _ready = _.after(4, function() {
			collectionsReady(rootel, latestParty);
		    });

		    auxUsers.fetch({success: _ready, error: _error});
		    users.fetch({success: _ready, error: _error});
		    nakkitypes.fetch({success: _ready, error: _error});
		    nakkitypeInfos.fetch({success: _ready, error: _error}); //TODO this really doesn't belong here
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

    function disablePartyEditionSections() {
	var accordionsToClose = $('#party-details, #nakki-timetable, #participants-details');
	var sectionsToDisable = $('#admin-party-details, #admin-nakki-timetable, #admin-participants');
	sectionsToDisable.toggleClass('disabled', true);
	accordionsToClose.filter(isOpen).collapse('hide');
    }

    function toggleSectionsOpen() {
	var accordionsToOpen = $('#party-details, #nakki-timetable, #participants-details');
	var sectionsToEnable = $('#admin-party-details, #admin-nakki-timetable, #admin-participants');
	sectionsToEnable.toggleClass('disabled', false);
	accordionsToOpen.filter(isClosed).collapse('show');
    }

    function isClosed() {
	return !$(this).hasClass("in");
    }

    function isOpen() {
	return $(this).hasClass("in");
    }
});
