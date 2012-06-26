define(['jquery','backbone'],function($,bb){

    var Person = bb.Model.extend({
	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567"
	}
    });

    var Nakki = bb.Model.extend({
	defaults: {
	    description: "Bile kuvaus tarvitaan",
	    nakit: [] //List or collection of nakkis??
	}
    });

    var Party = bb.Model.extend({
	defaults: {
	    type: undefined, //string?
	    start: undefined, //date or slot ?
	    assign: undefined //Person
	}
    });

    return {person:Person, 
	    nakki:Nakki, 
	    party:Party};
});