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
					.insert({'bottom': new Element('h1', {'class': 'col-sm-12'}).update('Welcome to SignCube ')
					})
				})
			})
			.insert({'bottom': new Element('div', {'class': 'page-body'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('p', {'class': 'col-sm-12'}).update('SignCube is a langugage resources site for various languages around the globe. For each langugage you will find:  ')
					})
				})
				.insert({'bottom': new Element('ul', {'class': 'ul'})
					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('an extensive dictionary')})
					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('detailed alphabet spelling')})
					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('number signs')})
					.insert({'bottom': new Element('li', {'class': 'col-sm-12'}).update('links to additional information about the region the sign language originated')})
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('p', {'class': 'col-sm-12'}).update('<br>Users of SignCube- deaf people, deaf students, sign language interpreters, or parents of deaf children- are all encouraged to provide feedback, via the links below, to help improve the dictionaries. If you would like to upload a video of yourself or someone else performing a sign, we invite you to Sign Up as an Administrator using the links above.')
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