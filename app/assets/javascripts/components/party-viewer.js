"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!templates/party-description'
], function($, _, bb, party_description) {

    var vent;

    var Party_Viewer = bb.View.extend({
	initialize: function(){
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	    this.render();
	},

	render: function(){
	    this.$el.html(party_description({party: this.model.toJSON(), editable: false}));
	    return this;
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent; //TODO remove, partial backward compatability
	    return new Party_Viewer(options);
	}
    };
});
