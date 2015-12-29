define('templates/helpers/prettyTimeFromSlot', [
    'hbs/handlebars',
    'templates/helpers/prettyTime'
], function (Handlebars, timeFormatter) {
    
    function prettyTimeFromSlot(slot, dateJSON){
	var date = new Date(dateJSON);
	date.setHours(date.getHours() + slot);
	return timeFormatter(date.toJSON());
    };

    Handlebars.registerHelper('prettyTimeFromSlot', prettyTimeFromSlot);
    return prettyTimeFromSlot;
});
