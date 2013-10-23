"use strict";
define([
    'backbone',
    'underscore'
], function(bb, _) {

    var vent = {};
    _.extend(vent, bb.Events);

    return {
	trigger: function(event, options) {
	    vent.trigger(event, options);
	},

	on: function(event, callback) {
	    vent.on(event, callback);
	},

	itself: function() {
	    return vent;
	}
    };
});
