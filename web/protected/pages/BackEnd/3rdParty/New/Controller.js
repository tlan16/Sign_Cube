/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_pagination: {'pageNo': 1, 'pageSize': 30} //the pagination details
	,_searchCriteria: {} //the searching criteria
	,_HTMLIDs: {}
	,_setHTMLIDs: function (json) {
		var tmp = {};
		tmp.me = this;
		$H(json).each(function(item){
			tmp.key = item.key.replace('Id','');
			tmp.value = item.value;
			tmp.me._HTMLIDs[tmp.key] = tmp.value;
		});
		return tmp.me;
	}
	,_getResultTableRow: function(item, isTitle = false){
		var tmp = {};
		tmp.me = this;
		tmp.tag = isTitle ? 'th' : 'td';
		return new Element('tr')
			.insert({'bottom': new Element(tmp.tag).update(item.word ? item.word : '') })
			.insert({'bottom': new Element(tmp.tag).update(item.video ? item.video : '') });
	}
	,_getResultTable: function (){
		var tmp = {};
		tmp.me = this;
		return new Element('table', {'class': 'table table-striped table-responsived'})
			.insert({'bottom': new Element('thead') 
				.insert({'bottom': tmp.me._getResultTableRow({'word': 'Word', 'video': 'Video'}, true) })
			})
			.insert({'bottom': new Element('tbody')
			})
		;
	}
	,_getAddressInput: function (){
		var tmp = {};
		tmp.me = this;
		return new Element('div', {'class': 'row'})
			.insert({'bottom': new Element('span', {'class': 'col-md-10'}) 
				.insert({'bottom': new Element('input', {'value': 'http://www.auslan.org.au/dictionary/', 'class': 'form-control', 'type': 'url', 'placeholder': 'Auslan Dictionary Page URL', 'autofocus': true}) })
			})
			.insert({'bottom': new Element('button', {'class': 'btn btn-md btn-success', 'type': 'submit'}).update('Submit') })
			.observe('click', function(){
				tmp.searchText = $F($(this).down('input'));
				tmp.me._getAZLinks(tmp.searchText, this);
			})
	}
	,_getAZLinks: function (url, inputDiv = null){
		var tmp = {};
		tmp.me = this;
		tmp.inputDiv = inputDiv;
		tmp.me._signRandID(tmp.inputDiv);
		tmp.me.postAjax(tmp.me.getCallbackId('getAZLinks'), {'url': url}, {
			'onLoading': function () {
				tmp.inputDiv.down('input').disable();
				tmp.inputDiv.down('button').hide();
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					tmp.result.items.each(function(item){
						$(tmp.me._HTMLIDs.resultTable).down('tbody').insert({'bottom': tmp.tr = tmp.me._getResultTableRow({'word': item}) });
						tmp.tr.store('data', item);
						tmp.tr.down('td').writeAttribute('colspan', 2); // first col span 2, hide 2nd one
						tmp.tr.down('td:not([colspan="2"])').hide();
						tmp.me._getLinkToPages(tmp.tr);
					});
				} catch (e) {
					$(tmp.me._HTMLIDs.bodyContainer).insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
			}
		});
	}
	,_getLinkToPages: function(linkRow) {
		var tmp = {};
		tmp.me = this;
		tmp.linkRow = linkRow;
		tmp.linkURL = linkRow.retrieve('data');
		tmp.me.postAjax(tmp.me.getCallbackId('getPageLinks'), {'url': tmp.linkURL, 'pageNo': 1}, {
			'onLoading': function () {
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					tmp.result.items.each(function(item){
						linkRow.insert({'after': tmp.lastRow = tmp.me._getResultTableRow({'word': item.word, 'video': item.href}) });
					});
					linkRow.remove();
					tmp.lastRow.scrollTo();
				} catch (e) {
					$(tmp.me._HTMLIDs.bodyContainer).insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
			}
		});
	}
	,init: function () {
		var tmp = {};
		tmp.me = this;
		$(tmp.me._HTMLIDs.bodyContainer)
			.insert({'bottom': tmp.me._getAddressInput().writeAttribute('id', tmp.me._HTMLIDs.addressInput) })
			.insert({'bottom': new Element('div', {'class': 'row', 'style': 'height: 10px;'}) })
			.insert({'bottom': tmp.me._getResultTable().writeAttribute('id', tmp.me._HTMLIDs.resultTable) });
	}
});