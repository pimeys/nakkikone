define(['jquery','backbone','collections','views/admin'], function($,bb,collections,admin) {
    
    var initialize = function(){
	new admin.View({el:$("#content")});
    };

    return {initialize: initialize};
});