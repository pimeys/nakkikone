define('templates/prettyTime', ['handlebars'], function (Handlebars) {
    
    function prettyTime(dateJSON){
	var date = new Date(dateJSON);
	return new Handlebars.SafeString(date.toTimeString());
    };

    Handlebars.registerHelper('prettyTime', prettyTime);
    return prettyTime;
});
