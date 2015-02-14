var PageJs=new Class.create;PageJs.prototype=Object.extend(new BackEndPageJs,{uploaderDivId:"",_getTitleRowData:function(){return{name:"Name",code:"Code",active:"Active?"}},setHTMLIds:function(e,t){return this.uploaderContainerId=e,this.uploaderDivId=t,this},_loadUploader:function(){var e={};return e.me=this,e.fileSizeLimit=5e8,e.uploader=jQuery("#fileupload").fileupload({url:"/fileUploader/",type:"POST",dataType:"JSON",formAcceptCharset:"utf-8",maxFileSize:e.fileSizeLimit,add:function(t,o){e.uploadErrors=[],e.acceptFileTypes=/^video\/(mp4)$/i,o.originalFiles&&1!=o.originalFiles.length&&e.me.showModalBox("Invalid File Quantity","Only one file per upload"),o.originalFiles[0].type.length&&!e.acceptFileTypes.test(o.originalFiles[0].type)&&e.me.showModalBox("Invalid File Type","Not an accepted file type"),o.originalFiles[0].size&&o.originalFiles[0].size>e.fileSizeLimit&&e.me.showModalBox("Invalid File Size","Filesize is too big"),0==e.uploadErrors.length&&o.submit()},done:function(t,o){console.debug(o),jQuery("#progress .bar").css("width","0%"),$(e.me.uploaderContainerId).down(".panel-body").insert({bottom:new Element("div",{"class":"row","video-id":o._response.result.video.id}).insert({bottom:new Element("div",{"class":"col-md-4"}).insert({bottom:e.videoEl=new Element("video",{"class":"video-js vjs-default-skin vjs-big-play-centered",width:320,height:240,controls:!0,preload:"auto",autoplay:!0,loop:!0}).insert({bottom:new Element("source",{src:o._response.result.video.asset.url,type:o._response.result.video.asset.mimeType})})})}).insert({bottom:new Element("div",{"class":"col-md-8"}).insert({bottom:new Element("div",{"class":"row"}).update("<b>Asset</b>")}).insert({bottom:e.assetKeyRow=new Element("div",{"class":"row asset-key-row"})}).insert({bottom:e.assetValueRow=new Element("div",{"class":"row asset-value-row"})}).insert({bottom:new Element("div",{"class":"row clearfix"}).setStyle("border: 1px solid brown;")}).insert({bottom:new Element("div",{"class":"row"}).update("<b>Video</b>")}).insert({bottom:e.videoKeyRow=new Element("div",{"class":"row video-key-row"})}).insert({bottom:e.videoValueRow=new Element("div",{"class":"row video-value-row"})}).insert({bottom:new Element("div",{"class":"row btn-row btn-hide-row text-right"}).insert({bottom:new Element("div",{"class":"btn btn-delete-video btn-danger btn-xs"}).insert({bottom:new Element("i",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){$(this).up('[video-id="'+o._response.result.video.id+'"]').hide()})})})})}),e.me._signRandID(e.videoEl),videojs($(e.videoEl.id),{},function(){}),$H(o._response.result.video.asset).each(function(t){e.assetKeyRow.insert({bottom:new Element("span",{"class":"filename"==t.key||"assetId"==t.key?"col-md-3":"col-md-1",title:t.key}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: clip;").update(t.key)}),e.assetValueRow.insert({bottom:new Element("span",{"class":"filename"==t.key||"assetId"==t.key?"col-md-3":"col-md-1",title:t.value}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: ellipsis;").update(t.value).observe("dblclick",function(){e.me.showModalBox(t.key,e.txtArea=new Element("input",{value:t.value}).setStyle("width: 100%;").observe("keyup",function(){e.txtArea.value=t.value})),e.txtArea.focus(),e.txtArea.select()})})}),$H(o._response.result.video).each(function(t){e.videoKeyRow.insert({bottom:new Element("span",{"class":"col-md-1",title:t.key}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: clip;").update(t.key)}),e.videoValueRow.insert({bottom:new Element("span",{"class":"col-md-1",title:t.value}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: ellipsis;").update(t.value).observe("dblclick",function(){e.me.showModalBox(t.key,e.txtArea=new Element("input",{value:t.value}).setStyle("width: 100%;").observe("keyup",function(){e.txtArea.value=t.value})),e.txtArea.focus(),e.txtArea.select()})})}),e.videoValueRow.insert({top:new Element("input",{"class":"hidden",value:o._response.result.video.id,"save-item":"videoId"})})},fail:function(t,o){e.message="",jQuery.each(o.messages,function(t,o){e.me.showModalBox("Error",'<p style="color: red;">Upload file error: '+o+'<i class="elusive-remove" style="padding-left:10px;"/></p>')})},progressall:function(t,o){e.progress=parseInt(o.loaded/o.total*100,10),jQuery("#progress .bar").css("width",e.progress+"%")}}),e.me},getUploaderDiv:function(){var e={};return e.me=this,e.newDiv=new Element("div",{"class":"uploader",id:e.me.uploaderDivId}).insert({bottom:new Element("input",{id:"fileupload",type:"file",name:"file"})}).insert({bottom:new Element("div",{id:"progress",style:"width: 100%; border: 1px solid black; height: 10px;"}).insert({bottom:new Element("div",{"class":"bar",style:"width: 0%; height: 100%; background-color: blue;"})})}),e.newDiv},init:function(){var e={};return e.me=this,$(e.me.uploaderContainerId).down(".panel-head").insert({bottom:new Element("div")}).insert({bottom:new Element("h4").update("New Video")}).insert({bottom:e.me.getUploaderDiv()}),e.me._loadUploader(),this}});