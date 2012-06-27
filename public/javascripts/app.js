define(['jquery','backbone','collections','views/admin'], function($,bb,collections,admin) {
    
    var initialize = function(){
	new admin.Selector({el:$("#partyselector")});
	new admin.Parcipitants({el:$("#parcipitants")});
    };

    return {initialize: initialize};
});