// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
    paths: {
        'jquery': 'libs/jquery-1.7.2',
        'underscore': 'libs/underscore', // AMD support
        'backbone': 'libs/backbone' // AMD support
    }
});

require(['backbone','app'],function(Backbone,app){
    //Adding session authentication token to each request.
    Backbone.old_sync = Backbone.sync
    Backbone.sync = function(method, model, options) {
	var new_options =  _.extend({
            beforeSend: function(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
            }
    }, options)
	Backbone.old_sync(method, model, new_options);
    };

    app.initialize();
});
