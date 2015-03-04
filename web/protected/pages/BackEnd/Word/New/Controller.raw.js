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
	,_videos: []
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
		tmp.me._htmlIds.breadcrumb = 'breadcrumb';
		return this;
	}
	,_saveWord: function() {
		var tmp = {};
		tmp.me = this;
		
		tmp.data = [];
		$(tmp.me._htmlIds.definitionsContainerInner).getElementsBySelector('.definitionGroup').each(function(group){
			tmp.type = $F($(group).down('.panel-heading [save-def-item="type"]'));
			tmp.videoId = $(group).up('.video-container').readAttribute('videoid');
			tmp.typeId = $F($(group).down('.panel-heading [save-def-item="typeId"]'));
			tmp.typeValid = $(group).visible();
			if(!tmp.type.empty()) {
				tmp.formType = tmp.type;
				tmp.formRows = [];
				$(group).getElementsBySelector('.panel-body .row.definitionRow').each(function(defRow){
					tmp.row = $F($(defRow).down('[save-def-item="definitionRow"]'));
					tmp.rowId = $F($(defRow).down('[save-def-item="definitionId"]'));
					tmp.order = $F($(defRow).down('[save-def-item="definitionOrder"]'));
					tmp.rowValid = $(defRow).visible();
					if(!tmp.row.empty())
						tmp.formRows.push ({'def': tmp.row, 'id': tmp.rowId, 'order': tmp.order, 'valid': tmp.rowValid});
				});
				tmp.data.push({'type': tmp.formType, 'id': tmp.typeId, 'videoId': tmp.videoId, 'rows': tmp.formRows, 'valid': tmp.typeValid});
			}
		});
		tmp.nothing = true;
		tmp.data.each(function(item){
			if(item.valid === true && item.rows.length > 0)
				tmp.nothing = false;
		})
		if(tmp.nothing === true) {
			tmp.me.showModalBox('Notice', '<h4>There has to be <b>at least</b> one definition for word "' + tmp.me._word.name + '"</h4>');
			return tmp.me;
		}
		tmp.me.postAjax(tmp.me.getCallbackId('saveWord'), {'definitions': tmp.data, 'videos': tmp.me._videos, 'word': tmp.me._word}, {
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
						tmp.me.showModalBox('Success','<h4>Word Saved Successfully</h4>');
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
	,_getNewDefinitionBodyRow: function(definition) {
		var tmp = {};
		tmp.me = this;
		tmp.definition = (definition || false);
		tmp.newDiv = new Element('div', {'class': 'row definitionRow'}).setStyle('padding-bottom: 10px;')
			.insert({'bottom': new Element('span', {'class': 'col-md-8'}) 
				.insert({'bottom': new Element('input', {'save-def-item': 'definitionId', 'type': 'text', 'value': (tmp.definition === false ? '' : tmp.definition.id)}).setStyle('display: none;') })
				.insert({'bottom': new Element('input', {'save-def-item': 'definitionRow', 'type': 'text', 'placeholder': 'Definition', 'title': 'Definition', 'value': (tmp.definition === false ? '' : tmp.definition.content)}).setStyle('width: 60%;')
					.observe('keydown', function(event){
						tmp.btn = $(this);
						tmp.me.keydown(event, function() {
							tmp.btn.up('.row.definitionRow').down('[save-def-item="definitionOrder"]').focus();
							tmp.btn.up('.row.definitionRow').down('[save-def-item="definitionOrder"]').select();
						});
						return false;
					})
				})
			})
			.insert({'bottom': new Element('span', {'class': 'col-md-2'}) 
				.insert({'bottom': new Element('input', {'save-def-item': 'definitionOrder', 'type': 'value', 'placeholder': 'Order (optional)', 'title': 'Order (optional)', 'value': (tmp.definition === false ? '' : tmp.definition.sequence)}).setStyle('width: 60%;')
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
							if($F($(this).up('.row.definitionRow').down('[save-def-item="definitionRow"]')).empty())
								$(this).up('.row.definitionRow').down('[save-def-item="definitionRow"]').focus();
							else {
								$(this).up('.panel.definitionGroup').getElementsBySelector('.row.definitionRow').each(function(item){item.addClassName('btn-hide-row');});
								$(this).up('.panel.definitionGroup').down('.panel-body')
									.insert({'bottom': tmp.newDefRow = tmp.me._getNewDefinitionBodyRow()});
								tmp.newDefRow.down('[save-def-item="definitionRow"]').focus();
								tmp.newDefRow.down('[save-def-item="definitionRow"]').select();
							}
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-xs'})
						.insert({'bottom': new Element('i', {'class': 'fa fa-times'})})
						.observe('click', function(){
							$(this).up('.row.definitionRow').hide();
						})
					})
				})
			});
		return tmp.newDiv;
	}
	,_getNewDefinitionGroup: function(definition) {
		var tmp = {};
		tmp.me = this;
		tmp.definition = (definition || false);
		tmp.newDiv = new Element('div', {'class': 'panel panel-default definitionGroup'})
			.insert({'bottom': new Element('div', {'class': 'panel-heading'})
				.insert({'bottom': new Element('div', {'class': 'row'})
					.insert({'bottom': new Element('input', {'save-def-item': 'typeId', 'type': 'text', 'value': (tmp.definition === false ? '' : tmp.definition.definitionType.id)}).setStyle('display: none;') })
					.insert({'bottom': new Element('input', {'save-def-item': 'type', 'type': 'text', 'placeholder': 'the Type of Definition', 'value': (tmp.definition === false ? '' : tmp.definition.definitionType.name)}).setStyle('width: 60%;')
						.observe('keydown', function(event){
							tmp.btn = $(this);
							tmp.me.keydown(event, function() {
								tmp.btn.up('.panel-heading').down('.btn-save-def-type').click();
							});
							return false;
						})
						.wrap(new Element('span', {'class': 'col-md-8'})) 
					})
					.insert({'bottom': new Element('span', {'class': 'col-md-4 btn-group pull-right'})
						.insert({'bottom': new Element('span', {'class': 'btn btn-success btn-xs btn-save-def-type pull-right'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-floppy-saved'})})
							.observe('click', function(){
								if($F($(this).up('.panel-heading').down('[save-def-item="type"]')).empty())
									$(this).up('.panel-heading').down('[save-def-item="type"]').focus();
								else {
									$(this).up('.panel.definitionGroup').down('.panel-body')
										.insert({'bottom': tmp.me.bodyRow = tmp.me._getNewDefinitionBodyRow()});
									tmp.me.bodyRow.down('[save-def-item="definitionRow"]').focus();
									tmp.me.bodyRow.down('[save-def-item="definitionRow"]').select();
								}
							})
						})
						.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-xs pull-right'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-floppy-remove'})})
							.observe('click', function(){
								$(this).up('.panel.definitionGroup').hide();
							})
						})
					})
				})
			})
			.insert({'bottom': new Element('div', {'class': 'panel-body'}) });
		return tmp.newDiv;
	}
	,_getDefinitionsContainer: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDIv = new Element('div', {'id': tmp.me._htmlIds.definitionsContainer})
			.insert({'bottom': new Element('div', {'class': 'row'})
				.insert({'bottom': new Element('span', {'class': 'btn btn-sm btn-success pull-right'}).setStyle('margin-right: 5%;')
					.insert({'bottom': new Element('span').update('Save Word')})
					.observe('click', function(){
						tmp.me._saveWord();
					})
				})
			})
			.insert({'bottom': new Element('div', {'id': tmp.me._htmlIds.definitionsContainerInner}) 
				.insert({'bottom': new Element('div', {'class': 'row video-container panel panel-sucess', 'videoid': 'ALL'}).setStyle(tmp.me._videos.length > 1 ? 'box-shadow: 0 1px 10px #70af00;' : 'box-shadow: unset;')
					.insert({'bottom': new Element('div', {'class': 'panel-body'})
						.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default btn-video-preview'}).setStyle(tmp.me._videos.length > 1 ? 'display:none;' : '')
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-play-circle'}) })
							.insert({'bottom': new Element('span').update('Preview video') })
							.observe('click', function(){
								tmp.videoEl = new Element('video', {'class': 'video-js vjs-default-skin vjs-big-play-centered', 'width': '100%', 'controls': true, 'preload': 'auto', 'autoplay': true, 'loop': true})
								.insert({'bottom': new Element('source', {'src': tmp.me._videos[0].src, 'type': tmp.me._videos[0].mimeType}) });
								tmp.me._signRandID(tmp.videoEl);
								tmp.me.showModalBox('Video Preview',tmp.videoEl);
								videojs($(tmp.videoEl.id), {}, function() { });
							})
						})
						.insert({'bottom': new Element('div', {'class': 'btn btn-xs btn-primary btn-new-definitionGroup pull-right'}).setStyle('margin-top: -22px;')
							.insert({'bottom': new Element('i', {'class': 'fa fa-plus'}).update('&nbsp;&nbsp;New Definition Type') })
							.observe('click', function(){
								$(this).insert({'after': tmp.newDefinitionGroup = tmp.me._getNewDefinitionGroup()});
								tmp.newDefinitionGroup.down('[save-def-item="type"]').focus();
							})
						})
					})
				})
			});
		$(tmp.me._htmlIds.itemDiv).update(tmp.newDIv);
		if(!jQuery.isNumeric(tmp.me._word.id)) { // when creating new word
			tmp.newDIv.down('.btn.btn-new-definitionGroup').click();
			$(tmp.me._htmlIds.definitionsContainer)
				.insert({'top': new Element('a', {'class': 'pull-right'}).setStyle(tmp.me._videos.length > 1 ? '' : 'display: none;')
					.update('Different definition for each video ? cleck here')
					.setStyle('cursor: pointer;')
					.observe('click', function(){
						$(this).up('.diff-link-row').hide();
						tmp.oldGroups = $(tmp.me._htmlIds.definitionsContainerInner).down('[videoid="ALL"]').remove();;
						tmp.me._videos.each(function(item){
							if(item.valid === true) {
								$(tmp.me._htmlIds.definitionsContainerInner)
									.insert({'bottom': new Element('div', {'class': 'row video-container panel panel-sucess', 'videoid': item.id}).setStyle(tmp.me._videos.length > 1 ? 'box-shadow: 0 1px 10px #70af00;' : 'box-shadow: unset;')
										.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default btn-video-preview'})
											.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-play-circle'}) })
											.insert({'bottom': new Element('span').update('Preview video') })
											.observe('click', function(){
												tmp.videoEl = new Element('video', {'class': 'video-js vjs-default-skin vjs-big-play-centered', 'width': '100%', 'controls': true, 'preload': 'auto', 'autoplay': true, 'loop': true})
												.insert({'bottom': new Element('source', {'src': item.src, 'type': item.mimeType}) });
												tmp.me._signRandID(tmp.videoEl);
												tmp.me.showModalBox('Video Preview',tmp.videoEl);
												videojs($(tmp.videoEl.id), {}, function() { });
											})
										})
										.insert({'bottom': new Element('div', {'class': 'panel-body'})
											.insert({'bottom': new Element('div', {'class': 'btn btn-xs btn-primary btn-new-definitionGroup pull-right'}).setStyle('margin-top: -2%;')
												.insert({'bottom': new Element('i', {'class': 'fa fa-plus'}).update('&nbsp;&nbsp;New Definition Type') })
												.observe('click', function(){
													$(this).insert({'after': tmp.newDefinitionGroup = tmp.me._getNewDefinitionGroup()});
													tmp.newDefinitionGroup.down('[save-def-item="type"]').focus();
												})
											})
											.insert({'bottom': tmp.me._getNewDefinitionGroup()})
										})
									});
							}
						});
						tmp.id = $(tmp.me._htmlIds.definitionsContainerInner).down('.video-container').readAttribute('videoid');
						$(tmp.me._htmlIds.definitionsContainerInner).down('.video-container').replace(tmp.oldGroups);
						tmp.previewEL = $(tmp.me._htmlIds.definitionsContainerInner).down('.video-container .btn.btn-video-preview');
						tmp.previewEL.remove();
						$(tmp.me._htmlIds.definitionsContainerInner).down('.video-container').insert({'top': tmp.previewEL});
						tmp.previewEL.show();
						$(tmp.me._htmlIds.definitionsContainerInner).down('.video-container').writeAttribute('videoid', tmp.id);
					})
					.wrap(new Element('div', {'class': 'row diff-link-row'}))
				});
		}
		else if(tmp.me._word.definitions && tmp.me._word.definitions.length > 0) { // when editing existing word
			tmp.me._videos.each(function(video){
				if(video.valid === true && $(tmp.me._htmlIds.definitionsContainerInner).down('.row.video-container[videoid="' + video.id + '"]') === undefined) {
					$(tmp.me._htmlIds.definitionsContainerInner)
					.insert({'bottom': new Element('div', {'class': 'row video-container panel panel-sucess', 'videoid': video.id}).setStyle('box-shadow: 0 1px 10px #70af00;')
						.insert({'bottom': new Element('span', {'class': 'btn btn-xs btn-default btn-video-preview'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-play-circle'}) })
							.insert({'bottom': new Element('span').update('Preview video') })
							.observe('click', function(){
								tmp.videoEl = new Element('video', {'class': 'video-js vjs-default-skin vjs-big-play-centered', 'width': 320, 'height': 240, 'controls': true, 'preload': 'auto', 'autoplay': true, 'loop': true})
								.insert({'bottom': new Element('source', {'src': video.src, 'type': video.mimeType}) });
								tmp.me._signRandID(tmp.videoEl);
								tmp.me.showModalBox('Video Preview',tmp.videoEl);
								videojs($(tmp.videoEl.id), {}, function() { });
							})
						})
						.insert({'bottom': new Element('div', {'class': 'panel-body'})
							.insert({'bottom': new Element('div', {'class': 'btn btn-xs btn-primary btn-new-definitionGroup pull-right'}).setStyle('margin-top: -2%;')
								.insert({'bottom': new Element('i', {'class': 'fa fa-plus'}).update('&nbsp;&nbsp;New Definition Type') })
								.observe('click', function(){
									$(this).insert({'after': tmp.newDefinitionGroup = tmp.me._getNewDefinitionGroup()});
									tmp.newDefinitionGroup.down('[save-def-item="type"]').focus();
								})
							})
						})
					});
				}
			});
			tmp.me._word.definitions.each(function(definition){
				tmp.valid = false;
				tmp.me._videos.each(function(video){
					if(tmp.valid === false && video.id === definition.video.id && video.valid === true)
						tmp.valid = true;
				});
				if(tmp.valid === true) {
					tmp.videoContainer = $(tmp.me._htmlIds.definitionsContainerInner).down('.row.video-container[videoid="' + definition.video.id + '"]');
					
					tmp.foundType = false;
					tmp.videoContainer.getElementsBySelector('[save-def-item="type"]').each(function(typeRow){
						if(tmp.foundType === false && $F(typeRow) == definition.definitionType.name) {
							tmp.foundType = true;
							tmp.order = typeRow.up('.panel.definitionGroup').down('.panel-body').down('[save-def-item="definitionOrder"]') ? $F(typeRow.up('.panel.definitionGroup').down('.panel-body').down('[save-def-item="definitionOrder"]')) : 0;
							if(parseInt(definition.sequence) > tmp.order)
								typeRow.up('.panel.definitionGroup').down('.panel-body').insert({'bottom': tmp.me._getNewDefinitionBodyRow(definition)});
							else
								typeRow.up('.panel.definitionGroup').down('.panel-body').insert({'top': tmp.me._getNewDefinitionBodyRow(definition)});
						}
					});
					if(tmp.foundType === false) {
						tmp.videoContainer.down('.panel-body').insert({'bottom': tmp.newDefinitionGroup = tmp.me._getNewDefinitionGroup(definition)});
						tmp.newDefinitionGroup.down('.panel-body').insert({'bottom': tmp.me._getNewDefinitionBodyRow(definition)});
					}
				}
			});
			$(tmp.me._htmlIds.definitionsContainerInner).down('.video-container[videoid="ALL"]').remove();
		}
		return tmp.me;
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
				} catch(e) {
					tmp.me.showModalBox('<span class="text-danger">ERROR</span>', e, true);
				}
			}
			,'onComplete': function() {
				tmp.loadingImg.remove();
			}
		});
	}
	,selectVideos: function() {
		var tmp = {};
		tmp.me = this;
		tmp.me._getDefinitionTypes();
		tmp.count = 0;
		tmp.me._videos.each(function(item){
			if(item.valid === true)
				tmp.count += 1;
		});
		$(tmp.me._htmlIds.breadcrumb).show().insert({'bottom': new Element('li').update(tmp.count + ' Video' + (tmp.count === 1 ? '' : 's') )});
	}
	,getVideoEl: function(source, type, width, height) {
		var tmp = {};
		tmp.me = this;
		tmp.width = (width || false);
		tmp.height = (height || false);
		tmp.videoEl =  new Element('video', {'class': 'video-js vjs-default-skin vjs-big-play-centered', 'controls': (jQuery(window).width() < 380 ? false : true), 'preload': 'auto', 'autoplay': true, 'loop': true})
			.insert({'bottom': new Element('source', {'src': source, 'type': type}) });
		if(jQuery(window).width() < 380)
			tmp.videoEl.writeAttribute('width', '90%');
		if(tmp.width !== false)
			tmp.videoEl.writeAttribute('width', tmp.width);
		if(tmp.height !== false)
			tmp.videoEl.writeAttribute('height', tmp.height);
		return tmp.videoEl;
	}
	,getVideoRow: function(container, video, asset){
		var tmp = {};
		tmp.me = this;
		container
			.insert({'bottom': new Element('div', {'class': 'row video-row', 'video-id': video.id})
				.insert({'bottom': new Element('div', {'class': 'col-md-4'})
					.insert({'bottom': tmp.videoEl = tmp.me.getVideoEl(video.asset.url, asset.mimeType) })
				})
				.insert({'bottom': new Element('div', {'class': 'col-md-8'})
					.insert({'bottom': new Element('div', {'class': 'row hidden-xs'}).update('<b>Asset</b>') })
					.insert({'bottom': tmp.assetKeyRow = new Element('div', {'class': 'row asset-key-row hidden-xs'}) })
					.insert({'bottom': tmp.assetValueRow = new Element('div', {'class': 'row asset-value-row hidden-xs'}) })
					.insert({'bottom': new Element('div', {'class': 'row clearfix hidden-xs'}).setStyle('border: 1px solid brown;') })
					.insert({'bottom': new Element('div', {'class': 'row hidden-xs'}).update('<b>Video</b>') })
					.insert({'bottom': tmp.videoKeyRow = new Element('div', {'class': 'row video-key-row hidden-xs'}) })
					.insert({'bottom': tmp.videoValueRow = new Element('div', {'class': 'row video-value-row hidden-xs'}) })
					.insert({'bottom': new Element('div', {'class': 'row btn-row text-right'}) 
						.insert({'bottom': new Element('div', {'class': 'btn btn-delete-video btn-danger btn-xs'})
							.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-trash'}) })
							.observe('click',function(){
								$(this).up('[video-id="' + video.id + '"]').hide();
							})
						})
					})
				})
			});
		tmp.me._signRandID(tmp.videoEl);
		videojs($(tmp.videoEl.id), {}, function() { });
		$H(video.asset).each(function(item){
			tmp.assetKeyRow.insert({'bottom': new Element('span', {'class': ((item.key == 'filename' || item.key == 'assetId')  ? 'col-md-3' : 'col-md-1'), 'title': item.key}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: clip;').update(item.key)});
			tmp.assetValueRow.insert({'bottom': new Element('span', {'class': ((item.key == 'filename' || item.key == 'assetId') ? 'col-md-3' : 'col-md-1'), 'title': item.value}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: ellipsis;').update(item.value)
				.observe('dblclick', function(){
					tmp.me.showModalBox(item.key, tmp.txtArea = new Element('input', {'value': item.value}).setStyle('width: 100%;').observe('keyup',function(){tmp.txtArea.value = item.value;}));
					tmp.txtArea.focus(); tmp.txtArea.select();
				})
			});
		});
		$H(video).each(function(item){
			tmp.videoKeyRow.insert({'bottom': new Element('span', {'class': 'col-md-1', 'title': item.key}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: clip;').update(item.key)});
			tmp.videoValueRow.insert({'bottom': new Element('span', {'class': 'col-md-1', 'title': item.value}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: ellipsis;').update(item.value)
				.observe('dblclick', function(){
					tmp.me.showModalBox(item.key, tmp.txtArea = new Element('input', {'value': item.value}).setStyle('width: 100%;').observe('keyup',function(){tmp.txtArea.value = item.value;}));
					tmp.txtArea.focus(); tmp.txtArea.select();
				})
			});
		});
		tmp.videoValueRow.insert({'top': new Element('input', {'value': video.id, 'save-item': 'videoId'}).setStyle('display:none;')});
		tmp.videoValueRow.insert({'top': new Element('input', {'value': video.asset.url, 'save-item': 'videoSrc'}).setStyle('display:none;')});
		tmp.videoValueRow.insert({'top': new Element('input', {'value': video.asset.mimeType, 'save-item': 'mimeType'}).setStyle('display:none;')});
		
		return tmp.me;
	}
	,_loadUploader: function(){
		var tmp = {};
		tmp.me = this;
		tmp.fileSizeLimit = 1000000/*1MB*/ * 50;
		tmp.uploader = jQuery('#fileupload').fileupload({
			url: '/fileUploader/'
			,type: 'POST'
			,dataType: 'JSON'
			,formAcceptCharset: 'utf-8'
			,maxFileSize: tmp.fileSizeLimit
			,add: function(e, data) {
	                tmp.uploadErrors = [];
//	                tmp.me.showModalBox('Type', data.originalFiles[0]['type']);
//	                return tmp.me;
	                
	                tmp.acceptFileTypes = /^video\/(mp4|x-ms-wmv|quicktime)$/i; // only take mp4 so far since it's well browser supported
	                // Only one file each time
	                if(data.originalFiles && data.originalFiles.length != 1) {
	                	tmp.me.showModalBox('Invalid File Quantity', 'Only one file per upload');
	                	return tmp.me;
	                }
	                // Video Type Limit
	                if(data.originalFiles[0]['type'].length && !tmp.acceptFileTypes.test(data.originalFiles[0]['type'])) {
	                	tmp.me.showModalBox('Invalid File Type', 'Not an accepted file type');
	                	return tmp.me;
	                }
	                // Video Size Limit
	                if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > tmp.fileSizeLimit) {
	                	tmp.me.showModalBox('Invalid File Size', 'File is too big');
	                	return tmp.me;
	                }
	                if(tmp.uploadErrors.length == 0) {
	                    data.submit();
	                }
	        }
			,done: function(event, data) {
				jQuery('#progress .bar').css(
			            'width', '0%'
			        );
				tmp.me.getVideoRow($(tmp.me._htmlIds.uploaderDivId).down('.panel-body'), data._response.result.video, data._response.result.video.asset);
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
		$(tmp.me._htmlIds.itemDiv)
			.insert({'bottom': new Element('div', {'class': 'panel panel-default', 'id': tmp.me._htmlIds.uploaderDivId}) 
				.insert({'bottom': new Element('div', {'class': 'panel-head'}) })
				.insert({'bottom': new Element('div', {'class': 'panel-body'}) })
			});
		
		$(tmp.me._htmlIds.uploaderDivId).down('.panel-head')
			.insert({'bottom': new Element('div')
				.insert({'bottom': new Element('strong').update('New Video') })
				.insert({'bottom': new Element('span', {'class': 'btn btn-sm btn-success pull-right btn-save-videos'})
					.insert({'bottom': new Element('span').update('Confirm Videos') })
					.observe('click', function(){
						$(tmp.me._htmlIds.uploaderDivId).getElementsBySelector('.video-row').each(function(row){
							tmp.me._videos.push({'id': tmp.me._collectFormData(row,'save-item').videoId, 'src': tmp.me._collectFormData(row,'save-item').videoSrc, 'mimeType': tmp.me._collectFormData(row,'save-item').mimeType, 'valid': row.visible()})
						})
						if(!pageJs._videos.length)
							tmp.me.showModalBox('Notice','<h4>Please upload <b>at least one video</b></h4>');
						else {
							$(this).down('span').update('loading...');
							$(this).writeAttribute('disabled',true)
							tmp.me.selectVideos();
						}
					})
				})
			})
			.insert({'bottom': tmp.me.getUploaderDiv()});
		
		tmp.me._loadUploader();
		
		if(pageJs._word.videos && pageJs._word.videos .length > 0) {
			pageJs._word.videos.each(function(video){
				tmp.me.getVideoRow($(tmp.me._htmlIds.uploaderDivId).down('.panel-body'), video, video.asset);
			});
		}
		
		return tmp.me;
	}
	,getUploaderDiv: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'uploader', 'id': tmp.me.uploaderDivId})
			.insert({'bottom': new Element('input', {'id': 'fileupload', 'type': 'file', 'name': "file"}) })
			.insert({'bottom': new Element('div', {'id': 'progress', 'style': 'width: 100%; border: 1px solid black; height: 10px;'})
				.insert({'bottom': new Element('div', {'class': 'bar', 'style': 'width: 0%; height: 100%; background-color: blue;'}) })
			});
		return tmp.newDiv;
	}
	,selectWord: function(word) {
		var tmp = {};
		tmp.me = this;
		tmp.word = (word || false);
		if(tmp.me._word.id === 'NEW') {
			$(tmp.me._htmlIds.itemDiv).update('');
			tmp.me._getVideoUploadPanel();
		} else if(!word.id.empty()){
			word.categoryId = tmp.me._category.id;
			word.categoryName = tmp.me._category.name;
			word.languageId = tmp.me._language.id;
			word.languageName = tmp.me._language.name;
			tmp.me._word = word;
			$(tmp.me._htmlIds.itemDiv).update('');
			tmp.me._getVideoUploadPanel();
		} else return;
		
		$(tmp.me._htmlIds.breadcrumb).show().insert({'bottom': new Element('li').update('Word: ' + tmp.me._word.name)});
		
		return tmp.me;
	}
	,_getNewWordRow: function(btn) {
		var tmp = {};
		tmp.me = this;
		tmp.tbody = btn.up('.table').down('tbody');
		tmp.searchTxt = $F($(tmp.me._htmlIds.searchPanel).down('input.search-txt'));
		tmp.tbody.update().insert({'bottom': tmp.me._getNewWordPanel(tmp.searchTxt)}).down('[save-item-panel="name"]').select();
		
		return tmp.me;
	}
	,_getNewWordPanel: function(searchTxt) {
		var tmp = {};
		tmp.me = this;
		tmp.searchTxt = (searchTxt || '')
		tmp.newDiv = new Element('tr', {'class': 'save-item-panel info'})
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'id', 'value': tmp.me._word.id ? tmp.me._word.id : 'NEW'}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'categoryId', 'value': tmp.me._category.id}) })
			.insert({'bottom': new Element('input', {'type': 'hidden', 'save-item-panel': 'languageId', 'value': tmp.me._language.id}) })
			.insert({'bottom': new Element('td', {'class': 'form-group', 'colspan': 2})
				.insert({'bottom': new Element('input', {'required': true, 'class': 'form-control', 'placeholder': 'The Name of the Word', 'save-item-panel': 'name', 'value': tmp.me._word.name ? tmp.me._word.name : tmp.searchTxt}) })
				.observe('keydown', function(event){
					tmp.btn = $(this);
					tmp.me.keydown(event, function() {
						tmp.btn.up('.save-item-panel').down('.btn.btn-save-word').select();
						tmp.btn.up('.save-item-panel').down('.btn.btn-save-word').focus();
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
			.insert({'bottom': new Element('td', {'class': 'hidden'})
				.insert({'bottom': (tmp.isTitle === true ? word.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': tmp.me._word.active ? tmp.me._word.active : true}) ) })
			})
			.insert({'bottom': new Element('td', {'class': 'text-right'})
				.insert({'bottom':  new Element('span', {'class': 'btn-group'})
					.insert({'bottom': new Element('span', {'class': 'btn btn-success btn-save-word btn-responsive btn-sm', 'title': 'Save'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-ok'}) })
						.observe('click', function(){
							tmp.btn = this;
							tmp.me._word = tmp.me._collectFormData($(tmp.btn).up('.save-item-panel'), 'save-item-panel');
							tmp.me.selectWord();
						})
					})
					.insert({'bottom': new Element('span', {'class': 'btn btn-danger btn-responsive btn-sm', 'title': 'Delete'})
						.insert({'bottom': new Element('span', {'class': 'glyphicon glyphicon-remove'}) })
						.observe('click', function(){
							if(tmp.me._word.id)
								$(this).up('.save-item-panel').replace(tmp.me._getNewWordPanel().addClassName('item_row').writeAttribute('item_id', tmp.me._word.id) );
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
		tmp.newDiv = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'item_row') + (word.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : word.id)}).store('data', word)
			.insert({'bottom': new Element(tmp.tag, {'class': tmp.isTitle ? 'hidden' : ''})
				.insert({'bottom': (tmp.isTitle === true ? '&nbsp;':
					new Element('span', {'class': 'btn btn-primary btn-xs'}).update('select')	
					.observe('click', function(){
						tmp.me.selectWord(word);
					})
				) })
			})
			.insert({'bottom': new Element(tmp.tag).update('').setStyle(tmp.isTitle ? '' : 'display:none;') })
			.insert({'bottom': new Element(tmp.tag, {'colspan': 1}).update(word.name) })
			.insert({'bottom': new Element(tmp.tag).update(tmp.isTitle === true ? 'Category' : tmp.me._category.name) })
			.insert({'bottom': new Element(tmp.tag).update(tmp.isTitle === true ? 'Language' : tmp.me._language.name) })
			.insert({'bottom': new Element(tmp.tag, {'class': 'hidden'})
				.insert({'bottom': (tmp.isTitle === true ? word.active : new Element('input', {'type': 'checkbox', 'disabled': true, 'checked': word.active}) ) })
			})
			.insert({'bottom': tmp.isTitle !== true ? '' : new Element(tmp.tag, {'id': tmp.me._htmlIds.newWordBtn, 'class': 'text-right'}).setStyle('display: none;')
				.insert({'bottom': new Element('a', {'class': 'btn btn-success btn-xs btn-responsive'})
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
					if(tmp.result.items.length > 0) {
						tmp.result.items.each(function(item) {
							tmp.listDiv.insert({'bottom': tmp.me._getWordRow(item) });
						});
					} else {
						$(tmp.me._htmlIds.newWordBtn).show();
					}
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
			})
			;
		return tmp.newDiv;
	}
	,selectCategory: function(category) {
		var tmp = {};
		tmp.me = this;
		tmp.me._category = category;
		tmp.me._language = category.language;
		$(tmp.me._htmlIds.breadcrumb).show().insert({'bottom': new Element('li').update('Category: ' + category.name)});
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
		tmp.newDiv = new Element('tr', {'class': (tmp.isTitle === true ? 'item_top_row' : 'item_row') + (category.active == 0 ? ' danger' : ''), 'item_id': (tmp.isTitle === true ? '' : category.id)}).store('data', category)
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
				.insert({'bottom': new Element('span').update('Search for ') })
				.insert({'bottom': new Element('strong').update('Sign Language: ') })
				.insert({'bottom': new Element('span', {'class': 'input-group col-sm-6'})
					.insert({'bottom': new Element('input', {'title': 'Name of Sign Language', 'class': 'form-control search-txt init-focus', 'placeholder': 'the Name of Sign Language ...'}) 
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