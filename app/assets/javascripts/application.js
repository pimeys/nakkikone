// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
//    baseUrl: './assets/',

    paths: {
	text: 'libs/text',
        jquery: 'libs/jquery-1.7.2',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
	 
	handlebars : "libs/Handlebars",
        hbs : 'libs/hbs',
        i18nprecompile : "libs/hbs/i18nprecompile",
        json2 : "libs/hbs/json2"
    },

    shim: {
    	'underscore': {
	    exports: '_'
	},

        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        }
    },

    hbs: {
	templateExtension: "hbs",
	disableI18n: true,
	helperPathCallback: function(name) {return 'templates/' + name;}
    }
});

require(['app','templates/nakki_row'],function(app){
    app.initialize();
});
