define(['jquery','backbone'],function($,bb){

    var Person = bb.Model.extend({
	partyId: 'noperties',

	idAttribute: "email",

	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567"
	},

	urlRoot: function(){
	    return 'mock-data/' + this.partyId + '/parciptants';
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
	idAttribute: 'type',

	defaults: {
	    type: 'nakin tyyppi',
	    start: 'alkaa milloin?', 
	    end: 'loppuu koska?'
	}
    });

    var Party = bb.Model.extend({
	idAttribute: 'title',

	defaults: {
	    title: "bileennimet",
	    description: "Bile kuvaus tarvitaan",
	    date: "someday"
	}
    });

    return {
	Person: Person, 
	Nakkitype: NakkiType,
	Nakki: Nakki,
	Party: Party
    };
});