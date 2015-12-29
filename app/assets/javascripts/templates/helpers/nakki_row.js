define('templates/helpers/nakki_row', [
    'hbs/handlebars',
    'underscore',
    'templates/helpers/prettyTimeFromSlot'
], function ( Handlebars, _, timeFormatter) {
    function nakki_row(startTime, nakkiCellPositions) {
	var rowTime = timeFormatter(_.first(this).slot, startTime);

	var nakkiToNakkitypeMap = _.reduce(this, function(m, v) {
	    m[String(v.nakkitype_id)] = v;
	    return m;
	}, {});
	
	var slotCells = _.map(nakkiCellPositions, function(nakkitype_id) {
	    var nakki = nakkiToNakkitypeMap[String(nakkitype_id)];
	    if (!nakki || nakki.assign === "Disabled") {
		return disabledSlot();
	    } else if (nakki.assign) {
		return reservedSlot(nakki.assign);
	    } else {
 		return freeSlot(nakki.id);
	    }
	});

	var row = "<td>" + [rowTime].concat(slotCells).join("</td><td>") + "</td>";
	return new Handlebars.SafeString(row);
    }

    Handlebars.registerHelper('nakki_row', nakki_row);
    return nakki_row;

    function disabledSlot() {
	return '<span class="disabled">Disabled<span>';
    }
    
    function reservedSlot(text) {
	return '<span class="reserved">'+ text +'</span>';
    }

    function freeSlot(id) {
	return '<input type="checkbox" name="selection" value="' + id + '"/><span class="take">Take</span>';
    }
});
