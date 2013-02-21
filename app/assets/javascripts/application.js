// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
    paths: {
        'jquery': 'libs/jquery-1.7.2',
        'underscore': 'libs/underscore', // AMD support
        'backbone': 'libs/backbone' // AMD support
    },

    hbs: {
	disableI18n: true,
	helperPathCallback: function(name) {return 'templates/' + name;}
    }
});

require(['app','templates/nakki_row'],function(app){
    app.initialize();
});
