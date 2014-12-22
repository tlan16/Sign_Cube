/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_item: {} //the item entity that we are dealing with
	/**
	 * Showing the item
	 */
	/**
	 * Showing the homepage panel
	 */
	,_showHomePagePanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div')
			.insert({'bottom': new Element('div', {'class': 'page-header'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('h4', {'class': 'col-sm-3'}).update('Adding Word: ')
					})
					.insert({'bottom': new Element('div', {'class': 'input-group col-sm-9'})
						.insert({'bottom': tmp.searchBox = new Element('input', {'id': tmp.me._htmlIDs.addrSearchTxtBox, 'class': 'form-control', 'placeholder': 'Type in an word'}) })
					})
				})
			});
		$(tmp.me._htmlIDs.itemDivId).update(tmp.newDiv);
		return tmp.me;
	}
	,load: function() {
		var tmp = {};
		tmp.me = this;
//		tmp.me._item = item;
		tmp.me._htmlIDs.mapViewer = 'map-viewer';
		tmp.me._htmlIDs.editViewer = 'property-edit-viewer';
		tmp.me._htmlIDs.addrSearchTxtBox = 'addr-search-box';
		tmp.me._showHomePagePanel();
		return tmp.me;
	}
});