define('templates/helpers/isSelected',[
    'hbs/handlebars',
    'underscore'
], function ( Handlebars, _) {
    function isSelected(a, b) {
	if (a === b) {
	    return new Handlebars.SafeString("selected='true'");
	} else {
	    return "";
	}
    };

    Handlebars.registerHelper('isSelected', isSelected);
    return isSelected;
});
