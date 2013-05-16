define('templates/nakki_row', [
    'handlebars',
    'underscore',
    'templates/prettyTimeFromSlot'
], function ( Handlebars, _, timeFormatter) {
    
    function nakki_row(startTime, titles){
	var missing = _.map(_.difference(titles, _.pluck(this, 'type')), 
			    function(el) {
				return { type:el };
			    });

	var sortedByType = _.sortBy(_.union(this, missing), 'type');

	var row = "<td>" + timeFormatter(this[0].slot, startTime) + "</td>";
	_.each(sortedByType, function(nakki) {
	    row += "<td>";
	    if (!!nakki.assign) {
	    	row += '<span class="reserved">'+ nakki.assign +'</span>';
	    } else if (!!nakki.id) {
	    	row += '<input type="checkbox" name="selection" value="' + nakki.id + '"/><p class="take">Take</p>'; 
	    } else {
		row += '<span class="disabled">Disabled<span>';
	    }
	    row += "</td>";
	});
	return new Handlebars.SafeString(row);
    };

    Handlebars.registerHelper('nakki_row', nakki_row);
    return nakki_row;
});
