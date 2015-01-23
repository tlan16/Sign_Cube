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
		tmp.uploader = jQuery('#fileupload').fileupload({
			url: '/fileUploader/'
			,type: 'POST'
			,dataType: 'JSON'
			,formAcceptCharset: 'utf-8'
			,add: function(e, data) {
	                tmp.uploadErrors = [];
	                tmp.acceptFileTypes = /^video\/(mp4)$/i; // only take mp4 so far since it's well browser supported
	                console.debug(data);
	                if(data.originalFiles && data.originalFiles.length != 1) {
	                	tmp.me.showModalBox('Invalid File Quantity', 'Only one file per upload');
	                }
	                if(data.originalFiles[0]['type'].length && !tmp.acceptFileTypes.test(data.originalFiles[0]['type'])) {
	                	tmp.me.showModalBox('Invalid File Type', 'Not an accepted file type');
	                }
	                if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > (1000000/*1MB*/ * 500)) {
	                	tmp.me.showModalBox('Invalid File Size', 'Filesize is too big');
	                }
	                if(tmp.uploadErrors.length == 0) {
	                    data.submit();
	                }
	        }
			,done: function(event, data) {
				console.debug(data);
				$(tmp.me.uploaderDivId).hide();
				$(tmp.me.uploaderContainerId).insert({'bottom': new Element('video', {'width': 320, 'height': 240, 'controls': true})
					.insert({'bottom': new Element('source', {'src': data._response.result.asset.url, 'type': data._response.result.asset.mimeType}) })
				});
			}
			,fail: function (e, data) {
				tmp.message = '';
	            jQuery.each(data.messages, function (index, error) {
	            	tmp.me.showModalBox('Error', '<p style="color: red;">Upload file error: ' + error + '<i class="elusive-remove" style="padding-left:10px;"/></p>');
	            });
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
				.insert({'bottom': new Element('div', {'class': 'bar', 'style': 'width: 1%; height: 100%; background-color: blue;'}) })
			})
		;
		return tmp.newDiv;
	}
	,init: function() {
		var tmp = {}
		tmp.me = this;
		$(tmp.me.uploaderContainerId).insert({'bottom': new Element('div')})
			.insert({'bottom': new Element('h4').update('New Video') })
			.insert({'bottom': tmp.me.getUploaderDiv()})
		;
		tmp.me._loadUploader();
		return this;
	}
});