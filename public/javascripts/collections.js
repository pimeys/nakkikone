define(['backbone','underscore','models'],function(bb, _, models){

    var Users = bb.Collection.extend({
	model: models.person,
	url: '/mock-data/users.json'
    });

    var Parties = bb.Collection.extend({
	initialize: function() {
	    this.on("add",this.notify);
	},

	model: models.party,
	
	url: '/mock-data/parties.json',

	notify: function(){
	    alert("new party created!");
	}
    });

    var Nakit = bb.Collection.extend({
	model: models.nakki,
	url: '/mock-data/nakit.json'
    })

    return {Users:Users,
	    Parties:Parties,
	    Nakit:Nakit};
});