/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'category': {'name' :"Category", 'active': 'Active?'}, 'language': {'name': 'Language'}};
	}
	,_bindSearchKey: function() {
		var tmp = {}
		tmp.me = this;
		$('searchPanel').getElementsBySelector('[search_field]').each(function(item) {
			item.observe('keydown', function(event) {
				tmp.me.keydown(event, function() {
					$(tmp.me.searchDivId).down('#searchBtn').click();
				});
			})
		});
		return this;
	}
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		console.debug(row);
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'id', 'value': row.id ? row.id : ''}) })
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The Name of the Category', 'save-item-panel': 'categoryName', 'value': row.category.name ? row.category.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'placeholder': 'The parent Language', 'disabled': true, 'title': 'To change this, delete and create new one.', 'save-item-panel': 'languageName', 'value': row.language.name ? row.language.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group hidden'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'save-item-panel': 'categoryId', 'value': row.category.id ? row.category.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group hidden'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'save-item-panel': 'languageId', 'value': row.language.id ? row.language.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'type': 'checkbox', 'class': 'form-control', 'save-item-panel': 'categoryActive', 'checked': row.category.active}) })
			})
			.insert({'bottom': new Element('td', {'class': 'text-right'})
				.insert({'bottom':  new Element('span', {'class': 'btn-group btn-group-sm'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success', 'title': 'Save'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.me._saveItem(tmp.btn, $(tmp.btn).up('.save-item-panel'), 'save-item-panel');
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-remove'}) })
						.observe('click', function(){
							if(row.id)
								$(this).up('.save-item-panel').replace(tmp.me._getResultRow(row).addClassName('item_row').writeAttribute('item_id', row.id) );
							else
								$(this).up('.save-item-panel').remove();
						})
					})
				})
			});
		return tmp.newDiv;
	}
	,_getResultRow: function(row, isTitle) {
		console.debug(row);
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'style': tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '', 'class': (tmp.isTitle === true ? '' : (row.category.active ? 'btn-hide-row' : 'danger'))}).store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'category col-xs-5', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.category.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'language col-xs-4', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.language.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'active col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.category.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'title': 'To change this, click edit buttom.', 'checked': row.category.active}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right btns col-xs-2'}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'title': 'New'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
					.insert({'bottom': ' NEW' })
					.observe('click', function(){
						$(this).up('thead').insert({'bottom': tmp.newEditEl = tmp.me._getEditPanel({}) });
						tmp.newEditEl.down('.form-control[save-item-panel]').focus();
						tmp.newEditEl.down('.form-control[save-item-panel]').select();
						tmp.newEditEl.getElementsBySelector('.form-control[save-item-panel]').each(function(item) {
							item.observe('keydown', function(event){
								tmp.me.keydown(event, function() {
									tmp.newEditEl.down('.btn-success span').click();
								});
								return false;
							})
						});
					})
				)
				: (new Element('span', {'class': row.active ? 'btn-group btn-group-xs' : ''})
					.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$(this).up('.item_row').replace(tmp.editEl = tmp.me._getEditPanel(row));
							tmp.editEl.down('.form-control[save-item-panel]').focus();
							tmp.editEl.down('.form-control[save-item-panel]').select();
							tmp.editEl.getElementsBySelector('.form-control[save-item-panel]').each(function(item) {
								item.observe('keydown', function(event){
									tmp.me.keydown(event, function() {
										tmp.editEl.down('.btn-success span').click();
									});
									return false;
								})
							});
						})
					})
					.insert({'bottom': new Element('span', {'class': row.active ? 'btn btn-danger' : 'hidden', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-trash'}) })
						.observe('click', function(){
							if(!confirm('Are you sure you want to delete this item?'))
								return false;
							tmp.me._deactivateItem($(this));
						})
					}) ) 
			) })
		;
		return tmp.row;
	}
});