/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_getTitleRowData: function() {
		return {'name': "Word", 'category': {'name': 'Category', 'language': {'name': 'Language'}}, 'language': {'name': 'Language'}};
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
	,loadAZlinks: function() {
		var tmp = {};
		tmp.me = this;
		
		for (var i = 65; i <= 90; i++) {
			$(this.totalNoOfItemsId).up('.panel-heading').insert({'bottom': new Element('td').update(String.fromCharCode(i)).setStyle('padding: 0 5px; color: #3071A9; text-decoration: underline; cursor: pointer;')
				.observe('click', function(){
					tmp.me.getSearchCriteria();
					tmp.me._searchCriteria = tmp.me._searchCriteria === null ? {} : tmp.me._searchCriteria;
					tmp.me._searchCriteria['wd.startLetter'] = $(this).innerHTML;
					tmp.me.getResults(true);
				})
			});
		}
	}
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr').setStyle(tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '').store('data', row)
			.insert({'bottom': new Element(tmp.tag, {'class': 'name col-xs-3'}).update(row.name).setStyle(tmp.isTitle ? 'font-weight:bold;' : 'text-decoration: underline; cursor: pointer;')
				.observe('click', function(){
					
				})
			})
			.insert({'bottom': new Element(tmp.tag, {'class': 'categoryName col-xs-3', 'style': tmp.isTitle ? 'font-weight:bold;' : ''}).update(row.category.name + '(' + row.category.language.name + ')') });
		return tmp.row;
	}
});