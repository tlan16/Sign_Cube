/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_getTitleRowData: function() {
		return {'content': "Content", 'sequence': 'Order', 'word': 'Word','category':'Category',  'definitionType' : 'Def. Type', 'active': 'Active?'};
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
	,_getResultRow: function(row, isTitle) {
		var tmp = {};
		tmp.me = this;
		console.debug(row);
		tmp.tag = (tmp.isTitle === true ? 'th' : 'td');
		tmp.isTitle = (isTitle || false);
		tmp.row = new Element('tr', {'class': (tmp.isTitle === true ? '' : (row.active ? 'btn-hide-row item_row' : 'danger item_row'))}).store('data', row)
			.setStyle(tmp.isTitle ? 'font-size:110%; font-weight:bold;' : '')
			.insert({'bottom': new Element(tmp.tag, {'class': 'content col-xs-5'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.content) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'sequence col-xs-1'}).setStyle(tmp.isTitle ? 'font-weight:bold;' : '').update(row.sequence) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'active col-xs-1'})
				.insert({'bottom': (tmp.isTitle === true ? row.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': row.id ? row.active : true}) ) })
			});
		return tmp.row;
	}
});