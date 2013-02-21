define(['backbone','underscore','models'],function(bb, _, models){

    var Users = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Person,

	url: function() {
	    return '/parties/' + this.partyId + '/parcipitants';
	}
    });

    var Parties = bb.Collection.extend({
	model: models.Party,
	
	url: '/parties',
    });

    var Nakit = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Nakki,

	url: function() {
	    return '/parties/' + this.partyId + '/nakit';
	}
    });

    var NakkiTypes = bb.Collection.extend({
	partyId: 'noparties',

	model: models.Nakkitype,

	url: function() {
	    return '/parties/' + this.partyId + '/nakkitypes';
	},
	
	//TODO remove when UI refactoring has been done
	toJSONWithClientID: function() {
	    return this.map(function(model){ return model.toJSONWithClientID(); });
	}
    });

    return {
	Users: Users,
	Parties: Parties,
	Nakit: Nakit,
	Nakkitypes: NakkiTypes 
    };
});
