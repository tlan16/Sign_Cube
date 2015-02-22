/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'name': "Name", 'langName': 'Language', 'active': 'Active?'};
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
		tmp.selectEl = new Element('select', {'class': 'select2 form-control', 'data-placeholder': 'Select a Language', 'search_field': 'cat.lang.id'}).insert({'bottom': new Element('option').update('')});
		if(tmp.me._languages && tmp.me._languages.length > 0) {
			tmp.me._languages.each(function(language){
				tmp.selectEl.insert({'bottom': new Element('option', {'value': language.id}).update(language.name) }); 
			});
		}
		$('searchPanel').down('input[search_field="cat.lang.id"]').replace(tmp.selectEl);
		jQuery(".select2").select2({
			allowClear: true
		});
		return this;
	}
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'id', 'value': row.id ? row.id : ''}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'langId', 'value': row.langId ? row.langId : ''}) })
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The Name of the Category', 'save-item-panel': 'name', 'value': row.name ? row.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control','disabled': true, 'placeholder': 'The Name of the Language', 'save-item-panel': 'langName', 'value': row.langName ? row.langName : '', 'langId': row.langId}) })
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
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : (row.active ? 'btn-hide-row item_row' : 'danger item_row'))}).store('data', row)
			.setStyle(tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '')
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-4'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'langName col-xs-4'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(tmp.isTitle ? row.langName : (row.langName + ' (' + row.langCode + ')')) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'active col-xs-2'})
				.insert({'bottom': (tmp.isTitle === true ? row.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.id ? row.active : true}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right btns col-xs-2'}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'title': 'New'}) // TODO: new btn
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
					.insert({'bottom': ' NEW' })
					.observe('click', function(){
						tmp.me._openNewWindow('/backend/definition/new.html');
					})
				)
				: (new Element('span', {'class': row.active ? 'btn-group btn-group-xs' : ''})
					.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$(this).up('.item_row').replace(tmp.editEl = tmp.me._getEditPanel(row));
							$langId = tmp.editEl.down('input[save-item-panel="langName"]').readAttribute('langId');
							tmp.selectEl = new Element('select', {'class': 'select2 form-control', 'data-placeholder': 'Select a Language', 'save-item-panel': 'langId'});
							if(tmp.me._languages && tmp.me._languages.length > 0) {
								tmp.me._languages.each(function(language){
									tmp.selectEl.insert({'bottom': new Element('option', {'value': language.id}).update(language.name) }); 
								});
							}
							tmp.selectEl.down('[value="' + $langId + '"]').writeAttribute('selected', true);
							tmp.editEl.down('input[save-item-panel="langName"]').replace(tmp.selectEl);
							tmp.me._signRandID(tmp.selectEl);
							jQuery("#" + tmp.selectEl.id).select2({
								allowClear: true
							});
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