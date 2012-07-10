define(['jquery','backbone'],function($,bb){

    var Person = bb.Model.extend({
	idAttribute: "email",

	defaults: {
	    name: "nakkilainen",
	    email: "nakki@email.com",
	    number: "0401234567"
	},
	
	save: function(data){
	    alert(data.name + "\n" + data.email + "\n" +data.number);
	}
    });

    var Nakki = bb.Model.extend({
	defaults: {
	    type: 'geneerinen nakki', //string?
	    start: 'milloin?', //date or slot ?
	    assign: 'kuka?' //Person id?
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

    return {person:Person, 
	    nakki:Nakki, 
	    party:Party};
});