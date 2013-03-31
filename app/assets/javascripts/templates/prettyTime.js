define('templates/prettyTime', ['handlebars'], function (Handlebars) {
    
    function prettyTime(dateJSON){
	var date = new Date(dateJSON);
	return new Handlebars.SafeString(date.getUTCHours()+":"+date.getUTCMinutes());
    };

    Handlebars.registerHelper('prettyTime', prettyTime);
    return prettyTime;
});
