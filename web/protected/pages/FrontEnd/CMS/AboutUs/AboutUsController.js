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
					.insert({'bottom': new Element('h1', {'class': 'col-sm-12'}).update('About SignCube')
					})
				})
			})
			.insert({'bottom': new Element('div', {'class': 'page-body'})
				.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('h3', {'class': 'col-sm-12'}).update('History')})
					.insert({'bottom': new Element('p', {'class': 'col-sm-12'}).update('2014, for deaf people in remote communities. It is a database made specifically to store many different languages ')
					})
				
//				.insert({'bottom': new Element('ul', {'class': 'ul'})
//					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('an about dictionary')})
//					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('detailed alphabet spelling')})
//					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('number signs')})
//					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('links to additional information about the region the sign language originated')})
//			})
				
					.insert({'bottom': new Element('h3', {'class': 'col-sm-12'}).update('Communities')})
					.insert({'bottom': new Element('p', {'class': 'col-sm-12'}).update('SignCube currently has 0 different languages from 0 different countries and we are always welcoming people to contact us if they are able to upload any more. ')
					})
					
					.insert({'bottom': new Element('h3', {'class': 'col-sm-12'}).update('Acknowledgments')})
					.insert({'bottom': new Element('p', {'class': 'col-sm-12'}).update('Enable Development and Engineers Without Borders deserve a massive thankyou')
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