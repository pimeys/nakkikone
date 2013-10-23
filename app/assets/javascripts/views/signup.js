"use strict";
define([
    'jquery',
    'underscore',
    'backbone',
    'vent',
    'components/notification-area',
    'components/submit-form',
    'hbs!templates/outer-template'
], function($, _, bb, vent, noficationArea, signupForm, outer_template) {

    var initialize = function(options){
	var rootDiv = options.el.html(outer_template);
	
	signupForm.createComponent({el: $('#signup', rootDiv)}, vent);
	noficationArea.createComponent({el: $('#signup-alert-area', rootDiv)}, vent);
    };

    return {initialize:initialize};
});
