/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	uploaderDivId: '' //the html id of the uploader div
	,_getTitleRowData: function() {
		return {'name': "Name", 'code': 'Code', 'active': 'Active?'};
	}
	,setHTMLIds: function(uploaderDivId) {
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
	                var uploadErrors = [];
	                console.debug(data);
	                console.debug(data.originalFiles);
	                console.debug(data.originalFiles[0]['size']);
	                console.debug(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 1);
	                if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 1) {
	                    uploadErrors.push('Filesize is too big');
	                }
	                if(uploadErrors.length > 0) {
	                    alert(uploadErrors.join("\n"));
	                } else {
	                    data.submit();
	                }
	        }
			,done: function(event, data) {
				console.debug(data);
			}
		});
		
		return tmp.me;
	}
	,getUploaderDiv: function() {
		var tmp = {};
		tmp.me = this;
		tmp.newDiv = new Element('div', {'class': 'uploader'})
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
		$(tmp.me.uploaderDivId).insert({'bottom': new Element('div')})
			.insert({'bottom': new Element('h4').update('New Video') })
			.insert({'bottom': tmp.me.getUploaderDiv()})
		;
		tmp.me._loadUploader();
		return this;
	}
});