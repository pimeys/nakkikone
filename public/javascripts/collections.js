define(['backbone','underscore','models'],function(bb, _, models){

    var Users = bb.Collection.extend({
	partyId: 'noparties',

	model: models.person,

	url: function() {
	    return '/mock-data/' + this.partyId + '/parcipitants';
	}
    });

    var Parties = bb.Collection.extend({
	model: models.party,
	
	url: '/mock-data/parties.json',
    });

    var Nakit = bb.Collection.extend({
	partyId: 'noparties',

	model: models.nakki,

	url: function() {
	    return '/mock-data/' + this.partyId + '/nakit';
	}
    })

    return {Users:Users,
	    Parties:Parties,
	    Nakit:Nakit};
});