define(['jquery','backbone'],function($,bb){

    var Person = bb.Model.extend({
	idAttribute: "email",

	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567"
	}
    });

    var Nakki = bb.Model.extend({
	defaults: {
	    type: undefined, //string?
	    start: undefined, //date or slot ?
	    assign: undefined //Person id?
	}
    });

    var Party = bb.Model.extend({
	idAttribute: "title",

	defaults: {
	    title: "bileennimet",
	    description: "Bile kuvaus tarvitaan",
	    nakit: [] //List or collection of nakkis??
	}
    });

    return {person:Person, 
	    nakki:Nakki, 
	    party:Party};
});