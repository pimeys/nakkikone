// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
    paths: {
        'jquery': 'libs/jquery-1.7.2',
        'underscore': 'libs/underscore', // AMD support
        'backbone': 'libs/backbone' // AMD support
	//'text':'libs/text'
	//'models': ''
    }
});

require(['app'],function(app){
    app.initialize();
});