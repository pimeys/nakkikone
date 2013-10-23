"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'components/notification-area',
    'components/edit-details-form',
    'hbs!templates/edit-own-details'
], function($, _, bb, noficationArea, editForm, edit_own_details) {

    var internalVent = {};
    _.extend(internalVent, bb.Events);

    var initialize = function(options) {
	var rootDiv = options.el.html(edit_own_details);
	editForm.createComponent({el: $('#edit-details', rootDiv), model: options.currentUser()}, internalVent);
	noficationArea.createComponent({el: $('#edit-details-alert-area', rootDiv)}, internalVent);
    };
    
    return {initialize:initialize};
});
