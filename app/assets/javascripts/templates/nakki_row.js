define('templates/nakki_row', ['handlebars','underscore'], function ( Handlebars, _) {
    
    function parseTime(slot, startTime) {
	var time = new Date(startTime);
	time.setHours(time.getHours() + slot);
	time.setMinutes(0);
	time.setSeconds(0);
	return time.toLocaleTimeString()
    }

    function nakki_row(startTime, titles){
	var missing = _.map(_.difference(titles, _.pluck(this, 'type')), 
			  function(el) {
			      return { type:el };
			  });

	var sortedByType = _.sortBy(_.union(this, missing), 'type');

	var row = "<td>" + parseTime(this[0].slot, startTime) + "</td>";
	_.each(sortedByType, function(nakki) {
	    row += "<td>";
	    if (!!nakki.assign) {
	    	row += nakki.assign;
	    } else if (!!nakki.id) {
	    	row += '<input type="checkbox" name="selection" value="' + nakki.id + '"/> Take'; 
	    } else {
		row += '<span class="disabled">Not In Use<span>';
	    }
	    row += "</td>";
	});
	return new Handlebars.SafeString(row);
    };

    Handlebars.registerHelper('nakki_row', nakki_row);
    return nakki_row;
});
