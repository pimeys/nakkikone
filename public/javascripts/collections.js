define(['backbone','underscore','models'],function(bb, _, models){

    var Users = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Person,

	url: function() {
	    return '/mock-data/' + this.partyId + '/parcipitants';
	}
    });

    var Parties = bb.Collection.extend({
	model: models.Party,
	
	url: '/mock-data/parties.json',
    });

    var Nakit = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Nakki,

	url: function() {
	    return '/mock-data/' + this.partyId + '/nakit';
	}
    });

    var NakkiTypes = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Nakkitype,

	url: function() {
	    return '/mock-data/' + this.partyId + '/nakkitypes';
	}
    });

    return {
	Users: Users,
	Parties: Parties,
	Nakit: Nakit,
	Nakkitypes: NakkiTypes 
    };
});