"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'components/party-viewer',
    'components/nakkitype-info-description-view',
    'components/nakki-table',
    'components/assign-form',
    'components/notification-area',
    'components/aux-jobs',
    'bs',
    'hbs!templates/public-screen'
], function($, _, bb, collections, models, partyViewer, nakkiInfoDescriptionViewer, nakkiTable, assignForm, notificationArea, auxJobs, bs, publicScreen) {

    var vent = {};
    _.extend(vent, bb.Events);

    var nakit = new collections.Nakit();

    var nakkiInfos = new collections.NakkiInfosForParty();

    //todo move to separate error-handling-module
    var _error = function(col, error) {
    };

    var AuxUsers = collections.AuxUsers.extend({
	resource: 'aux_parcipitants_names'
    });
    var auxUsers = new AuxUsers();

    //todo tobe removed
    var bindCancelRefresh = function () {
	var withReset = function(collection) {
	    return function() {collection.fetch({reset:true});};
	};
	nakit.listenTo(vent, 're-fetch-collections', withReset(nakit));
	auxUsers.listenTo(vent, 're-fetch-collections', withReset(auxUsers));
    };

    //todo this should be done diffentenly, now blocks good event binding from collections
    var initialize = function(options) {
	var rootel = options.el;
	rootel.html(publicScreen);
	vent.off(); //hard reset! todo this needs to be removed

	bindCancelRefresh();
	notificationArea.createComponent({el: $('#alert-area', rootel)}, vent);
	
	var party = options.party;
	party.fetch({success: function() {
	    nakit._party = party;
	    nakit.partyId = party.get('id');
	    nakkiInfos.partyId = party.get('id');
	    auxUsers.partyId = party.get('id');

	    var _ready = _.after(3, function() {
		partyViewer.createComponent({el: $('#party-description',rootel), model: party }, vent);
		nakkiInfoDescriptionViewer.createComponent({el: $('#nakkitype-info-descriptions', rootel), collection: nakkiInfos});
		nakkiTable.createComponent({el:$('#nakki-table',rootel), collection: nakit }, vent);
		assignForm.createComponent({el:$('#assign',rootel), model: options.currentUser()}, vent, party);

		auxJobs.createSelector({el: $('#auxJob-selector', rootel), model: party, collection: auxUsers}, vent);
		auxJobs.createCleanersList({el: $('#auxJob-cleaners', rootel), collection: auxUsers}, vent);
		auxJobs.createConstructorsList({el: $('#auxJob-constructors', rootel), collection: auxUsers}, vent);
	    });

	    nakit.fetch({success: _ready, error: _error});
	    nakkiInfos.fetch({success: _ready, error: _error});
	    auxUsers.fetch({success: _ready, error: _error});
	}, error: _error});
    };

    return {
	initialize:initialize,
	detach: function() {
	    vent.trigger('detach');
	}
    };
});
