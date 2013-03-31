define('templates/prettyTimeFromSlot', ['handlebars'], function (Handlebars) {
    
    function prettyTimeFromSlot(slot, dateJSON){
	var date = new Date(dateJSON);
	date.setHours(date.getHours() + slot);
	return new Handlebars.SafeString(date.toTimeString());
    };

    Handlebars.registerHelper('prettyTimeFromSlot', prettyTimeFromSlot);
    return prettyTimeFromSlot;
});
