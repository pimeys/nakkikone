define([
    'jquery',
    'backbone',
    'moment'
], function($, bb, moment) {

    var PartyResource = bb.Model.extend({
	partyId: 'noparties',
	resource: 'noresource',
	urlRoot: function() {
	    return 'parties/' + this.partyId + '/' + this.resource;
	}
    });

    var Person = PartyResource.extend({
	resource: 'parcipitants',

	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567",
	    role: "user"
	}
    });

    var Nakki = bb.Model.extend({
	defaults: {
	    assign: null,
	    type: null,
	    slot: null
	},

	parse: function(resp, options) {
	    resp.assign = resp.assign && resp.assign.name;
	    return resp;
	},

	validate: function(attr, options) {
	    if (!attr['slot'] && attr['slot'] != 0) {
		return "Nakki slot is undefined";
	    }
	    if (!attr['type']) {
		return "Nakki type is undefined";
	    }
	    return null;
	}
    });

    var NakkiType = bb.Model.extend({
	defaults: {
	    type: null,
	    start: 0,
	    end: 5
	},

	//TODO remove after UI refactoring
	toJSONWithClientID: function() {
	    data = this.toJSON();
	    data.cid = this.cid;
	    return data;
	},

	validate: function(attr, options) {
	    if ((!attr['start'] && attr['start'] != 0) || !attr['end']) {
		return "Range for nakkitype is invalid.";
	    };
	    if (attr['start'] >= attr['end']) {
		return "Range start can't be after ending.";
	    };
	}
    });

    var Party = bb.Model.extend({
	defaults: {
	    title: "Party Title",
	    description: "Osallistumalla nakkiin pääset maksutta bileisiin.",
	    date: moment().add('days', 14).hours(22).minutes(0).toDate(),
	    infoDate: moment().add('days', 14).hours(21).minutes(0).toDate()
	},

	//TODO remove after UI refactoring
	toJSONWithClientID: function() {
	    data = this.toJSON();
	    data.cid = this.cid;
	    return data;
	},

	parse: function(response, options) {
	    response.date = new Date(response.date);
	    response.infoDate = new Date(response.infoDate);
	    return response;
	},

	validate: function(attr, options) {
	    if (!attr['title']) {
		return "party title is missing";
	    };
	    if (!attr['date'] || !attr['infoDate']) {
		return "Important dates are missing";
	    }
	    if (attr['date'] < attr['infoDate']) {
		return "Info time can't be after party has started";
	    }
	}
    });

    return {
	Person: Person, 
	Nakkitype: NakkiType,
	Nakki: Nakki,
	Party: Party,
	PartyResource: PartyResource
    };
});
