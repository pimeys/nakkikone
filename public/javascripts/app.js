define(['jquery','backbone','collections'], function($,bb,collections) {
    
    users = new collections.Users();

    parties = new collections.Parties();

    nakit = new collections.Nakit();

    var dev_catch = {
	success: function(co,resp) {
	    alert(JSON.stringify(co) + resp);
	},
	error: function(co,resp) {
	    alert("whaat... "+ JSON.stringify(resp));
	}};

    var initialize = function(){
	nakit.fetch(dev_catch);
	parties.fetch(dev_catch);
	users.fetch(dev_catch);
    };

    return {initialize: initialize};
});