"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'bs',
    'hbs!templates/nakkitype-info-descriptions',
], function($, _, bb, bs, descriptions_template) {

    var DescriptionView = bb.View.extend({
	initialize: function() {
	    _.bindAll(this);
	    this.listenTo(this.collection, 'reset', this.render);
	    this.render();
	},

	render: function() {
	    this.$el.html(descriptions_template({
		infos: this.collection.toJSON()
	    }));
	    return this;
	}
    });

    return {
	createComponent: function(options) {
	    return new DescriptionView(options);
	}
    };
});
