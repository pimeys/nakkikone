"use strict";
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, bb) {

    var vent;

    var Assign_Form = bb.View.extend({
	events: {
	    'click .assign': 'assign',
	    'click .cancel-all': 'unAssignAll'
	},

	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(vent, 'detach', this.remove);
	},

	assign: function() {
	    vent.trigger('assignPerson', this.model);
	    return false;
	},

	unAssignAll: function() {
	    $.ajax({
		url: '/parties/' + this.party.id + '/cancel_all', //TODO how...
		dataType: 'json',
		type: 'DELETE'
	    }).success(function() {
		var message = {
		    title: "Successfully Cancelled Reservations"
		};
		vent.trigger('notify', message);
		vent.trigger('re-fetch-collections');
	    });
	    return false;
	}
    });

    return {
	createComponent: function(options, _vent, party) {
	    vent = _vent;
	    var form = new Assign_Form(options);
	    form.party = party;
	    return form;
	}
    };
});
