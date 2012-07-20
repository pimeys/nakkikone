define([
    'jquery',
    'backbone',
    'models',
    'collections',
    'views/admin',
    'views/public'], function($,bb,models,collections,admin, pub) {

    var initialize = function(){
	admin.initialize({el:$('#admin')});
	pub.initialize({el:$('#public'), partyId:'latest'});
    };

    return {initialize: initialize};
});