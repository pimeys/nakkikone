define('templates/nakki_row', ['handlebars','underscore'], function ( Handlebars, _) {
    
    function parseTime(slot, startTime) {
	var time = new Date(startTime);
	time.setHours(time.getHours() + slot);
	time.setMinutes(0);
	time.setSeconds(0);
	return time.toLocaleTimeString()
    }

    function nakki_row(startTime){
	
	var sortedByType = _.sortBy(this, 'type');
	var slotOrder = sortedByType[0].slot;

	var row = "<td>" + parseTime(slotOrder, startTime) + "</td>";
	_.each(sortedByType, function(nakki) {
	    row += "<td>";
	    if (!!nakki.assign) { 
	    	row += nakki.assign;
	    } else {
	    	row += '<input type="checkbox" name="selection" value="' + nakki.id + '"/> Take'; 
	    }
	    row += "</td>";
	});
	return new Handlebars.SafeString(row);
    };

    Handlebars.registerHelper('nakki_row', nakki_row);
    return nakki_row;
});
