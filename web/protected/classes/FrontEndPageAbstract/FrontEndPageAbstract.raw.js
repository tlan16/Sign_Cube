/**
 * The FrontEndPageAbstract Js file
 */
var FrontPageJs = new Class.create();
FrontPageJs.prototype = {
	resultDivId: '' //the html id of the result div
	,searchDivId: '' //the html id of the search div
	,totalNoOfItemsId: '' //the html if of the total no of items
	,_pagination: {'pageNo': 1, 'pageSize': 30} //the pagination details
	,_searchCriteria: {} //the searching criteria
	,setHTMLIds: function(resultDivId, searchDivId, totalNoOfItemsId) {
		this.resultDivId = resultDivId;
		this.searchDivId = searchDivId;
		this.totalNoOfItemsId = totalNoOfItemsId;
		return this;
	}
	,_getNextPageBtn: function() {
		var tmp = {};
		tmp.me = this;
		return new Element('tfoot')
			.insert({'bottom': new Element('tr')
				.insert({'bottom': new Element('td', {'colspan': '5', 'class': 'text-center'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-primary', 'data-loading-text':"Fetching more results ..."}).update('Show More')
						.observe('click', function() {
							tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
							jQuery(this).button('loading');
							tmp.me.getResults();
						})
					})
				})
			});
	}
	,getSearchCriteria: function() {
		var tmp = {};
		tmp.me = this;
		if(tmp.me._searchCriteria === null)
			tmp.me._searchCriteria = {};
		tmp.nothingTosearch = true;
		$(tmp.me.searchDivId).getElementsBySelector('[search_field]').each(function(item) {
			tmp.me._searchCriteria[item.readAttribute('search_field')] = $F(item);
			if(($F(item) instanceof Array && $F(item).size() > 0) || (typeof $F(item) === 'string' && !$F(item).blank()))
				tmp.nothingTosearch = false;
		});
		if(tmp.nothingTosearch === true)
			tmp.me._searchCriteria = null;
		return this;
	}
	,getBasicVideoEl: function(src, width, height, type){
		var tmp = {};
		tmp.me = this;
		tmp.width = (width || 220);
		tmp.height = (height || 180);
		tmp.type = (type || "video/mp4");
		tmp.newDiv = new Element('video', {'width': tmp.width, 'height': tmp.height, 'controls': ''})
			.insert({'bottom': new Element('source', {'src': src, 'type': tmp.type}) })
			.insert({'bottom': new Element('span').setStyle('font-weight:bold;').update('Your browser does not support the video tag.') })
		return tmp.newDiv;
	}
	/**
	 * Open a new window with given url
	 */
	,_openNewWindow: function(url) {
		var tmp = {};
		tmp.me = this;
		tmp.newWindow = window.open(url, 'New Category','width=1300, location=no, scrollbars=yes, menubar=no, status=no, titlebar=no, fullscreen=no, toolbar=no');
		tmp.newWindow.focus();
		return tmp.me;
	}
	/**
	 * Getting the form group
	 */
	,_getFormGroup: function(title, content) {
		return new Element('div', {'class': 'form-group'})
			.insert({'bottom': title ? new Element('label', {'class': 'control-label'}).update(title) : '' })
			.insert({'bottom': content.addClassName('form-control') });
	}
	,getResults: function(reset, pageSize) {
		var tmp = {};
		tmp.me = this;
		tmp.reset = (reset || false);
		tmp.resultDiv = $(tmp.me.resultDivId);
		
		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination, 'searchCriteria': tmp.me._searchCriteria}, {
			'onLoading': function () {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('loading');
				//reset div
				if(tmp.reset === true) {
					tmp.resultDiv.update( new Element('tr').update( new Element('td').update( tmp.me.getLoadingImg() ) ) );
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result)
						return;
					$(tmp.me.totalNoOfItemsId).update(tmp.result.pageStats.totalRows);
					
					//reset div
					if(tmp.reset === true) {
						tmp.resultDiv.update(tmp.me._getResultRow(tmp.me._getTitleRowData(), true).wrap(new Element('thead')));
					}
					//remove next page button
					tmp.resultDiv.getElementsBySelector('.paginWrapper').each(function(item){
						item.remove();
					});
					
					//show all items
					tmp.tbody = $(tmp.resultDiv).down('tbody');
					if(!tmp.tbody)
						$(tmp.resultDiv).insert({'bottom': tmp.tbody = new Element('tbody') });
					tmp.result.items.each(function(item) {
						tmp.tbody.insert({'bottom': tmp.me._getResultRow(item).addClassName('item_row').writeAttribute('item_id', item.id) });
					});
					//show the next page button
					if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
						tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				jQuery('#' + tmp.me.searchDivId + ' #searchBtn').button('reset');
			}
		});
	}
	/**
	 * Collecting data from attrName
	 */
	,_collectFormData: function(container, attrName, groupIndexName) {
		var tmp = {};
		tmp.me = this;
		tmp.data = {};
		tmp.hasError = false;
		$(container).getElementsBySelector('[' + attrName + ']').each(function(item) {
			tmp.groupIndexName = groupIndexName ? item.readAttribute(groupIndexName) : null;
			tmp.fieldName = item.readAttribute(attrName);
			if(item.hasAttribute('required') && $F(item).blank()) {
				tmp.me._markFormGroupError(item, 'This is requried');
				tmp.hasError = true;
			}
			
			tmp.itemValue = item.readAttribute('type') !== 'checkbox' ? $F(item) : $(item).checked;
			if(item.hasAttribute('validate_currency') || item.hasAttribute('validate_number')) {
				if (tmp.me.getValueFromCurrency(tmp.itemValue).match(/^\d+(\.\d{1,2})?$/) === null) {
					tmp.me._markFormGroupError(item, (item.hasAttribute('validate_currency') ? item.readAttribute('validate_currency') : item.hasAttribute('validate_number')));
					tmp.hasError = true;
				}
				tmp.value = tmp.me.getValueFromCurrency(tmp.itemValue);
			}
			
			//getting the data
			if(tmp.groupIndexName !== null && tmp.groupIndexName !== undefined) {
				if(!tmp.data[tmp.groupIndexName])
					tmp.data[tmp.groupIndexName] = {};
				tmp.data[tmp.groupIndexName][tmp.fieldName] = tmp.itemValue;
			} else {
				tmp.data[tmp.fieldName] = tmp.itemValue;
			}
		});
		return (tmp.hasError === true ? null : tmp.data);
	}
	,getLoadingImg: function(){
		return new Element('i', {'class': 'fa fa-refresh fa-spin fa-5x'});
	}
		
	,modalId: 'page_modal_box_id'
		
	//the callback ids
	,callbackIds: {}

	//constructor
	,initialize: function () {}
	
	,setCallbackId: function(key, callbackid) {
		this.callbackIds[key] = callbackid;
		return this;
	}
	
	,getCallbackId: function(key) {
		if(this.callbackIds[key] === undefined || this.callbackIds[key] === null)
			throw 'Callback ID is not set for:' + key;
		return this.callbackIds[key];
	}
	
	//posting an ajax request
	,postAjax: function(callbackId, data, requestProperty, timeout) {
		var tmp = {};
		tmp.request = new Prado.CallbackRequest(callbackId, requestProperty);
		tmp.request.setCallbackParameter(data);
		tmp.timeout = (timeout || 30000);
		if(tmp.timeout < 30000) {
			tmp.timeout = 30000;
		}
		tmp.request.setRequestTimeOut(tmp.timeout);
		tmp.request.dispatch();
		return tmp.request;
	}
	//parsing an ajax response
	,getResp: function (response, expectNonJSONResult, noAlert) {
		var tmp = {};
		tmp.expectNonJSONResult = (expectNonJSONResult !== true ? false : true);
		tmp.result = response;
		if(tmp.expectNonJSONResult === true)
			return tmp.result;
		if(!tmp.result.isJSON()) {
			tmp.error = 'Invalid JSON string: ' + tmp.result;
			if (noAlert === true)
				throw tmp.error;
			else 
				return alert(tmp.error);
		}
		tmp.result = tmp.result.evalJSON();
		if(tmp.result.errors.size() !== 0) {
			tmp.error = 'Error: \n\n' + tmp.result.errors.join('\n');
			if (noAlert === true)
				throw tmp.error;
			else 
				return alert(tmp.error);
		}
		return tmp.result.resultData;
	}
	//format the currency
	,getCurrency: function(number, dollar, decimal, decimalPoint, thousandPoint) {
		var tmp = {};
		tmp.decimal = (isNaN(decimal = Math.abs(decimal)) ? 2 : decimal);
		tmp.dollar = (dollar == undefined ? "$" : dollar);
		tmp.decimalPoint = (decimalPoint == undefined ? "." : decimalPoint);
		tmp.thousandPoint = (thousandPoint == undefined ? "," : thousandPoint);
		tmp.sign = (number < 0 ? "-" : "");
		tmp.Int = parseInt(number = Math.abs(+number || 0).toFixed(tmp.decimal)) + "";
		tmp.j = (tmp.j = tmp.Int.length) > 3 ? tmp.j % 3 : 0;
		return tmp.dollar + tmp.sign + (tmp.j ? tmp.Int.substr(0, tmp.j) + tmp.thousandPoint : "") + tmp.Int.substr(tmp.j).replace(/(\d{3})(?=\d)/g, "$1" + tmp.thousandPoint) + (tmp.decimal ? tmp.decimalPoint + Math.abs(number - tmp.Int).toFixed(tmp.decimal).slice(2) : "");
	}
	//do key enter
	,keydown: function (event, enterFunc, nFunc) {
		//if it's not a enter key, then return true;
		if(!((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13))) {
			if(typeof(nFunc) === 'function') {
				nFunc();
			}
			return true;
		}
		
		if(typeof(enterFunc) === 'function') {
			enterFunc();
		}
		return false;
	}
	,_getErrMsg: function (msg) {
		return new Element('span', {'class': 'errmsg smalltxt'}).update(msg);
	}
	/**
	 * Getting an alert box
	 */
	,getAlertBox: function(title, msg) {
		return new Element('div', {'class': 'alert alert-dismissible', 'role': 'alert'})
		.insert({'bottom': new Element('button', {'class': 'close', 'data-dismiss': 'alert'})
			.insert({'bottom': new Element('span', {'aria-hidden': 'true'}).update('&times;') })
			.insert({'bottom': new Element('span', {'class': 'sr-only'}).update('Close') })
		})
		.insert({'bottom': new Element('strong').update(title) })
		.insert({'bottom': msg })
	}
	/**
	 * give the input box a random id
	 */
	,_signRandID: function(input) {
		if(!input.id)
			input.id = 'input_' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
		return this;
	}
	/**
	 * Marking a form group to has-error
	 */
	,_markFormGroupError: function(input, errMsg) {
		var tmp = {}
		tmp.me = this;
		if(input.up('.form-group')) {
			input.up('.form-group').addClassName('has-error');
			tmp.me._signRandID(input);
			jQuery('#' + input.id).tooltip({
				'trigger': 'manual'
				,'placement': 'auto'
				,'container': 'body'
				,'placement': 'bottom'
				,'html': true
				,'title': errMsg
			})
			.tooltip('show');
			$(input).observe('change', function() {
				input.up('.form-group').removeClassName('has-error');
				jQuery(this).tooltip('hide').tooltip('destroy').show();
			});
		}
		return tmp.me;
	}
	/**
	 * showing the modal box
	 */
	,showModalBox: function(title, content, isSM, footer) {
		var tmp = {};
		tmp.me = this;
		tmp.isSM = (isSM === true ? true : false);
		tmp.footer = (footer ? footer : null);
		tmp.newBox = new Element('div', {'class': 'modal', 'tabindex': '-1', 'role': 'dialog', 'aria-hidden': 'true', 'aria-labelledby': 'page-modal-box'})
			.insert({'bottom': new Element('div', {'class': 'modal-dialog ' + (tmp.isSM === true ? 'modal-sm' : 'modal-lg') })
				.insert({'bottom': new Element('div', {'class': 'modal-content' })
					.insert({'bottom': new Element('div', {'class': 'modal-header' })
						.insert({'bottom': new Element('div', {'class': 'close', 'type': 'button', 'data-dismiss': 'modal'})
							.insert({'bottom':new Element('span', {'aria-hidden': 'true'}).update('&times;') })
						})
						.insert({'bottom': new Element('strong', {'class': 'modal-title', 'id': 'page-modal-box'}).update(title) })
					})
					.insert({'bottom': new Element('div', {'class': 'modal-body' }).update(content) })
					.insert({'bottom': tmp.footer === null ? '' : new Element('div', {'class': 'modal-footer' }).update(tmp.footer) })
				})
			});
		
		if($(tmp.me.modalId)) {
			$(tmp.me.modalId).remove();
		}
		$$('body')[0].insert({'bottom': tmp.newBox.writeAttribute('id',  tmp.me.modalId)});
		jQuery('#' + tmp.me.modalId).modal({'show': true, 'target': '#' + tmp.me.modalId});
		return tmp.me;
	}
	/**
	 * hiding the modal box
	 */
	,hideModalBox: function() {
		var tmp = {};
		tmp.me = this;
		jQuery('#' + tmp.me.modalId).modal('hide');
		return this;
	}
	/**
	 * Load the mysql utc time into Date object
	 */
	,loadUTCTime: function (utcString) {
		var tmp = {}
		tmp.strings = utcString.strip().split(' ');
		tmp.dateStrings = tmp.strings[0].split('-');
		tmp.timeStrings = tmp.strings[1].split(':');
		return new Date(Date.UTC(tmp.dateStrings[0], (tmp.dateStrings[1] * 1 - 1), tmp.dateStrings[2], tmp.timeStrings[0], tmp.timeStrings[1], tmp.timeStrings[2]));
	}
	/**
	 * validate email via Regex
	 */
	,validateEmail: function (email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	} 
	/**
	 * Getting a loading image div
	 */
	,_getLoadingDiv: function() {
		return new Element('div', {'class': 'text-center', 'style': 'padding: 100px 0;'}).insert({'bottom': new Element('span', {'class': 'fa fa-refresh fa-5x fa-spin'}) });
	}
};
