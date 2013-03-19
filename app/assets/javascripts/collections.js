define(['backbone','underscore','models'],function(bb, _, models){

    var PartyResources = bb.Collection.extend({
	partyId: 'noparties',
	resource: 'no-resource',
	url: function() {
	    return '/parties/' + this.partyId + '/' + this.resource;
	}
    });

    var Users = PartyResources.extend({
	model: models.Person,
	resource: 'parcipitants'
    });

    var AuxUsers = Users.extend({
	resource: 'aux_parcipitants'
    });

    var Parties = bb.Collection.extend({
	model: models.Party,
	url: '/parties',

	//TODO remove when UI refactoring has been done
	toJSONWithClientID: function() {
	    return this.map(function(model){ return model.toJSONWithClientID(); });
	}
    });

    var Nakit = PartyResources.extend({
	model: models.Nakki,
	resource: 'nakit'
    });

    var NakkiTypes = PartyResources.extend({
	model: models.Nakkitype,
	resource: 'nakkitypes',
	
	//TODO remove when UI refactoring has been done
	toJSONWithClientID: function() {
	    return this.map(function(model){ return model.toJSONWithClientID(); });
	}
    });

    return {
	Users: Users,
	AuxUsers: AuxUsers,
	Parties: Parties,
	Nakit: Nakit,
	Nakkitypes: NakkiTypes 
    };
});
