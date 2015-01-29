/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'content': "Content",'category':'Category', 'sequence': 'Order', 'word': 'Word', 'definitionType' : 'Def. Type', 'active': 'Active?'};
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
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'definitionTypeId', 'value': row.definitionTypeId ? row.definitionTypeId : ''}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'wordId', 'value': row.wordId ? row.wordId : ''}) })
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'value': row.word}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'value': row.category}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'disabled': true, 'class': 'form-control', 'value': row.definitionType}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'save-item-panel': 'content', 'placeholder': 'the Content of the Definition', 'class': 'form-control', 'value': row.content}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'save-item-panel': 'sequence', 'placeholder': 'the Order of the Definition', 'class': 'form-control', 'value': row.sequence}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'type': 'checkbox', 'class': 'form-control', 'save-item-panel': 'active', 'checked': row.id ? row.active : true}) })
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
		if(!row.id)
			tmp.newDiv.down('input[save-item-panel="active"]').writeAttribute('disabled', true);
		return tmp.newDiv;
	}
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		console.debug(row);
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : (row.active ? 'btn-hide-row item_row' : 'danger item_row'))}).store('data', row)
			.setStyle(tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '')
			.insert({'bottom': new Element(tmp.tag, {'class': 'word col-xs-1'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.word) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'category col-xs-2'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.category) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'definitionType col-xs-1'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.definitionType) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'content col-xs-5'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.content) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'sequence col-xs-1'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.sequence) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'active col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.id ? row.active : true}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right btns col-xs-1'}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'disabled': true, 'title': 'New'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) }) // TODO: new btn
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