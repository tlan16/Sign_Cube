/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'name': "Name", 'code': 'Code', 'active': 'Active?'};
	}
	,_htmlIds: {}
	,_language: null
	,_items: {}
	,setHTMLIds: function(itemDivId, searchPanelId) {
		var tmp = {};
		tmp.me = this;
		tmp.me._htmlIds.itemDiv = itemDivId;
		tmp.me._htmlIds.searchPanel = searchPanelId;
		return this;
	}
	/**
	 * getting the customer information div
	 */
	,_getLanguageInfoPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.language = tmp.me._language;
		tmp.newDiv = new Element('div', {'class': 'panel panel-default'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('div', {'class': 'col-sm-12'})
						.insert({'bottom': new Element('p').update('Creating Category for: <b>' + tmp.language.name + '</b>(' + tmp.language.code + ') ') })
					})
				})
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Getting each category row
	 */
	,_getCategoryRow: function(item, isTitleRow) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitleRow || false);
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : 'item_row order-item-row')})
			.store('data', item)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name'})
				.insert({'bottom': item.category.name })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'language'})
				.insert({'bottom': item.language.name })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'languageId hidden'})
				.insert({'bottom': item.language.id ? item.language.id : ''})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'btns  col-xs-1'}).update(item.btns ? item.btns : '') });
		tmp.row.down('.name').writeAttribute('colspan', 2);
		return tmp.row;
	}
	,_addNewCategoryRow: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.btn = btn;
		tmp.inputEl = btn.up('.new-order-item-input').down('[new-order-item="category"]');
		tmp.me._signRandID(tmp.inputEl);
		tmp.row = btn.up('.new-order-item-input');
		tmp.data = tmp.me._collectFormData(tmp.row, 'new-order-item');
		
		if(tmp.data === null)
			return;
		tmp.me.postAjax(tmp.me.getCallbackId('saveItem'), {'item': tmp.data}, {
			'onLoading': function () {
				jQuery('#' + tmp.inputEl.id).button('loading');
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.item)
						return;
					tmp.newRow = tmp.me._getCategoryRow(tmp.result.item, false);
					$(tmp.me._htmlIds.newOrderItemInput).insert({'after': tmp.newRow});
					$(tmp.me._htmlIds.itemDiv).down('[new-order-item=category]').focus();
					$(tmp.me._htmlIds.itemDiv).down('[new-order-item=category]').select();
				} catch (e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR:</span>', e, true);
				}
			}
			,'onComplete': function(sender, param) {
				jQuery('#' + tmp.inputEl.id).button('reset');
			}
		});
		
		return tmp.me;
	}
	/**
	 * Getting the new category row
	 */
	,_getNewCategoryRow: function() {
		var tmp = {};
		tmp.me = this;
		tmp.data = {
			'category': 
				{'name': tmp.me._getFormGroup( null, new Element('input', {'class': 'input-sm', 'new-order-item': 'category', 'required': 'Required!' , 'value': ''})
						.observe('click', function(event){
							$(this).select();
						})
						.observe('keydown', function(event){
							tmp.me.keydown(event, function() {
								$(tmp.me._htmlIds.newOrderItemInput).down('.btn.btn-save-new-cat').click();
							});
						})
					)
				}
			,'language': 
				{'name': tmp.me._getFormGroup( null, new Element('input', {'class': 'input-sm', 'new-order-item': 'language', 'disabled': true , 'value': tmp.me._language.name}) )
				  ,'id': tmp.me._getFormGroup( null, new Element('input', {'class': 'input-sm', 'new-order-item': 'languageId', 'disabled': true , 'value': tmp.me._language.id}) )
				}
			, 'btns': new Element('span', {'class': 'btn-group btn-group-sm pull-right'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-primary btn-save-new-cat'})
					.insert({'bottom': new Element('span', {'class': ' glyphicon glyphicon-floppy-saved'}) })
					.observe('click', function() {
						tmp.me._addNewCategoryRow($(this));
					})
				})
				.insert({'bottom': new Element('span', {'class': 'btn btn-default'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-floppy-remove'}) })
					.observe('click', function() {
						if(!confirm('You about to clear this entry. All input data for this entry will be lost.\n\nContinue?'))
							return;
						tmp.newRow = tmp.me._getNewCategoryRow();
						tmp.currentRow = $(this).up('.new-order-item-input');
						tmp.currentRow.getElementsBySelector('.form-group.has-error .form-control').each(function(control){
							$(control).retrieve('clearErrFunc')();
						});
						tmp.currentRow.replace(tmp.newRow);
						tmp.newRow.down('[new-order-item=category]').focus();
						tmp.newRow.down('[new-order-item=category]').select();
					})
				})
		};
		tmp.me._htmlIds.newOrderItemInput = 'new-order-item-input';
		return tmp.me._getCategoryRow(tmp.data, false).writeAttribute("id", tmp.me._htmlIds.newOrderItemInput).addClassName('new-order-item-input info').removeClassName('order-item-row');
	}
	,getItems: function(reset, pageSize) {
		var tmp = {};
		tmp.me = this;
		tmp.reset = (reset || false);
		tmp.resultDiv = $(tmp.me.resultDivId);
		
		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination, 'language': tmp.me._language}, {
			'onLoading': function () {
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					tmp.me._items = tmp.result;
					
					tmp.newDiv = tmp.me._getViewOfCategory();
					$(tmp.me._htmlIds.itemDiv).update(tmp.newDiv);
					tmp.newDiv.down('[new-order-item=category]').focus();
					tmp.newDiv.down('[new-order-item=category]').select();
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
			}
		});
		
		return tmp.me;
	}
	/**
	 * Getting the parts panel
	 */
	,_getPartsTable: function () {
		var tmp = {};
		tmp.me = this;
		//header row
		tmp.productListDiv = new Element('table', {'class': 'table table-hover table-condensed category_change_details_table'})
			.insert({'bottom': tmp.me._getCategoryRow({'category': {'name': 'Name'}, 'language': {'name': 'Language'}}, true)
				.wrap( new Element('thead') )
			});
		//tbody
		tmp.productListDiv.insert({'bottom': tmp.tbody = new Element('tbody', {'style': 'border: 3px #ccc solid;'})
			.insert({'bottom': tmp.me._getNewCategoryRow() })
		});
		tmp.me._items.items.each(function(item){
			tmp.data = {'category': item, 'language': tmp.me._language};
			tmp.tbody.insert({'bottom': tmp.me._getCategoryRow(tmp.data) })
		});
		return new Element('div', {'class': 'panel panel-info'})
			.insert({'bottom': new Element('div', {'class': 'panel-body table-responsive'})
				.insert({'bottom':  tmp.productListDiv})
			});
	}
	/**
	 * Getting the div of the order view
	 */
	,_getViewOfCategory: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div')
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'}).update(tmp.me._getLanguageInfoPanel()) })
			})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('div', {'class': 'col-sm-12'}).update(tmp.me._getPartsTable()) })
			})
			;
		return tmp.newDiv;
	}
	,selectLanguage: function(language) {
		var tmp = {};
		tmp.me = this;
		tmp.me._language = language;
		tmp.me.getItems();
		return tmp.me;
	}
	/**
	 * Getting the language row for displaying the searching result
	 */
	,_getLanguageRow: function(language, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitle || false);
		tmp.tag = (tmp.isTitle === true ? 'th': 'td');
		tmp.newDiv = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (language.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : language.id)}).store('data', language)
			.insert({'bottom': new Element(tmp.tag)
				.insert({'bottom': (tmp.isTitle === true ? '&nbsp;':
					new Element('span', {'class': 'btn btn-primary btn-xs'}).update('select')	
					.observe('click', function(){
						tmp.me.selectLanguage(language);
					})
				) })
			})
			.insert({'bottom': new Element(tmp.tag).update(language.name) })
			.insert({'bottom': new Element(tmp.tag).update(language.code) })
			.insert({'bottom': new Element(tmp.tag)
				.insert({'bottom': (tmp.isTitle === true ? language.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': language.active}) ) })
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Ajax: searching the language
	 */
	,_searchLanguage: function (txtbox) {
		var tmp = {};
		tmp.me = this;
		tmp.searchTxt = $F(txtbox).strip();
		tmp.searchPanel = $(txtbox).up('#' + tmp.me._htmlIds.searchPanel);
		tmp.me.postAjax(tmp.me.getCallbackId('searchLanguage'), {'searchTxt': tmp.searchTxt}, {
			'onLoading': function() {
				if($(tmp.searchPanel).down('.list-div'))
					$(tmp.searchPanel).down('.list-div').remove();
				$(tmp.searchPanel).insert({'bottom': new Element('div', {'class': 'panel-body'}).update(tmp.me.getLoadingImg()) });
			}
			,'onSuccess': function (sender, param) {
				if($(tmp.searchPanel).down('.panel-body'))
					$(tmp.searchPanel).down('.panel-body').remove();
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result || !tmp.result.items)
						return;
					
					$(tmp.searchPanel).insert({'bottom': new Element('small', {'class': 'table-responsive list-div'})
						.insert({'bottom': new Element('table', {'class': 'table table-hover table-condensed'})
							.insert({'bottom': new Element('thead') 
								.insert({'bottom': tmp.me._getLanguageRow({'name': 'Name', 'code': 'Code', 'active': 'Active?'}, true)  })
							})
							.insert({'bottom': tmp.listDiv = new Element('tbody') })
						})
					});
					tmp.result.items.each(function(item) {
						tmp.listDiv.insert({'bottom': tmp.me._getLanguageRow(item) });
					});
				} catch (e) {
					$(tmp.searchPanel).insert({'bottom': new Element('div', {'class': 'panel-body'}).update(tmp.me.getAlertBox('ERROR', e).addClassName('alert-danger')) });
				}
			}
		});
		return tmp.me;
	}
	/**
	 * Getting the language list panel
	 */
	,_getLanguageListPanel: function () {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'id': tmp.me._htmlIds.searchPanel, 'class': 'panel panel-default search-panel'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading form-inline'})
				.insert({'bottom': new Element('strong').update('Creating a new category for language: ') })
				.insert({'bottom': new Element('span', {'class': 'input-group col-sm-6'})
					.insert({'bottom': new Element('input', {'class': 'form-control search-txt init-focus', 'placeholder': 'Language name or code'}) 
						.observe('keydown', function(event){
							tmp.txtBox = this;
							tmp.me.keydown(event, function() {
								tmp.txtBox.up('#'+pageJs._htmlIds.searchPanel).down('.search-btn').click();
							});
							return false;
						})
					})
					.insert({'bottom': new Element('span', {'class': 'input-group-btn search-btn'})
						.insert({'bottom': new Element('span', {'class': ' btn btn-primary'})
							.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-search'}) })
						})
						.observe('click', function(){
							tmp.btn = this;
							tmp.txtBox = $(tmp.me._htmlIds.searchPanel).down('.search-txt');
							if(!$F(tmp.txtBox).blank())
								tmp.me._searchLanguage(tmp.txtBox);
							else {
								if($(tmp.me._htmlIds.searchPanel).down('.table tbody'))
									$(tmp.me._htmlIds.searchPanel).down('.table tbody').innerHTML = null;
							}
						})
					})
				})
				.insert({'bottom': new Element('span', {'class': 'btn btn-success pull-right btn-sm btn-danger'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-remove'}) })
					.observe('click', function(){
						$(tmp.me._htmlIds.searchPanel).down('.search-txt').clear().focus();
						$(tmp.me._htmlIds.searchPanel).down('.table tbody').innerHTML = null;
					})
				})
			})
			;
		return tmp.newDiv;
	}
	,init: function(language) {
		var tmp = {};
		tmp.me = this;
		
		if(language) {
			tmp.me.selectLanguage(language);
			tmp.me._language = language;
		} else {
			$(tmp.me._htmlIds.itemDiv).update(tmp.me._getLanguageListPanel());
		}
		if($$('.init-focus').size() > 0){
			$$('.init-focus').first().focus();
		}
		return tmp.me;
	}
});