/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_item: {} //the item entity that we are dealing with
	/**
	 * saving the word
	 * 
	 * @param btn The saving btn
	 * 
	 */
	,_saveWord: function(btn, word) {
		var tmp = {};
		tmp.me = this;
		tmp.hasErr = false;
		tmp.word = (word || null);
		if(tmp.word === null) {
			$$('.prop-edit-panel [prop-edit]').each(function(item) {
				if( $(item).hasAttribute('required') && $F(item).blank() ) {
					tmp.hasErr = true;
					tmp.me._markFormGroupError(item, 'This field is required');
				} else {
					tmp.me._item[$(item).readAttribute('prop-edit')] = $F(item).strip();
				}
			});
			tmp.word = tmp.me._item;
		}
		if(!tmp.typeId || tmp.typeId.blank() || tmp.hasErr === true)
			return tmp.me;
		console.debug(tmp.word);
		tmp.loadingDiv = tmp.me._getLoadingDiv();
		tmp.me.postAjax(tmp.me.getCallbackId('saveProperty'), {'newProperty': tmp.word, 'relTypeId': tmp.typeId}, {
			'onLoading': function() {
				$(tmp.me._htmlIDs.itemDivId).hide()
					.insert({'after': tmp.loadingDiv});
			}
			,'onSuccess': function(sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.url) 
						throw 'System Error: no returns';
					window.location = tmp.result.url;
				} catch (e) {
					tmp.me.showModalBox('<h4 class="text-danger">ERROR</h4>', e, false);
					$(tmp.me._htmlIDs.itemDivId).show();
					tmp.loadingDiv.remove();
				}
			}
		})
		return tmp.me;
	}
	/**
	 * Getting the Word Editing Panel
	 * 
	 * @param word	   The word object
	 * @param title    The words on the top of the page - optional
	 * 
	 * @return Element
	 */
	,getPropertyEditPanel: function(title) {
		var tmp = {};
		tmp.me = this;
		tmp.noOfRooms = tmp.noOfBaths = tmp.noOfCars = '';
		tmp.addrString = tmp.me._item.address.street + ', ' + tmp.me._item.address.city + ', ' + tmp.me._item.address.region + ' ' + tmp.me._item.address.country + ' ' + tmp.me._item.address.postCode;
		tmp.newDiv = new Element('div')
			.insert({'bottom': new Element('h3').update(title ? title : 'Adding a property:') })
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'form-group col-sm-9'})
					.insert({'bottom': new Element('div', {'class': 'prop-edit-panel'})
						.insert({'bottom': new Element('div', {'class': 'form-group col-sm-4'})
							.insert({'bottom': new Element('div', {'class': 'input-group'})
								.insert({'bottom': new Element('div', {'class': 'input-group-addon'})
									.insert({'bottom': new Element('span', {'class': 'label-text'}).update('Bedrooms:') })
								})
								.insert({'bottom': new Element('input', {'type': 'number', 'class': 'form-control', 'prop-edit': 'noOfRooms', 'placeholder': 'Number of Rooms', 'required': true, 'value': tmp.noOfRooms}) })
							})
						})
						.insert({'bottom': new Element('div', {'class': 'form-group col-sm-4'})
							.insert({'bottom': new Element('div', {'class': 'input-group'})
								.insert({'bottom': new Element('div', {'class': 'input-group-addon'})
									.insert({'bottom': new Element('span', {'class': 'label-text'}).update('Bathrooms:') })
								})
								.insert({'bottom': new Element('input', {'type': 'number', 'class': 'form-control', 'prop-edit': 'noOfBaths', 'placeholder': 'Number of Bathrooms', 'required': true, 'value': tmp.noOfBaths}) })
							})
						})
						.insert({'bottom': new Element('div', {'class': 'form-group col-sm-4'})
							.insert({'bottom': new Element('div', {'class': 'input-group'})
								.insert({'bottom': new Element('div', {'class': 'input-group-addon'})
									.insert({'bottom': new Element('span', {'class': 'label-text'}).update('CarSpaces:') })
								})
								.insert({'bottom': new Element('input', {'type': 'number', 'class': 'form-control', 'prop-edit': 'noOfCars', 'placeholder': 'Number of car spaces', 'required': true, 'value': tmp.noOfCars}) })
							})
						})
						.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
							.insert({'bottom': new Element('label', {'class': 'col-sm-12'}).update('Description:') 
								.insert({'bottom': new Element('small').update( new Element('em', {'class': 'text-danger pull-right'}).update('Description will be viewed by other users') ) }) 
							})
							.insert({'bottom': new Element('textarea', {'class': 'form-control', 'prop-edit': 'description', 'placeholder': 'Some Description for this property', 'rows': 3}) })
						})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group col-sm-3'})
					.insert({'bottom': new Element('div', {'class': 'thumbnail'})
						.insert({'bottom': new Element('img', {'data-src': 'holder.js/100%x300', 'src': '//maps.googleapis.com/maps/api/staticmap?center=' + tmp.addrString + '&zoom=15&size=300x300&markers=color:red|label:P|' + tmp.addrString + ''}) })
					})
					.insert({'bottom': new Element('div', {'class': 'thumbnail'})
						.insert({'bottom': new Element('img', {'data-src': 'holder.js/100%x300', 'src': '//maps.googleapis.com/maps/api/streetview?size=300x300&location=' + tmp.addrString + ''}) })
					})
				})
			})
			.insert({'bottom': new Element('h3').update('I am the ...') })
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('a', {'href': 'javascript: void(0);', 'class': 'form-group col-sm-4 text-center rel-type-selector blue', 'prop-rel-type': tmp.me._propRelTypeIds.agent})
					.insert({'bottom': new Element('div', {'class': 'milstone-counter'})
						.insert({'bottom': new Element('span', {'class': 'fa fa-calendar fa-5x icon-header'}) })
						.insert({'bottom': new Element('span', {'class': 'stat-count highlight'}).update('Agent') })
						.insert({'bottom': new Element('span', {'class': 'milestone-details'}).update('Who manages this property') })
					})
					.observe('click', function() {
						tmp.me._saveProperty(this);
					})
				})
				.insert({'bottom': new Element('a', {'href': 'javascript: void(0);', 'class': 'form-group col-sm-4 text-center rel-type-selector green', 'prop-rel-type': tmp.me._propRelTypeIds.owner})
					.insert({'bottom': new Element('div', {'class': 'milstone-counter'})
						.insert({'bottom': new Element('span', {'class': 'fa fa-map-marker fa-5x icon-header'}) })
						.insert({'bottom': new Element('span', {'class': 'stat-count highlight'}).update('Owner') })
						.insert({'bottom': new Element('span', {'class': 'milestone-details'}).update('Who owns this property') })
					})
					.observe('click', function() {
						tmp.me._saveProperty(this);
					})
				})
				.insert({'bottom': new Element('a', {'href': 'javascript: void(0);', 'class': 'form-group col-sm-4 text-center rel-type-selector orange', 'prop-rel-type': tmp.me._propRelTypeIds.tanent})
					.insert({'bottom': new Element('div', {'class': 'milstone-counter'})
						.insert({'bottom': new Element('span', {'class': 'fa fa-key fa-5x icon-header'}) })
						.insert({'bottom': new Element('span', {'class': 'stat-count highlight'}).update('Tanent') })
						.insert({'bottom': new Element('span', {'class': 'milestone-details'}).update('Who rents this property') })
					})
					.observe('click', function() {
						tmp.me._saveProperty(this);
					})
				})
			});
		return tmp.newDiv;
	}
	,_getPropertyRow: function(property) {
		var tmp = {};
		tmp.me = this;
		tmp.newRow = new Element('div', {'class': 'item-row row property-row'}).store('data', property)
			.insert({'bottom': new Element('div', {'class': 'col-sm-8 col-sm-push-4'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-8'})
						.insert({'bottom': new Element('a', {'href': '/backend/property/' + property.sKey + '.html'})
							.insert({'bottom': new Element('h4').update(property.address.full) })
						})
					})
					.insert({'bottom': new Element('div', {'class': 'col-sm-4 text-right'})
						.insert({'bottom': new Element('span', {'href': 'javascript: void(0);', 'class': 'col-xs-4', 'title': property.noOfRooms + ' Bedrooms'})
							.insert({'bottom': new Element('abbr', {'class': 'fa fa-users', 'title': property.noOfRooms + ' Bedrooms'}) })
							.insert({'bottom': new Element('abbr', {'title': property.noOfRooms + ' Bedrooms'}).update(' ' + property.noOfRooms) })
						})
						.insert({'bottom': new Element('span', {'href': 'javascript: void(0);', 'class': 'col-xs-4', 'title': property.noOfBaths + ' Bathrooms'})
							.insert({'bottom': new Element('abbr', {'class': 'fa fa-cogs', 'title': property.noOfBaths + ' Bathrooms'}) })
							.insert({'bottom': new Element('abbr', {'title': property.noOfBaths + ' Bathrooms'}).update(' ' + property.noOfBaths) })
						})
						.insert({'bottom': new Element('span', {'href': 'javascript: void(0);', 'class': 'col-xs-4', 'title': property.noOfCars + ' Car Spaces'})
							.insert({'bottom': new Element('abbr', {'class': 'fa fa-car', 'title': property.noOfCars + ' Car Spaces'}) })
							.insert({'bottom': new Element('abbr', {'title': property.noOfCars + ' Car Spaces'}).update(' ' + property.noOfCars) })
						})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'row hidden-xs'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'style': 'text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'}) 
						.insert({'bottom': new Element('small') 
							.insert({'bottom': new Element('em').update(property.description)  })
						})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('h4', {'class': 'col-sm-2'}).update('I am: ') })
					.insert({'bottom': new Element('h4', {'class': 'col-sm-3 col-xs-4'})
						.insert({'bottom': new Element('span', {'prop-rel-type': tmp.me._propRelTypeIds.agent, 'class': 'btn btn-primary' + (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.agent) >= 0 ? ' disabled' :  ''), 'title': (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.agent) >= 0 ? 'You are already a agent of this property' :  'Who manages in it')})
							.update(' Agent')
							.insert({'top': new Element('icon', {'class': 'fa fa-calendar'}) })
							.observe('click', function() {
								tmp.me._saveProperty(this, property);
							})
						}) 
					})
					.insert({'bottom': new Element('h4', {'class': 'col-sm-3  col-xs-4'})
						.insert({'bottom': new Element('span', {'prop-rel-type': tmp.me._propRelTypeIds.owner, 'class': 'btn btn-success' + (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.owner) >= 0 ? ' disabled' :  ''), 'title': (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.owner) >= 0 ? 'You are already a owner of this property' :  'Who owns in it')})
							.update(' Owner')
							.insert({'top': new Element('icon', {'class': 'fa fa-map-marker'}) })
							.observe('click', function() {
								tmp.me._saveProperty(this, property);
							})
						}) 
					})
					.insert({'bottom': new Element('h4', {'class': 'col-sm-3  col-xs-4'})
						.insert({'bottom': new Element('span', {'prop-rel-type': tmp.me._propRelTypeIds.tenant,  'class': 'btn btn-warning' + (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.tenant) >= 0 ? ' disabled' :  ''), 'title': (property.curRoleIds.indexOf(tmp.me._propRelTypeIds.tenant) >= 0 ? 'You are already a tenant of this property' :  'Who leaves in it now')})
							.update(' Tenant')
							.insert({'top': new Element('icon', {'class': 'fa fa-key'}) })
							.observe('click', function() {
								tmp.me._saveProperty(this, property);
							})
						}) 
					})
				})
			})
			.insert({'bottom': new Element('div', {'class': 'col-sm-4 col-sm-pull-8  hidden-xs'})
				.insert({'bottom': new Element('a', {'class': 'thumbnail', 'href': 'comgooglemaps://maps.googleapis.com/maps/api/staticmap?center=' + property.address.full})
					.insert({'bottom': new Element('img', {'src': '//maps.googleapis.com/maps/api/staticmap?center=' + property.address.full + '&zoom=15&size=300x200&markers=color:red|label:P|' + property.address.full + '', 'class': 'img-responsive', 'alt': property.address.full})})
				})
			});
		return tmp.newRow;
	}
	,getAllPropertiesPanel: function(properties, title) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'list-div'})
			.insert({'bottom': new Element('h4', {'class': 'item-row row'}).update(title ? title : 'We found a couple of properties matched with the same address, please make a selection from them:') })
		tmp.propCount = properties.size();
		for(tmp.i = 0; tmp.i < tmp.propCount; tmp.i = (tmp.i * 1) + 1) {
			tmp.property = properties[tmp.i];
			tmp.newDiv.insert({'bottom': tmp.me._getPropertyRow(tmp.property)});
		}
		return tmp.newDiv;
	}
	/**
	 * checking whether the backend has such an address or not
	 */
	,confirmAddr: function() {
		var tmp = {};
		tmp.me = this;
		tmp.hasErrorInAddr = false;
		$H(tmp.me._item.address).each(function(item){
			if(item.value.blank()) {
				tmp.hasErrorInAddr = true;
			}
		});
		if(tmp.hasErrorInAddr === true) {
			tmp.me.showAddrEditPanel('<span class="text-warning">Missing some information in selected address, please manually correct them and submit:</span>');
			return tmp.me;
		}
		
		$(tmp.me._htmlIDs.mapViewer).hide();
		tmp.editView = $(tmp.me._htmlIDs.editViewer);
		tmp.editView.update(tmp.me._getLoadingDiv())
			.show();
		tmp.me.postAjax(tmp.me.getCallbackId('checkAddr'), {'checkAddr': tmp.me._item.address}, {
			'onLoading': function() {}
			,'onSuccess': function(sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					if(tmp.result.address && tmp.result.address.street) {
						tmp.me._item.address = tmp.result.address;
					}
					$(tmp.me._htmlIDs.addrSearchTxtBox).value = tmp.me._item.address.street + ', ' + tmp.me._item.address.city + ', ' + tmp.me._item.address.region + ' ' + tmp.me._item.address.country + ' ' + tmp.me._item.address.postCode;
					if(tmp.result.properties && tmp.result.properties.size() >0) {
						tmp.editView.update(tmp.me.getAllPropertiesPanel(tmp.result.properties));
					} else {
						tmp.editView.update(tmp.me.getPropertyEditPanel('Lucky you! you are the first person to add this property.'));
					}
				} catch (e) {
					tmp.editView.update(tmp.me.getAlertBox('ERROR', e).addClassName('alert-danger'));
				}
			}
		});
		return tmp.me;
	}
	/**
	 * showing the address manual input panel
	 */
	,showAddrEditPanel: function(title) {
		var tmp = {};
		tmp.me = this;
		$(tmp.me._htmlIDs.mapViewer).hide();
		tmp.editView = $(tmp.me._htmlIDs.editViewer)
			.show()
			.update('')
			.insert({'bottom': new Element('div', {'class': 'form-horizontal addr-edit-panel'})
				.insert({'bottom': new Element('h4').update(title ? title : 'Please manually type in the address:') })
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('label', {'class': 'control-label col-sm-2'}).update('Street:') })
					.insert({'bottom': new Element('div', {'class': 'col-sm-10'})
						.insert({'bottom': new Element('input', {'class': 'form-control', 'addr-viewer': 'street', 'value': tmp.me._item.address.street})})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('label', {'class': 'control-label col-sm-2'}).update('Suburb:') })
					.insert({'bottom': new Element('div', {'class': 'col-sm-10'})
						.insert({'bottom': new Element('input', {'class': 'form-control', 'addr-viewer': 'city', 'value': tmp.me._item.address.city}) })
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('label', {'class': 'control-label col-sm-2'}).update('State:') })
					.insert({'bottom': new Element('div', {'class': 'col-sm-10'})
						.insert({'bottom': new Element('input', {'class': 'form-control', 'addr-viewer': 'region', 'value': tmp.me._item.address.region}) })
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('label', {'class': 'control-label col-sm-2'}).update('Country:') })
					.insert({'bottom': new Element('div', {'class': 'col-sm-10'})
						.insert({'bottom': new Element('input', {'class': 'form-control', 'addr-viewer': 'country', 'value': tmp.me._item.address.country}) })
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('label', {'class': 'control-label col-sm-2'}).update('PostCode:') })
					.insert({'bottom': new Element('div', {'class': 'col-sm-10'})
						.insert({'bottom': new Element('input', {'class': 'form-control', 'addr-viewer': 'postCode', 'value': tmp.me._item.address.postCode}) })
					})
				})
				.insert({'bottom': new Element('div', {'class': 'form-group'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-offset-2 col-sm-10'})
						.insert({'bottom': new Element('span', {'class': 'btn btn-success'}).update('Confirm this address')
							.observe('click', function() {
								tmp.hasError = false;
								$(this).up('.addr-edit-panel').getElementsBySelector('[addr-viewer]').each(function(el) {
									if($F(el).blank()) {
										tmp.me._markFormGroupError(el, 'This field is required.');
										tmp.hasError = true;
									}
									tmp.me._item.address[el.readAttribute('addr-viewer')] = $F(el).strip();
								});
								if(tmp.hasError === false)
									tmp.me.confirmAddr();
							})
						})
					})
				})
				
			});
		return tmp.me;
	}
	/**
	 * bind auto complete address box
	 */
	,_bindAutoComplete: function (txtBox, editPanel) {
		var tmp = {};
		tmp.me = this;
	}
	,_getEditPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('section')
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12', 'id': tmp.me._htmlIDs.editViewer, 'style': 'min-height: 400px; display:none;'}) })
			});
		return tmp.newDiv;
	}
	/**
	 * Showing the creating panel
	 */
	,_showCreatingPanel: function() {
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
			})
			.insert({'bottom': tmp.editPanel = tmp.me._getEditPanel() });
		$(tmp.me._htmlIDs.itemDivId).update(tmp.newDiv);
		tmp.me._bindAutoComplete(tmp.searchBox, tmp.editPanel);
		return tmp.me;
	}
	/**
	 * Showing the item
	 */
	,load: function(item) {
		var tmp = {};
		tmp.me = this;
		tmp.me._item = item;
		tmp.me._htmlIDs.mapViewer = 'map-viewer';
		tmp.me._htmlIDs.editViewer = 'property-edit-viewer';
		tmp.me._htmlIDs.addrSearchTxtBox = 'addr-search-box';
		tmp.me._showCreatingPanel();
		return tmp.me;
	}
});