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
	,_category: {}
	,_word: {}
	,_items: {}
	,_asset: {}
	,_video: {}
	,_definitionTypes: {}
	,setHTMLIds: function(itemDivId, searchPanelId, uploaderDivId) {
		var tmp = {};
		tmp.me = this;
		tmp.me._htmlIds.itemDiv = itemDivId;
		tmp.me._htmlIds.searchPanel = searchPanelId;
		tmp.me._htmlIds.newWordBtn = 'new_word_btn';
		tmp.me._htmlIds.uploaderDivId = uploaderDivId;
		tmp.me._htmlIds.definitionsContainer = 'definitions_container';
		tmp.me._htmlIds.definitionsContainerInner = 'definitions_container_inner';
		return this;
	}
	,_saveWord: function() {
		var tmp = {};
		tmp.me = this;
		
		tmp.data = tmp.data = [];
		$(tmp.me._htmlIds.definitionsContainerInner).getElementsBySelector('.definitionGroup').each(function(group){
			tmp.type = $F($(group).down('.panel-heading [save-def-item="type"]'));
			if(!tmp.type.empty()) {
				tmp.formType = tmp.type;
				tmp.formRows = [];
				$(group).getElementsBySelector('.panel-body .row.definitionRow').each(function(defRow){
					tmp.row = $F($(defRow).down('[save-def-item="definitionRow"]'));
					tmp.order = $F($(defRow).down('[save-def-item="definitionOrder"]'));
					if(!tmp.row.empty())
						tmp.formRows.push ({'def': tmp.row,'order': tmp.order});
				});
				tmp.data.push({'type': tmp.formType, 'rows': tmp.formRows});
			}
		});
		
		tmp.me.postAjax(tmp.me.getCallbackId('saveWord'), {'definitions': tmp.data, 'video': tmp.me._video, 'asset': tmp.me._asset, 'word': tmp.me._word}, {
			'onLoading': function() {
				$(tmp.me._htmlIds.itemDiv).insert({'top': tmp.loadingImg = tmp.me.getLoadingImg()});
				$(tmp.me._htmlIds.definitionsContainer).hide();
			}
			,'onSuccess': function(sender, param){
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result.item || tmp.result.item.id.empty())
						throw 'errror: php passback Error';
					else {
						tmp.me.showModalBox('<h4>Word Saved Successfully</h4>');
						window.location.reload();
					}
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
			,'onComplete': function() {
				tmp.loadingImg.remove();
			}
		});
		
		return tmp.me;
	}
	,_getNewDefinitionBodyRow: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'row definitionRow'}).setStyle('padding-bottom: 10px;')
			.insert({'bottom': new Element('span', {'class': 'col-md-8'}) 
				.insert({'bottom': new Element('input', {'save-def-item': 'definitionRow', 'type': 'text', 'placeholder': 'Definition'}).setStyle('width: 100%;')
					.observe('click', function(){
						$(this).focus();
						$(this).select();
					})
					.observe('keydown', function(event){
						tmp.btn = $(this);
						tmp.me.keydown(event, function() {
							tmp.btn.up('.row.definitionRow').down('[save-def-item="definitionOrder"]').click();
						});
						return false;
					})
				})
			})
			.insert({'bottom': new Element('span', {'class': 'col-md-2'}) 
				.insert({'bottom': new Element('input', {'save-def-item': 'definitionOrder', 'type': 'value', 'placeholder': 'Order (optional)'}).setStyle('width: 100%;')
					.observe('click', function(){
						$(this).focus();
						$(this).select();
					})
					.observe('keydown', function(event){
						tmp.btn = $(this);
						tmp.me.keydown(event, function() {
							tmp.btn.up('.row.definitionRow').down('.btn.btn-new-defRow').click();
						});
						return false;
					})
				})
			})
			.insert({'bottom': new Element('span', {'class': 'col-md-2 text-right'})
				.insert({'bottom': new Element('span', {'class': 'btn-group'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success btn-xs btn-new-defRow'})
						.insert({'bottom': new Element('i', {'class': 'fa fa-plus'})})
						.observe('click', function(){
							$(this).up('.panel.definitionGroup').down('.panel-body')
								.insert({'bottom': tmp.newDefRow = tmp.me._getNewDefinitionBodyRow()});
							tmp.newDefRow.down('[save-def-item="definitionRow"]').click();
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-xs'})
						.insert({'bottom': new Element('i', {'class': 'fa fa-times'})})
						.observe('click', function(){
							$(this).up('.row.definitionRow').remove();
						})
					})
				})
			});
		return tmp.newDiv;
	}
	,_getNewDefinitionGroup: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'panel panel-default definitionGroup'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('input', {'save-def-item': 'type', 'type': 'text', 'placeholder': 'the Type of Definition'}).setStyle('width: 100%;')
						.observe('click', function(){
							$(this).focus();
							$(this).select();
						})
						.observe('keydown', function(event){
							tmp.btn = $(this);
							tmp.me.keydown(event, function() {
								tmp.btn.up('.panel-heading').down('.btn-save-def-type').click();
							});
							return false;
						})
						.wrap(new Element('span', {'class': 'col-md-8'})) 
					})
					.insert({'bottom': new Element('span', {'class': 'col-md-4 btn-group'})
						.insert({'bottom': new Element('span', {'class': 'btn btn-success btn-sm btn-save-def-type'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-floppy-saved'})})
							.observe('click', function(){
								$(this).up('.panel.definitionGroup').down('.panel-body')
									.insert({'bottom': tmp.me.bodyRow = tmp.me._getNewDefinitionBodyRow()});
								$(this).up('.btn-group').removeClassName('btn-group');
								$(this).hide();
								tmp.me.bodyRow.down('[save-def-item="definitionRow"]').click();
							})
						})
						.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-sm'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-floppy-remove'})})
							.observe('click', function(){
								$(this).up('.panel.definitionGroup').remove();
							})
						})
					})
				})
			})
			.insert({'bottom': new Element('div', {'class': 'panel-body'})
			});
		$(tmp.me._htmlIds.definitionsContainerInner).insert({'top': tmp.newDiv}).down('input[save-def-item="type"]').click();
	}
	,_getDefinitionsContainer: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDIv = new Element('div', {'id': tmp.me._htmlIds.definitionsContainer})
			.insert({'bottom': new Element('div', {'class': 'row', 'id': tmp.me._htmlIds.definitionsContainerInner}) })
			.insert({'bottom': new Element('div', {'class': 'row pull-right btn-group'})
				.insert({'bottom': new Element('div', {'class': 'btn btn-md btn-info btn-new-definitionGroup'})
					.insert({'bottom': new Element('i', {'class': 'fa fa-plus'}).update('&nbsp;&nbsp;New Definition Type') })
					.observe('click', function(){
						tmp.me._getNewDefinitionGroup();
						$(tmp.me._htmlIds.definitionsContainerInner).down('[save-def-item="type"]').click();
					})
				})
				.insert({'bottom': new Element('div', {'class': 'btn btn-md btn-success btn-save-definitionGroup'})
					.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-floppy-disk'}).update('  Save') })
					.observe('click', function(){
						tmp.me._saveWord();
					})
				})
			})
		$(tmp.me._htmlIds.itemDiv).update(tmp.newDIv);
	}
	/**
	 * Ajex: get all Definition Types
	 */
	,_getDefinitionTypes: function() {
		var tmp = {};
		tmp.me = this;
		tmp.me.postAjax(tmp.me.getCallbackId('getDefTypes'), {}, {
			'onLoading': function() {
				$(tmp.me._htmlIds.itemDiv).update(tmp.loadingImg = tmp.me.getLoadingImg());
			}
			,'onSuccess': function(sender, param){
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					if(!tmp.result.items)
						throw 'errror';
					tmp.me_definitionTypes = tmp.result.items;
					tmp.me._getDefinitionsContainer();
					$(tmp.me._htmlIds.definitionsContainer).down('.btn.btn-new-definitionGroup').click();
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
			,'onComplete': function() {
				tmp.loadingImg.remove();
			}
		});
	}
	,selectVideo: function() {
		var tmp = {};
		tmp.me = this;
		tmp.me._getDefinitionTypes();
	}
	,_loadUploader: function(){
		var tmp = {};
		tmp.me = this;
		tmp.fileSizeLimit = 1000000/*1MB*/ * 500;
		tmp.uploader = jQuery('#fileupload').fileupload({
			url: '/fileUploader/'
			,type: 'POST'
			,dataType: 'JSON'
			,formAcceptCharset: 'utf-8'
			,maxFileSize: tmp.fileSizeLimit
			,add: function(e, data) {
	                tmp.uploadErrors = [];
	                // Video Type Limit
	                tmp.acceptFileTypes = /^video\/(mp4)$/i; // only take mp4 so far since it's well browser supported
	                if(data.originalFiles && data.originalFiles.length != 1) {
	                	tmp.me.showModalBox('Invalid File Quantity', 'Only one file per upload');
	                }
	                if(data.originalFiles[0]['type'].length && !tmp.acceptFileTypes.test(data.originalFiles[0]['type'])) {
	                	tmp.me.showModalBox('Invalid File Type', 'Not an accepted file type');
	                }
	                // Video Size Limit
	                if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > tmp.fileSizeLimit) {
	                	tmp.me.showModalBox('Invalid File Size', 'Filesize is too big');
	                }
	                if(tmp.uploadErrors.length == 0) {
	                    data.submit();
	                }
	        }
			,done: function(event, data) {
				$(tmp.me._htmlIds.uploaderDivId).update('')
					.insert({'bottom': new Element('div', {'class': 'row'})
						.insert({'bottom': new Element('video', {'width': 320, 'height': 240, 'controls': true})
							.insert({'bottom': new Element('source', {'src': data._response.result.asset.url, 'type': data._response.result.asset.mimeType}) })
						})
					})
					.insert({'bottom': new Element('div', {'class': 'row'})
						.insert({'bottom': new Element('span', {'class': 'btn-group'})
							.insert({'bottom': new Element('span', {'class': 'btn btn-md btn-success btn-save-video'})
								.insert({'bottom': new Element('span', {'class': 'fa fa-check'})})
								.observe('click', function(){
									if(!data._response.result.video.id || !data._response.result.asset.id)
										tmp.me.showModalBox('SYSTEM ERROR', 'Invalid video uploader response.');
									tmp.me._video = data._response.result.video;
									tmp.me._asset = data._response.result.asset;
									tmp.me.selectVideo();
								})
							})
							.insert({'bottom': new Element('span', {'class': 'btn btn-md btn-danger btn-cancel-video'})
								.insert({'bottom': new Element('span', {'class': 'fa fa-times'})})
								.observe('click', function(){
									tmp.me.showModalBox('Notice', 'You Canceled the video you just uploaded.');
									tmp.me.selectWord();
								})
							})
						})
					})
			}
			,fail: function (e, data) {
				tmp.message = '';
	            jQuery.each(data.messages, function (index, error) {
	            	tmp.me.showModalBox('Error', '<p style="color: red;">Upload file error: ' + error + '<i class="elusive-remove" style="padding-left:10px;"/></p>');
	            });
	        }
			,progressall: function (e, data) {
		        tmp.progress = parseInt(data.loaded / data.total * 100, 10);
		        jQuery('#progress .bar').css(
		            'width',
		            tmp.progress + '%'
		        );
		    }
		});
		
		return tmp.me;
	}
	,_getVideoUploadPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.uploaderDiv = new Element('div', {'class': 'uploader panel-body', 'id': tmp.me._htmlIds.uploaderDivId})
			.insert({'bottom': new Element('input', {'id': 'fileupload', 'type': 'file', 'name': "file"}) })
			.insert({'bottom': new Element('div', {'id': 'progress', 'style': 'width: 100%; border: 1px solid black; height: 10px;'})
				.insert({'bottom': new Element('div', {'class': 'bar', 'style': 'width: 1%; height: 100%; background-color: blue;'}) })
			});
		$(tmp.me._htmlIds.itemDiv)
			.insert({'bottom': new Element('div', {'class': 'panel panel-default'}) 
				.insert({'bottom': new Element('div', {'class': 'panel-heading'}).update('New Video') })
				.insert({'bottom': tmp.uploaderDiv})
			});
		tmp.me._loadUploader();
		
		return tmp.me;
	}
	,selectWord() {
		var tmp = {};
		tmp.me = this;
		if(tmp.me._word.id === 'NEW') {
			$(tmp.me._htmlIds.itemDiv).update('');
			tmp.me._getVideoUploadPanel();
		}
	}
	,_getNewWordRow(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.tbody = btn.up('.table').down('tbody');
		tmp.tbody.update().insert({'bottom': tmp.me._getWordEditPanel()}).down('[save-item-panel="name"]').click();
		
		return tmp.me;
	}
	,_getWordEditPanel: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'})
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'id', 'value': tmp.me._word.id ? tmp.me._word.id : 'NEW'}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'categoryId', 'value': tmp.me._category.id}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'languageId', 'value': tmp.me._language.id}) })
			.insert({'bottom': new Element('td', {'class': 'form-group', 'colspan': 2})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The Name of the Word', 'save-item-panel': 'name', 'value': tmp.me._word.name ? tmp.me._word.name : ''}) })
				.observe('click',function(){
					$(this).down('input').select();
					$(this).down('input').focus();
				})
				.observe('keydown', function(event){
					tmp.btn = $(this);
					tmp.me.keydown(event, function() {
						tmp.btn.up('.save-item-panel').down('.btn.btn-save-word').click();
					});
					return false;
				})
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'disabled': true, 'title': 'Category Name', 'save-item-panel': 'categoryName', 'value': tmp.me._category.name}) })
			})
			.insert({'bottom': new Element('td', {'class': 'form-group'})
				.insert({'bottom': new Element('input', {'class': 'form-control', 'disabled': true, 'title': 'Language Name', 'save-item-panel': 'languageName', 'value': tmp.me._language.name}) })
			})
			.insert({'bottom': new Element('td')
				.insert({'bottom': (tmp.isTitle === true ? word.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': tmp.me._word.active ? tmp.me._word.active : true}) ) })
			})
			.insert({'bottom': new Element('td', {'class': 'text-right'})
				.insert({'bottom':  new Element('span', {'class': 'btn-group btn-group-sm'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success btn-save-word', 'title': 'Save'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.me._word = tmp.me._collectFormData($(tmp.btn).up('.save-item-panel'), 'save-item-panel');
							tmp.me.selectWord();
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-remove'}) })
						.observe('click', function(){
							if(tmp.me._word.id)
								$(this).up('.save-item-panel').replace(tmp.me._getWordEditPanel().addClassName('item_row').writeAttribute('item_id', tmp.me._word.id) );
							else
								$(this).up('.save-item-panel').remove();
						})
					})
				})
			});
		if(tmp.me._word.id)
			tmp.newDiv.addClassName('item_row').writeAttribute('item_id', tmp.me._word.id);
		return tmp.newDiv;
	}
	/**
	 * Getting the Word row for displaying the searching result
	 */
	,_getWordRow: function(word, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitle || false);
		tmp.tag = (tmp.isTitle === true ? 'th': 'td');
		tmp.newDiv = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (word.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : word.id)}).store('data', word)
			.insert({'bottom': new Element(tmp.tag, {'class': tmp.isTitle ? 'hidden' : ''})
				.insert({'bottom': (tmp.isTitle === true ? '&nbsp;':
					new Element('span', {'class': 'btn btn-primary btn-xs'}).update('select')	
					.observe('click', function(){
						tmp.me.selectWord(word);
					})
				) })
			})
			.insert({'bottom': new Element(tmp.tag, {'colspan': tmp.isTitle ? 2 : 1}).update(word.name) })
			.insert({'bottom': new Element(tmp.tag).update(tmp.isTitle === true ? 'Category' : tmp.me._category.name) })
			.insert({'bottom': new Element(tmp.tag).update(tmp.isTitle === true ? 'Language' : tmp.me._language.name) })
			.insert({'bottom': new Element(tmp.tag)
				.insert({'bottom': (tmp.isTitle === true ? word.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': word.active}) ) })
			})
			.insert({'bottom': tmp.isTitle !== true ? '' : new Element(tmp.tag, {'id': tmp.me._htmlIds.newWordBtn, 'class': 'text-right'})
				.insert({'bottom': new Element('a', {'class': 'btn btn-success btn-xs'})
					.insert({'bottom': new Element('span', {'class': 'fa fa-plus'})})
				})
				.observe('click', function(){
					tmp.me._getNewWordRow($(this));
				})
			})
			;
		return tmp.newDiv;
	}
	/**
	 * Ajax: searching the Word
	 */
	,_searchWord: function (txtbox) {
		var tmp = {};
		tmp.me = this;
		tmp.searchTxt = $F(txtbox).strip();
		tmp.searchPanel = $(txtbox).up('#' + tmp.me._htmlIds.searchPanel);
		tmp.me.postAjax(tmp.me.getCallbackId('searchWord'), {'searchTxt': tmp.searchTxt}, {
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
								.insert({'bottom': tmp.me._getWordRow({'name': 'Name', 'active': 'Active?'}, true)  })
							})
							.insert({'bottom': tmp.listDiv = new Element('tbody') })
						})
					});
					tmp.result.items.each(function(item) {
						tmp.listDiv.insert({'bottom': tmp.me._getWordRow(item) });
					});
				} catch (e) {
					$(tmp.searchPanel).insert({'bottom': new Element('div', {'class': 'panel-body'}).update(tmp.me.getAlertBox('ERROR', e).addClassName('alert-danger')) });
				}
			}
		});
		return tmp.me;
	}
	,_getWordListPanel: function(){
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'id': tmp.me._htmlIds.searchPanel, 'class': 'panel panel-default search-panel'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading form-inline'})
				.insert({'bottom': new Element('strong').update('Select the Word to Edit: ') })
				.insert({'bottom': new Element('span', {'class': 'input-group col-sm-6'})
					.insert({'bottom': new Element('input', {'class': 'form-control search-txt init-focus', 'placeholder': 'the Name of Word ...'}) 
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
								tmp.me._searchWord(tmp.txtBox);
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
	,selectCategory: function(category) {
		var tmp = {};
		tmp.me = this;
		tmp.me._category = category;
		tmp.me._language = category.language;
		$(tmp.me._htmlIds.itemDiv).update(tmp.wordPanel = tmp.me._getWordListPanel());
		tmp.wordPanel.down('input.search-txt').focus();
		return tmp.me;
	}
	/**
	 * Getting the Category row for displaying the searching result
	 */
	,_getCategoryRow: function(category, isTitle) {
		var tmp = {};
		tmp.me = this;
		tmp.isTitle = (isTitle || false);
		tmp.tag = (tmp.isTitle === true ? 'th': 'td');
		tmp.newDiv = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'btn-hide-row item_row') + (category.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : category.id)}).store('data', category)
			.insert({'bottom': new Element(tmp.tag)
				.insert({'bottom': (tmp.isTitle === true ? '&nbsp;':
					new Element('span', {'class': 'btn btn-primary btn-xs'}).update('select')	
					.observe('click', function(){
						tmp.me.selectCategory(category);
					})
				) })
			})
			.insert({'bottom': new Element(tmp.tag).update(category.name) })
			.insert({'bottom': new Element(tmp.tag).update(category.language.name) })
			.insert({'bottom': new Element(tmp.tag)
				.insert({'bottom': (tmp.isTitle === true ? category.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': category.active}) ) })
			})
		;
		return tmp.newDiv;
	}
	/**
	 * Ajax: searching the Category
	 */
	,_searchCategory: function (txtbox) {
		var tmp = {};
		tmp.me = this;
		tmp.searchTxt = $F(txtbox).strip();
		tmp.searchPanel = $(txtbox).up('#' + tmp.me._htmlIds.searchPanel);
		tmp.me.postAjax(tmp.me.getCallbackId('searchCategory'), {'searchTxt': tmp.searchTxt}, {
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
								.insert({'bottom': tmp.me._getCategoryRow({'name': 'Name', 'active': 'Active?', 'language': {'name': 'Language'}}, true)  })
							})
							.insert({'bottom': tmp.listDiv = new Element('tbody') })
						})
					});
					tmp.result.items.each(function(item) {
						tmp.listDiv.insert({'bottom': tmp.me._getCategoryRow(item) });
					});
				} catch (e) {
					$(tmp.searchPanel).insert({'bottom': new Element('div', {'class': 'panel-body'}).update(tmp.me.getAlertBox('ERROR', e).addClassName('alert-danger')) });
				}
			}
		});
		return tmp.me;
	}
	/**
	 * Getting the Category list panel
	 */
	,_getCategoryListPanel: function () {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'id': tmp.me._htmlIds.searchPanel, 'class': 'panel panel-default search-panel'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading form-inline'})
				.insert({'bottom': new Element('strong').update('Select the Category for the Word: ') })
				.insert({'bottom': new Element('span', {'class': 'input-group col-sm-6'})
					.insert({'bottom': new Element('input', {'class': 'form-control search-txt init-focus', 'placeholder': 'the Name of Category ...'}) 
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
								tmp.me._searchCategory(tmp.txtBox);
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
	,init: function(category) {
		var tmp = {};
		tmp.me = this;
		tmp.category = (category || false);
		if(tmp.category) {
			tmp.me.selectCategory(category);
			tmp.me._category = tmp.category;
		} else {
			$(tmp.me._htmlIds.itemDiv).update(tmp.me._getCategoryListPanel());
		}
		if($$('.init-focus').size() > 0){
			$$('.init-focus').first().focus();
		}
		return tmp.me;
	}
});