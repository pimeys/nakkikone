define([
    'backbone',
    'underscore',
    'models',
    'moment'
],function(bb, _, models, moment){

    var PartyResources = bb.Collection.extend({
	_party: undefined,
	partyId: 'noparties',
	resource: 'no-resource',
	
	partyDate: function() {
	    return this._party.get('date');
	},

	url: function() {
	    return '/parties/' + this.partyId + '/' + this.resource;
	}
    });

    var Users = PartyResources.extend({
	model: models.Person,
	resource: 'parcipitants'
    });

    var AuxUser = models.Person.extend({
	resource: 'aux_parcipitants'
    });

    var AuxUsers = PartyResources.extend({
	model: AuxUser,
	resource: 'aux_parcipitants'
    });

    var Parties = bb.Collection.extend({
	model: models.Party,
	url: '/parties',

	onlyFutureParties: function() {
	    return new Parties(this.filter(function(party) {
		return moment().subtract('days', 1).isBefore(party.get('date'));
	    }));
	},

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

    var NakkiTypeInfos = bb.Collection.extend({
	model: models.NakkitypeInfo,
	url: '/nakkitype_infos',

	toJSONWithClientID: function() {
	    return this.map(function(model){ return model.toJSONWithClientID(); });
	}
    });

    return {
	Users: Users,
	AuxUsers: AuxUsers,
	Parties: Parties,
	Nakit: Nakit,
	Nakkitypes: NakkiTypes,
	NakkitypeInfos: NakkiTypeInfos
    };
});
