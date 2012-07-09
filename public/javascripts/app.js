define(['jquery','backbone','models','collections','views/admin'], function($,bb,models,collections,admin) {
    
    var initialize = function(){
//	new admin.Assign_Form({el:$('#assign'), model:new models.person()});
	new admin.Selector({el:$('#partyselector')});
	new admin.Party_Viewer({el:$('#content'), model:new models.party({title:'bileet1'})});
    };

    return {initialize: initialize};
});