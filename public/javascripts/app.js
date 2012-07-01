define(['jquery','backbone','models','collections','views/admin'], function($,bb,models,collections,admin) {
    
    var initialize = function(){
	new admin.Selector({el:$('#partyselector')});
	new admin.Parcipitants({el:$('#parcipitants')});
	new admin.Assign_Form({el:$('#assign'), model:new models.person()});
    };

    return {initialize: initialize};
});