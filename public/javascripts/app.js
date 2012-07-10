define(['jquery','backbone','models','collections','views/admin'], function($,bb,models,collections,admin) {
    
    var initialize = function(){
	admin.initialize();
    };

    return {initialize: initialize};
});