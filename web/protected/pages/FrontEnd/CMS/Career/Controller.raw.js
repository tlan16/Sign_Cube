/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	htmlIds: []
	,init: function(jQueryFormSelector) {
		var tmp = {};
		tmp.me = this;
		tmp.container = $('mainContent').down('.container');
		return tmp.me;
	}
});