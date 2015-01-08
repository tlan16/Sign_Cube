/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_htmlIds: {}
	,_pagination: {'pageNo': 1, 'pageSize': 30} //the pagination details
	,_searchCriteria: null
	,load: function () {
		var tmp = {};
		tmp.me = this;
		$(tmp.me._htmlIds.auslanContainer)
			.insert({'bottom': new Element('div', {'id': tmp.wordsDiv = tmp.me._htmlIds.wordsDivContainer})
				.insert({'bottom': new Element('row').update('Start') })
			});
		tmp.me._getWords();
		return tmp.me;
	}
	,_getWordsDivRow: function(word) {
		var tmp = {};
		tmp.me = this;
		tmp.word = word;
		tmp.newDiv = new Element('div', {'class': 'row', 'itemId': tmp.word.id}).store('data', tmp.word)
			.insert({'bottom': new Element('span', {'class': 'col-md-6'}).update(word.name) })
			.insert({'bottom': new Element('span', {'class': 'col-md-6'}).update(word.href) })
		;
		return tmp.newDiv;
	}
	,_setHtmlIds: function(auslanContainerId, wordsDivContainerId) {
		var tmp = {};
		tmp.me = this;
		tmp.me._htmlIds.auslanContainer = auslanContainerId;
		tmp.me._htmlIds.wordsDivContainer = wordsDivContainerId;
		
		return tmp.me;
	}
	,_getWords: function(pageSize) {
		var tmp = {};
		tmp.me = this;
		tmp.wordsDiv = $(tmp.me._htmlIds.wordsDivContainer);
		
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination, 'searchCriteria': tmp.me._searchCriteria}, {
			'onLoading': function () {
				//reset div
				if(tmp.reset === true) {
					tmp.wordsDiv.update( tmp.me._getLoadingDiv() );
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					tmp.result.items.each(function(word){
						tmp.wordsDiv.insert({'bottom': tmp.me._getWordsDivRow(word) });
					});
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				if(typeof(completeFunc) === 'function')
					completeFunc();
			}
		});
	}
});