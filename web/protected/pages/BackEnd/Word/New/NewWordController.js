/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_item: {} //the item entity that we are dealing with
	,_HtmlIds: {}
	,_setHtmlIds: function(mainContainerId) {
		var tmp = {};
		tmp.me = this;
		tmp.me._HtmlIds.mainContainer = mainContainerId;
		return tmp.me;
	}
	/**
	 * Showing the item
	 */
	,load: function() {
		var tmp = {};
		tmp.me = this;
		$(tmp.me._HtmlIds.mainContainer).insert({'bottom': new Element('div').update('Works!') });
		return tmp.me;
	}
});