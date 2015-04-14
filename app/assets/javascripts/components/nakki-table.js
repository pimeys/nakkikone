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
	    this.listenTo(vent, 'assignPerson', this.save);
	    this.listenTo(vent, 'detach', this.remove);
	    this.render();
	},

	groupTitlesToNakkitypes: function(data) {
	    return _.chain(data)
		.groupBy('nakkitype_id')
		.map(_.first)
		.pluck('type')
		.value();
	},

	groupNakitToSlots: function(data) {
	    return _.chain(data)
		.groupBy('slot')
		.sortBy('nakkitype_id')
		.value();
	},

	nakkiCellPositions: function(data) {
	    return _.chain(data)
		.groupBy('nakkitype_id')
		.map(_.first)
		.pluck('nakkitype_id')
		.value();
	},

	render: function() {
	    var data = this.collection.toJSON();
	    this.$el.html(nakki_table({
		titles: this.groupTitlesToNakkitypes(data),
		nakit: this.groupNakitToSlots(data),
		nakkiCellPositions: this.nakkiCellPositions(data),
		startTime: this.collection.partyDate().toJSON()
	    }));
	    return this;
	},

	save: function(assignedPerson) {
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
