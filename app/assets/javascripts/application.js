// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
    paths: {
        underscore: "underscore/underscore",
        backbone: "backbone/backbone",
	moment: "moment/min/moment.min",
	languages: "moment/min/langs",
	
	handlebars : "require-handlebars-plugin/Handlebars",
        hbs : "require-handlebars-plugin/hbs",
        i18nprecompile : "require-handlebars-plugin/hbs/i18nprecompile",
        json2 : "require-handlebars-plugin/hbs/json2",

	bootstrapDatepicker: "bootstrap-datepicker/js/bootstrap-datepicker",
	bootstrapTimepicker: "bootstrap-timepicker/js/bootstrap-timepicker",
	bs: "libs/bootstrap.min"
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
        },

	'bootstrapDatepicker': {
	    deps: ['jquery'],
	    exports: 'bootstrapDatepicker'
	},

	'bootstrapTimepicker': {
	    deps: ['jquery'],
	    exports: 'bootstrapTimepicker'
	},

	'bs' : {
	    deps: ['jquery'],
	    exports: 'bs'
	},
	
	'languages' : ['moment']
    },

    hbs: {
	templateExtension: "hbs",
	disableI18n: true,
	helperPathCallback: function(name) {return 'templates/' + name;}
    }
});

require(['app', 'jquery'],function(app, $){
    app.initialize({el: $('#content')});
});
