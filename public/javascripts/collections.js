define(['jquery','backbone','models'],function($, bb, models){

    var Users = bb.Collection.extend({
	model: models.person,
	url: '/mock-data/users.json'
    });

    var Parties = bb.Collection.extend({
	model: models.party,
	url: '/mock-data/parties.json'
    });

    var Nakit = bb.Collection.extend({
	model: models.nakki,
	url: '/mock-data/nakit.json'
    })

    return {Users:Users,
	    Parties:Parties,
	    Nakit:Nakit};
});