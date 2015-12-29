"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!templates/alert'
], function($, _, bb, alertTmpl) {

    var vent; //TODO remove

    var NotificationArea = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    vent.on('detach', this.remove);
	    this.listenTo(vent, 'alert', this.showAlert);
	    this.listenTo(vent, 'notify', this.showNotify);
	    this.render();
	},

	showAlert: function(message) {
	    message.type = 'error';
	    this.appendAlert(message);
	},

	showNotify: function(message) {
	    message.type = 'success';
	    this.appendAlert(message);
	},

	appendAlert: function(message) {
	    if (message.type == 'success') {
	        this.$el.append(alertTmpl({message: message}));
		if (this.$el.children().length > 0){
		    var self = this;
		    setTimeout(function() {
			  self.$el.find(":first-child").remove();
		    }, 15000);
		}
	     }
	     else if (message.type == 'error'){
		 this.$el.prepend(alertTmpl({message: message}));
	     }
	}

    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent; //TODO workaround to get partial backwards compataility
	    return new NotificationArea(options);
	}
    };
});
