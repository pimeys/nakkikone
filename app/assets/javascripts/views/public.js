"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'components/party-viewer',
    'components/nakki-table',
    'components/notification-area',
    'components/aux-jobs',
    'bs',
    'hbs!templates/public-screen'
], function($, _, bb, collections, models, partyViewer, nakkiTable, notificationArea, auxJobs, bs, publicScreen) {

    var vent = {};
    _.extend(vent, bb.Events);

    var party = new models.Party();
    var nakit = new collections.Nakit();

    var Assign_Form = bb.View.extend({
	events: {
	    'submit': 'assign',
	    'click .cancel-all': 'unAssignAll'
	},

	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	},

	assign: function() {
	    vent.trigger('assignPerson', this.model);
	    return false;
	},

	unAssignAll: function() {
	    $.ajax({
		url: '/parties/' + party.id + '/cancel_all',
		dataType: 'json',
		type: 'DELETE'
	    }).success(function(){
		nakit.fetch({
		    success: function() {
			var message = {
			    title: "Successfully Cancelled Reservations"
			};
			vent.trigger('notify', message);
		    }
		});
	    });
	}
    });

    //todo move to separate error-handling-module
    var _error = function(col, error) {
    };

    var AuxUsers = collections.AuxUsers.extend({
	resource: 'aux_parcipitants_names'
    });
    var auxUsers = new AuxUsers();

    var initialize = function(options) {
	var rootel = options.el;
	rootel.html(publicScreen);
	vent.off(); //hard reset!

	notificationArea.createComponent({el: $('#alert-area', rootel)}, vent);

	//todo hide to model
	var partyFindUrl = '/parties/';
	if (options.partyId || options.partyId == 0) {
	    partyFindUrl += options.partyId;
	} else if (options.partyTitle) {
	    partyFindUrl += options.partyTitle + '?by_title=true';
	}

	party.fetch({url:partyFindUrl, success:function(){
	    nakit._party = party;
	    nakit.partyId = party.get('id');
	    auxUsers.partyId = party.get('id');

	    var _ready = _.after(2, function() {
		partyViewer.createComponent({el: $('#party-description',rootel), model: party}, vent); 
		nakkiTable.createComponent({el:$('#nakki-table',rootel), collection: nakit}, vent);
		new Assign_Form({el:$('#assign',rootel), model: options.currentUser()});

		auxJobs.createSelector({el: $('#auxJob-selector', rootel), model: party}, vent);
		auxJobs.createCleanersList({el: $('#auxJob-cleaners', rootel), collection: auxUsers}, vent);
		auxJobs.createConstructorsList({el: $('#auxJob-constructors', rootel), collection: auxUsers}, vent);
	    });

	    nakit.fetch({success: _ready, error: _error});
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
