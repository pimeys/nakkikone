define('templates/helpers/prettyDate', [
    'hbs/handlebars',
    'moment',
    'languages'
], function (Handlebars, moment) {

    function prettyDate(dateJSON){
	var date = moment(dateJSON);
	date.lang('fi'); //todo place somewhere else
	return new Handlebars.SafeString(date.format("DD.MM.YYYY"));
    };

    Handlebars.registerHelper('prettyDate', prettyDate);
    return prettyDate;
});
