"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'collections',
    'models',
    'bs',
    'hbs!templates/nakki-table'
], function($, _, bb, collections, models, bs, nakki_table) {

    //TODO remove...
    var vent;

    var Nakki_Table = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.collection, 'reset', this.render);
	    vent.on('assignPerson', this.save);
	    vent.on('detach', this.remove);
	    this.render();
	},

	parseTitles: function(data) {
	    return _.uniq(_.pluck(data, 'type')).sort();
	},

	parseNakit: function(data) {
	    return _.toArray(
		_.sortBy(
		    _.sortBy(
			_.groupBy(data, 'slot'), 'type'), 
		    function(item) { 
			return parseInt(item[0].slot, 10);
		    }));
	},

	render: function(){
	    var collectionJSON = this.collection.toJSON();
	    this.$el.html(nakki_table({
		titles: this.parseTitles(collectionJSON),
		nakit: this.parseNakit(collectionJSON),
		startTime: this.collection.partyDate().toJSON()
	    }));
	    return this;
	},

	save: function(assignedPerson){
	    var ids = _.map(this.$('form').serializeArray(), function(el) {
		return el.value;
	    });
	    if (ids.length == 0) {
		return false;
	    }
	    this.returned = _.after(ids.length, this.render); //todo safe?
	    var self = this;
	    _.each(ids, function(current){
		var model = self.collection.get(current);
		model.save({assign: assignedPerson.id}, 
			   { 
			       wait: true, 
			       success: self.notify, 
			       error: self.alert
			   });
	    });
	    return false;
	},

	notify: function(model, options) {
	    this.returned();
	    var message = {
		title: "Success!",
		text: "Your " + model.get('type') + " has been succesfully registered for you."
	    };
	    vent.trigger('notify', message);
	},

	alert: function(model, xhr, options) {
	    this.returned();
	    var message = {
		title: "Failure (Something went wrong in server)!",
		text: "Your assignment request failed because: " + xhr.responseText
	    };
	    vent.trigger('alert', message);
	}
    });

    return {
	createComponent: function(options, _vent) {
	    vent = _vent; //TODO workaround hack to get partial backwards compatability...
	    return new Nakki_Table(options);
	}
    };
});
