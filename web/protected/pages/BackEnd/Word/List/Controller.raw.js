/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'name': "Word", 'category': {'name': 'Category', 'language': {'name': 'Language'}}, 'language': {'name': 'Language'}, 'active':'Active?'};
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
		tmp.selectEl = new Element('select', {'class': 'select2 form-control', 'data-placeholder': 'Select a Category', 'search_field': 'category.id'}).insert({'bottom': new Element('option').update('')});
		if(tmp.me._categories && tmp.me._categories.length > 0) {
			tmp.me._categories.each(function(category){
				tmp.foundLanguage = false;
				$(tmp.selectEl).getElementsBySelector('optgroup').each(function(optgroup){
					if(tmp.foundLanguage === false && optgroup.readAttribute('langId') == category.language.id) {
						tmp.foundLanguage = true;
						tmp.option = optgroup.insert({'bottom': new Element('option', {'categoryId': category.id, 'value': category.id}).update(category.name) })
					}
				});
				if(tmp.foundLanguage === false) {
					tmp.selectEl.insert({'bottom': new Element('optgroup', {'langId': category.language.id, 'label': category.language.name}).update(category.language.name).store('data', category.language) })
				}
			});
		}
		$('searchPanel').down('input[search_field="category.id"]').replace(tmp.selectEl);
		tmp.selectEl = new Element('select', {'class': 'select2 form-control', 'data-placeholder': 'Select a Language', 'search_field': 'language.id'}).insert({'bottom': new Element('option').update('')});
		if(tmp.me._categories && tmp.me._categories.length > 0) {
			tmp.me._categories.each(function(category){
				tmp.foundLanguage = false;
				$(tmp.selectEl).getElementsBySelector('option').each(function(option){
					if(tmp.foundLanguage === false && option.readAttribute('value') == category.language.id) {
						tmp.foundLanguage = true;
						tmp.option = option;
					}
				});
				if(tmp.foundLanguage === false) {
					tmp.selectEl.insert({'bottom': new Element('option', {'value': category.language.id}).update(category.language.name) }); 
				}
			});
		}
		tmp.me.sortlist(tmp.selectEl);
		$('searchPanel').down('input[search_field="language.id"]').replace(tmp.selectEl);
		jQuery(".select2").select2({
			allowClear: true
		});
		return tmp.me;
	}
	,sortlist: function (selectEl) {
		var tmp = {};
		tmp.me = this;
		
	    tmp.cl = selectEl;
	    tmp.clTexts = new Array();

	    for(i = 2; i < tmp.cl.length; i++)
	    {
	        tmp.clTexts[i-2] =
	            tmp.cl.options[i].text.toUpperCase() + "," +
	            tmp.cl.options[i].text + "," +
	            tmp.cl.options[i].value;
	    }

	    tmp.clTexts.sort();

	    for(i = 2; i < tmp.cl.length; i++)
	    {
	        tmp.me.parts = tmp.clTexts[i-2].split(',');
	        
	        tmp.cl.options[i].text = tmp.me.parts[1];
	        tmp.cl.options[i].value = tmp.me.parts[2];
	    }
	}
	/**
	 * initiating the chosen input
	 */
	,_loadChosen: function () {
		jQuery(".chosen").chosen({
				search_contains: true,
				inherit_select_classes: true,
				no_results_text: "No sign language type found!",
				width: "100%",
		})
		.trigger("chosen:updated");
		return this;
	}
	,_getEditPanel: function(row) {
		var tmp = {};
		tmp.me = this;
		tmp.selectEl = new Element('select', {'class': 'chosen', 'data-placeholder': 'Sign Language...', 'save-item-panel': 'category'});
		if(tmp.me._categories && tmp.me._categories.length > 0) {
			tmp.me._categories.each(function(category){
				tmp.foundLanguage = false;
				$(tmp.selectEl).getElementsBySelector('optgroup').each(function(optgroup){
					if(tmp.foundLanguage === false && optgroup.readAttribute('langId') == category.language.id) {
						tmp.foundLanguage = true;
						tmp.option = optgroup.insert({'bottom': new Element('option', {'categoryId': category.id, 'value': category.id}).update(category.name) })
					}
				});
				if(tmp.foundLanguage === false) {
					tmp.selectEl.insert({'bottom': new Element('optgroup', {'langId': category.language.id, 'label': category.language.name}).update(category.language.name).store('data', category.language) })
				}
			});
		}
		tmp.selectEl.down('[categoryid="' + row.category.id + '"]').writeAttribute('selected', true);
		
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'}).store('data', row)
			.insert({'bottom': new Element('input', {'type': 'text', 'save-item-panel': 'id', 'value': row.id ? row.id : ''}).setStyle('display:none;') })
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The Word', 'save-item-panel': 'name', 'value': row.name ? row.name : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': tmp.selectEl })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'placeholder': 'The parent Language', 'disabled': true, 'title': 'To change this, delete and create new one.', 'save-item-panel': 'languageName', 'value': row.category.language.name ? row.category.language.name : ''}) })
				.hide()
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'}).setStyle('display:none;')
				.insert({'bottom': new Element('input', {'class': 'form-control', 'save-item-panel': 'categoryId', 'value': row.category.id ? row.category.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'}).setStyle('display:none;')
				.insert({'bottom': new Element('input', {'class': 'form-control', 'save-item-panel': 'languageId', 'value': row.category.language.id ? row.category.language.id : ''}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'type': 'checkbox', 'class': 'form-control', 'save-item-panel': 'active', 'checked': row.active}) })
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
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'style': tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '', 'class': (tmp.isTitle === true ? '' : (row.active ? 'btn-hide-row' : 'danger'))}).addClassName('item_row').store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-3', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'categoryName col-xs-3', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.category.name + '(' + row.category.language.name + ')') })
			.insert({'bottom': new Element(tmp.tag, {'class': 'languageName col-xs-3', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.category.language.name).hide() })
			.insert({'bottom': new Element(tmp.tag, {'class': 'active col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.active}) ) })
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'text-right btns col-xs-2'}).update(
				tmp.isTitle === true ?  
				(new Element('span', {'class': 'btn btn-primary btn-xs', 'title': 'New'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-plus'}) })
					.insert({'bottom': ' NEW' })
					.observe('click', function(){
						tmp.me.showModalBox('Notice', '<h4>Redirecting to <b>word creation</b> Page ...</h4>');
						window.open("/backend/word/new.html", "_self");
					})
				)
				: (new Element('span', {'class': row.active ? 'btn-group btn-group-xs' : ''})
					.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default', 'title': 'Edit'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-pencil'}) })
						.observe('click', function(){
							$(this).up('.item_row').replace(tmp.editEl = tmp.me._getEditPanel(row));
							tmp.me._loadChosen();
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
					.insert({'bottom': new Element('span', {'class': row.active ? 'btn btn-danger' : '', 'title': 'Delete'}).setStyle(row.active ? '' : 'display:none;')
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