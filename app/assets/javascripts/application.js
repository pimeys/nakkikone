// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
require.config({
    paths: {
        underscore: "underscore/underscore",
        backbone: "backbone/backbone",
	moment: "moment/min/moment.min",
	languages: "moment/min/langs",

	handlebars : "require-handlebars-plugin/hbs",
        hbs : "require-handlebars-plugin/hbs",
        i18nprecompile : "require-handlebars-plugin/hbs/i18nprecompile",
        json2 : "require-handlebars-plugin/hbs/json2",

	bootstrapDatepicker: "bootstrap-datepicker/js/bootstrap-datepicker",
	bootstrapTimepicker: "bootstrap-timepicker/js/bootstrap-timepicker",
	bs: "libs/bootstrap.min",

	bootstrapWysivyg: "bootstrap-wysihtml5/dist/bootstrap-wysihtml5-0.0.2",
	wysihtml5: "wysihtml5/dist/wysihtml5-0.3.0"
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

	'languages' : ['moment'],

	'bootstrapWysivyg' : {
	    deps: ['wysihtml5'],
	    exports: 'bootstrapWysivyg'
	}
    }
});

require(['app', 'jquery'],function(app, $){
    app.initialize({el: $('#content')});
});
