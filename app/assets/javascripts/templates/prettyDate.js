define('templates/prettyDate', ['handlebars'], function (Handlebars) {
    
    function prettyDate(dateJSON){
	var date = new Date(dateJSON)
	return new Handlebars.SafeString(date.toLocaleDateString());
    };

    Handlebars.registerHelper('prettyDate', prettyDate);
    return prettyDate;
});
