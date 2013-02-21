define(['jquery','backbone'],function($,bb){

    var Person = bb.Model.extend({
	partyId: 'noparties',

	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567"
	},

	urlRoot: function() {
	     return 'parties/' + this.partyId + '/parcipitants'
	}
    });

    var Nakki = bb.Model.extend({
	defaults: {
	    assign: null,
	    type: null,
	    slot: null
	}
    });

    var NakkiType = bb.Model.extend({
	defaults: {
	    type: "Name of Nakki",
	    start: 0, 
	    end: 0
	},

	//TODO remove after UI refactoring
	toJSONWithClientID: function() {
	    data = this.toJSON();
	    data.cid = this.cid;
	    return data;
	}
    });

    var Party = bb.Model.extend({
	defaults: {
	    title: "Party title",
	    description: "Osallistumalla nakkiin pääset maksutta bileisiin",
	    date: "1/1/2012"
	}
    });

    return {
	Person: Person, 
	Nakkitype: NakkiType,
	Nakki: Nakki,
	Party: Party
    };
});
