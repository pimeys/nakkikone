define('templates/helpers/prettyTime', ['hbs/handlebars'], function (Handlebars) {
    
    function prettyTime(dateJSON){
	var date = new Date(dateJSON);
	return new Handlebars.SafeString(date.toTimeString().substring(0,5));
    }

    Handlebars.registerHelper('prettyTime', prettyTime);
    return prettyTime;
});
