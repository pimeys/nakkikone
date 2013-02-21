define('templates/nakki_row', ['handlebars','underscore'], function ( Handlebars, _) {
    
    function nakki_row(){
	
	var sortedByType = _.sortBy(this,'type');
	var slotName = sortedByType[0].slot;

	var row = "<td>" + slotName + "</td>";
	_.each(sortedByType, function(nakki) {
	    row += "<td>";
	    if (!!nakki.assign) { 
	    	row += nakki.assign;
	    } else {
	    	row += '<input type="checkbox" name="selection" value="' + nakki.id + '"/>Take'; 
	    }
	    row += "</td>";
	});
	return new Handlebars.SafeString(row);
    };

    Handlebars.registerHelper('nakki_row', nakki_row);
    return nakki_row;
});
