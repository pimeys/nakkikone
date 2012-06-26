define(['jquery','backbone','collections'], function($,bb,collections) {
    
    var users = new collections.Users();

    var initialize = function(){
	users.fetch({
	    success: function(co,resp) {
		alert(JSON.stringify(co) + resp);
	    },
	    error: function(co,resp) {
		alert("whaat... "+ JSON.stringify(resp));
	    }
	});
    };

    return {initialize: initialize};
});