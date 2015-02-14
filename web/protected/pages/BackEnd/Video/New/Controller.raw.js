/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	uploaderDivId: '' //the html id of the uploader div
	,_getTitleRowData: function() {
		return {'name': "Name", 'code': 'Code', 'active': 'Active?'};
	}
	,setHTMLIds: function(uploaderContainerId, uploaderDivId) {
		this.uploaderContainerId = uploaderContainerId;
		this.uploaderDivId = uploaderDivId;
		return this;
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
				console.debug(data);
				jQuery('#progress .bar').css(
			            'width', '0%'
			        );
				$(tmp.me.uploaderContainerId).down('.panel-body')
					.insert({'bottom': new Element('div', {'class': 'row', 'video-id': data._response.result.video.id})
						.insert({'bottom': new Element('div', {'class': 'col-md-4'})
							.insert({'bottom': tmp.videoEl = new Element('video', {'class': 'video-js vjs-default-skin vjs-big-play-centered', 'width': 320, 'height': 240, 'controls': true, 'preload': 'auto', 'autoplay': true, 'loop': true})
								.insert({'bottom': new Element('source', {'src': data._response.result.video.asset.url, 'type': data._response.result.video.asset.mimeType}) })
							})
						})
						.insert({'bottom': new Element('div', {'class': 'col-md-8'})
							.insert({'bottom': new Element('div', {'class': 'row'}).update('<b>Asset</b>') })
							.insert({'bottom': tmp.assetKeyRow = new Element('div', {'class': 'row asset-key-row'}) })
							.insert({'bottom': tmp.assetValueRow = new Element('div', {'class': 'row asset-value-row'}) })
							.insert({'bottom': new Element('div', {'class': 'row clearfix'}).setStyle('border: 1px solid brown;') })
							.insert({'bottom': new Element('div', {'class': 'row'}).update('<b>Video</b>') })
							.insert({'bottom': tmp.videoKeyRow = new Element('div', {'class': 'row video-key-row'}) })
							.insert({'bottom': tmp.videoValueRow = new Element('div', {'class': 'row video-value-row'}) })
							.insert({'bottom': new Element('div', {'class': 'row btn-row btn-hide-row text-right'}) 
								.insert({'bottom': new Element('div', {'class': 'btn btn-delete-video btn-danger btn-xs'})
									.insert({'bottom': new Element('i', {'class': 'glyphicon glyphicon-trash'}) })
									.observe('click',function(){
										$(this).up('[video-id="' + data._response.result.video.id + '"]').hide();
									})
								})
							})
						})
					});
				tmp.me._signRandID(tmp.videoEl);
				videojs($(tmp.videoEl.id), {}, function() { });
				$H(data._response.result.video.asset).each(function(item){
					tmp.assetKeyRow.insert({'bottom': new Element('span', {'class': ((item.key == 'filename' || item.key == 'assetId')  ? 'col-md-3' : 'col-md-1'), 'title': item.key}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: clip;').update(item.key)});
					tmp.assetValueRow.insert({'bottom': new Element('span', {'class': ((item.key == 'filename' || item.key == 'assetId') ? 'col-md-3' : 'col-md-1'), 'title': item.value}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: ellipsis;').update(item.value)
						.observe('dblclick', function(){
							tmp.me.showModalBox(item.key, tmp.txtArea = new Element('input', {'value': item.value}).setStyle('width: 100%;').observe('keyup',function(){tmp.txtArea.value = item.value;}));
							tmp.txtArea.focus(); tmp.txtArea.select();
						})
					});
				});
				$H(data._response.result.video).each(function(item){
					tmp.videoKeyRow.insert({'bottom': new Element('span', {'class': 'col-md-1', 'title': item.key}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: clip;').update(item.key)});
					tmp.videoValueRow.insert({'bottom': new Element('span', {'class': 'col-md-1', 'title': item.value}).setStyle('white-space: nowrap; overflow: hidden; text-overflow: ellipsis;').update(item.value)
						.observe('dblclick', function(){
							tmp.me.showModalBox(item.key, tmp.txtArea = new Element('input', {'value': item.value}).setStyle('width: 100%;').observe('keyup',function(){tmp.txtArea.value = item.value;}));
							tmp.txtArea.focus(); tmp.txtArea.select();
						})
					});
				});
				tmp.videoValueRow.insert({'top': new Element('input', {'class': 'hidden', 'value': data._response.result.video.id, 'save-item': 'videoId'})});
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
	,getUploaderDiv: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'uploader', 'id': tmp.me.uploaderDivId})
			.insert({'bottom': new Element('input', {'id': 'fileupload', 'type': 'file', 'name': "file"}) })
			.insert({'bottom': new Element('div', {'id': 'progress', 'style': 'width: 100%; border: 1px solid black; height: 10px;'})
				.insert({'bottom': new Element('div', {'class': 'bar', 'style': 'width: 0%; height: 100%; background-color: blue;'}) })
			})
		;
		return tmp.newDiv;
	}
	,init: function() {
		var tmp = {}
		tmp.me = this;
		$(tmp.me.uploaderContainerId).down('.panel-head').insert({'bottom': new Element('div')})
			.insert({'bottom': new Element('h4').update('New Video') })
			.insert({'bottom': tmp.me.getUploaderDiv()})
		;
		tmp.me._loadUploader();
		return this;
	}
});