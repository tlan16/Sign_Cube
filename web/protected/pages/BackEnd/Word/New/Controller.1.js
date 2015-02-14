var PageJs=new Class.create;PageJs.prototype=Object.extend(new BackEndPageJs,{_getTitleRowData:function(){return{name:"Name",code:"Code",active:"Active?"}},_htmlIds:{},_language:null,_category:{},_word:{},_items:{},_videos:[],_definitionTypes:{},setHTMLIds:function(e,t,n){var o={};return o.me=this,o.me._htmlIds.itemDiv=e,o.me._htmlIds.searchPanel=t,o.me._htmlIds.newWordBtn="new_word_btn",o.me._htmlIds.uploaderDivId=n,o.me._htmlIds.definitionsContainer="definitions_container",o.me._htmlIds.definitionsContainerInner="definitions_container_inner",this},_saveWord:function(){var e={};return e.me=this,e.data=e.data=[],$(e.me._htmlIds.definitionsContainerInner).getElementsBySelector(".definitionGroup").each(function(t){e.type=$F($(t).down('.panel-heading [save-def-item="type"]')),e.type.empty()||(e.formType=e.type,e.formRows=[],$(t).getElementsBySelector(".panel-body .row.definitionRow").each(function(t){e.row=$F($(t).down('[save-def-item="definitionRow"]')),e.order=$F($(t).down('[save-def-item="definitionOrder"]')),e.row.empty()||e.formRows.push({def:e.row,order:e.order})}),e.data.push({type:e.formType,rows:e.formRows}))}),e.me.postAjax(e.me.getCallbackId("saveWord"),{definitions:e.data,videos:e.me._videos,word:e.me._word},{onLoading:function(){$(e.me._htmlIds.itemDiv).insert({top:e.loadingImg=e.me.getLoadingImg()}),$(e.me._htmlIds.definitionsContainer).hide()},onSuccess:function(t,n){try{if(e.result=e.me.getResp(n,!1,!0),!e.result.item||e.result.item.id.empty())throw"errror: php passback Error";e.me.showModalBox("Success","<h4>Word Saved Successfully</h4>"),window.location.reload()}catch(o){e.me.showModalBox('<span class="text-danger">ERROR</span>',o,!0)}},onComplete:function(){e.loadingImg.remove()}}),e.me},_getNewDefinitionBodyRow:function(){var e={};return e.me=this,e.newDiv=new Element("div",{"class":"row definitionRow"}).setStyle("padding-bottom: 10px;").insert({bottom:new Element("span",{"class":"col-md-8"}).insert({bottom:new Element("input",{"save-def-item":"definitionRow",type:"text",placeholder:"Definition"}).setStyle("width: 100%;").observe("click",function(){$(this).focus(),$(this).select()}).observe("keydown",function(t){return e.btn=$(this),e.me.keydown(t,function(){e.btn.up(".row.definitionRow").down('[save-def-item="definitionOrder"]').click()}),!1})})}).insert({bottom:new Element("span",{"class":"col-md-2"}).insert({bottom:new Element("input",{"save-def-item":"definitionOrder",type:"value",placeholder:"Order (optional)"}).setStyle("width: 100%;").observe("click",function(){$(this).focus(),$(this).select()}).observe("keydown",function(t){return e.btn=$(this),e.me.keydown(t,function(){e.btn.up(".row.definitionRow").down(".btn.btn-new-defRow").click()}),!1})})}).insert({bottom:new Element("span",{"class":"col-md-2 text-right"}).insert({bottom:new Element("span",{"class":"btn-group"}).insert({bottom:new Element("span",{"class":"btn btn-success btn-xs btn-new-defRow"}).insert({bottom:new Element("i",{"class":"fa fa-plus"})}).observe("click",function(){$(this).up(".panel.definitionGroup").down(".panel-body").insert({bottom:e.newDefRow=e.me._getNewDefinitionBodyRow()}),e.newDefRow.down('[save-def-item="definitionRow"]').click()})}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-xs"}).insert({bottom:new Element("i",{"class":"fa fa-times"})}).observe("click",function(){$(this).up(".row.definitionRow").remove()})})})}),e.newDiv},_getNewDefinitionGroup:function(){var e={};e.me=this,e.newDiv=new Element("div",{"class":"panel panel-default definitionGroup"}).insert({bottom:new Element("div",{"class":"panel-heading"}).insert({bottom:new Element("div",{"class":"row"}).insert({bottom:new Element("input",{"save-def-item":"type",type:"text",placeholder:"the Type of Definition"}).setStyle("width: 100%;").observe("click",function(){$(this).focus(),$(this).select()}).observe("keydown",function(t){return e.btn=$(this),e.me.keydown(t,function(){e.btn.up(".panel-heading").down(".btn-save-def-type").click()}),!1}).wrap(new Element("span",{"class":"col-md-8"}))}).insert({bottom:new Element("span",{"class":"col-md-4 btn-group"}).insert({bottom:new Element("span",{"class":"btn btn-success btn-sm btn-save-def-type"}).insert({bottom:new Element("i",{"class":"glyphicon glyphicon-floppy-saved"})}).observe("click",function(){$(this).up(".panel.definitionGroup").down(".panel-body").insert({bottom:e.me.bodyRow=e.me._getNewDefinitionBodyRow()}),e.me.bodyRow.down('[save-def-item="definitionRow"]').click()})}).insert({bottom:new Element("span",{"class":"btn btn-danger btn-sm"}).insert({bottom:new Element("i",{"class":"glyphicon glyphicon-floppy-remove"})}).observe("click",function(){$(this).up(".panel.definitionGroup").remove()})})})})}).insert({bottom:new Element("div",{"class":"panel-body"})}),$(e.me._htmlIds.definitionsContainerInner).insert({top:e.newDiv}).down('input[save-def-item="type"]').click()},_getDefinitionsContainer:function(){var e={};e.me=this,e.newDIv=new Element("div",{id:e.me._htmlIds.definitionsContainer}).insert({bottom:new Element("div",{"class":"row",id:e.me._htmlIds.definitionsContainerInner})}).insert({bottom:new Element("div",{"class":"row pull-right btn-group"}).insert({bottom:new Element("div",{"class":"btn btn-md btn-info btn-new-definitionGroup"}).insert({bottom:new Element("i",{"class":"fa fa-plus"}).update("&nbsp;&nbsp;New Definition Type")}).observe("click",function(){e.me._getNewDefinitionGroup(),$(e.me._htmlIds.definitionsContainerInner).down('[save-def-item="type"]').click()})}).insert({bottom:new Element("div",{"class":"btn btn-md btn-success btn-save-definitionGroup"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-floppy-disk"}).update("  Save")}).observe("click",function(){!$(e.me._htmlIds.itemDiv).getElementsBySelector('[save-def-item="definitionRow"]').length||$F($(e.me._htmlIds.itemDiv).down('[save-def-item="definitionRow"]')).empty()?e.me.showModalBox("Notice","you must add <b>at least one definition</b> for "+e.me._word.name):e.me._saveWord()})})}),$(e.me._htmlIds.itemDiv).update(e.newDIv)},_getDefinitionTypes:function(){var e={};e.me=this,e.me.postAjax(e.me.getCallbackId("getDefTypes"),{},{onLoading:function(){$(e.me._htmlIds.itemDiv).update(e.loadingImg=e.me.getLoadingImg())},onSuccess:function(t,n){try{if(e.result=e.me.getResp(n,!1,!0),!e.result.items)throw"errror";e.me_definitionTypes=e.result.items,e.me._getDefinitionsContainer(),$(e.me._htmlIds.definitionsContainer).down(".btn.btn-new-definitionGroup").click()}catch(o){e.me.showModalBox('<span class="text-danger">ERROR</span>',o,!0)}},onComplete:function(){e.loadingImg.remove()}})},selectVideos:function(){var e={};e.me=this,e.me._getDefinitionTypes()},_loadUploader:function(){var e={};return e.me=this,e.fileSizeLimit=5e8,e.uploader=jQuery("#fileupload").fileupload({url:"/fileUploader/",type:"POST",dataType:"JSON",formAcceptCharset:"utf-8",maxFileSize:e.fileSizeLimit,add:function(t,n){e.uploadErrors=[],e.acceptFileTypes=/^video\/(mp4)$/i,n.originalFiles&&1!=n.originalFiles.length&&e.me.showModalBox("Invalid File Quantity","Only one file per upload"),n.originalFiles[0].type.length&&!e.acceptFileTypes.test(n.originalFiles[0].type)&&e.me.showModalBox("Invalid File Type","Not an accepted file type"),n.originalFiles[0].size&&n.originalFiles[0].size>e.fileSizeLimit&&e.me.showModalBox("Invalid File Size","Filesize is too big"),0==e.uploadErrors.length&&n.submit()},done:function(t,n){jQuery("#progress .bar").css("width","0%"),$(e.me._htmlIds.uploaderDivId).down(".panel-body").insert({bottom:new Element("div",{"class":"row video-row","video-id":n._response.result.video.id}).insert({bottom:new Element("div",{"class":"col-md-4"}).insert({bottom:e.videoEl=new Element("video",{"class":"video-js vjs-default-skin vjs-big-play-centered",width:320,height:240,controls:!0,preload:"auto",autoplay:!0,loop:!0}).insert({bottom:new Element("source",{src:n._response.result.video.asset.url,type:n._response.result.video.asset.mimeType})})})}).insert({bottom:new Element("div",{"class":"col-md-8"}).insert({bottom:new Element("div",{"class":"row"}).update("<b>Asset</b>")}).insert({bottom:e.assetKeyRow=new Element("div",{"class":"row asset-key-row"})}).insert({bottom:e.assetValueRow=new Element("div",{"class":"row asset-value-row"})}).insert({bottom:new Element("div",{"class":"row clearfix"}).setStyle("border: 1px solid brown;")}).insert({bottom:new Element("div",{"class":"row"}).update("<b>Video</b>")}).insert({bottom:e.videoKeyRow=new Element("div",{"class":"row video-key-row"})}).insert({bottom:e.videoValueRow=new Element("div",{"class":"row video-value-row"})}).insert({bottom:new Element("div",{"class":"row btn-row btn-hide-row text-right"}).insert({bottom:new Element("div",{"class":"btn btn-delete-video btn-danger btn-xs"}).insert({bottom:new Element("i",{"class":"glyphicon glyphicon-trash"})}).observe("click",function(){$(this).up('[video-id="'+n._response.result.video.id+'"]').hide()})})})})}),e.me._signRandID(e.videoEl),videojs($(e.videoEl.id),{},function(){}),$H(n._response.result.video.asset).each(function(t){e.assetKeyRow.insert({bottom:new Element("span",{"class":"filename"==t.key||"assetId"==t.key?"col-md-3":"col-md-1",title:t.key}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: clip;").update(t.key)}),e.assetValueRow.insert({bottom:new Element("span",{"class":"filename"==t.key||"assetId"==t.key?"col-md-3":"col-md-1",title:t.value}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: ellipsis;").update(t.value).observe("dblclick",function(){e.me.showModalBox(t.key,e.txtArea=new Element("input",{value:t.value}).setStyle("width: 100%;").observe("keyup",function(){e.txtArea.value=t.value})),e.txtArea.focus(),e.txtArea.select()})})}),$H(n._response.result.video).each(function(t){e.videoKeyRow.insert({bottom:new Element("span",{"class":"col-md-1",title:t.key}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: clip;").update(t.key)}),e.videoValueRow.insert({bottom:new Element("span",{"class":"col-md-1",title:t.value}).setStyle("white-space: nowrap; overflow: hidden; text-overflow: ellipsis;").update(t.value).observe("dblclick",function(){e.me.showModalBox(t.key,e.txtArea=new Element("input",{value:t.value}).setStyle("width: 100%;").observe("keyup",function(){e.txtArea.value=t.value})),e.txtArea.focus(),e.txtArea.select()})})}),e.videoValueRow.insert({top:new Element("input",{"class":"hidden",value:n._response.result.video.id,"save-item":"videoId"})})},fail:function(t,n){e.message="",jQuery.each(n.messages,function(t,n){e.me.showModalBox("Error",'<p style="color: red;">Upload file error: '+n+'<i class="elusive-remove" style="padding-left:10px;"/></p>')})},progressall:function(t,n){e.progress=parseInt(n.loaded/n.total*100,10),jQuery("#progress .bar").css("width",e.progress+"%")}}),e.me},_getVideoUploadPanel:function(){var e={};return e.me=this,$(e.me._htmlIds.itemDiv).insert({bottom:new Element("div",{"class":"panel panel-default",id:e.me._htmlIds.uploaderDivId}).insert({bottom:new Element("div",{"class":"panel-head"})}).insert({bottom:new Element("div",{"class":"panel-body"})})}),$(e.me._htmlIds.uploaderDivId).down(".panel-head").insert({bottom:new Element("div").insert({bottom:new Element("strong").update("New Video")}).insert({bottom:new Element("span",{"class":"btn btn-sm btn-success pull-right btn-save-videos"}).insert({bottom:new Element("span").update("Confirm Videos")}).observe("click",function(){$(e.me._htmlIds.uploaderDivId).getElementsBySelector(".video-row").each(function(t){e.me._videos.push({id:e.me._collectFormData(t,"save-item").videoId,valid:t.visible()})}),pageJs._videos.length?($(this).down("span").update("loading..."),$(this).writeAttribute("disabled",!0),e.me.selectVideos()):e.me.showModalBox("Notice","<h4>Please upload <b>at least one video</b></h4>")})})}).insert({bottom:e.me.getUploaderDiv()}),e.me._loadUploader(),e.me},getUploaderDiv:function(){var e={};return e.me=this,e.newDiv=new Element("div",{"class":"uploader",id:e.me.uploaderDivId}).insert({bottom:new Element("input",{id:"fileupload",type:"file",name:"file"})}).insert({bottom:new Element("div",{id:"progress",style:"width: 100%; border: 1px solid black; height: 10px;"}).insert({bottom:new Element("div",{"class":"bar",style:"width: 0%; height: 100%; background-color: blue;"})})}),e.newDiv},selectWord:function(){var e={};e.me=this,"NEW"===e.me._word.id&&($(e.me._htmlIds.itemDiv).update(""),e.me._getVideoUploadPanel())},_getNewWordRow:function(e){var t={};return t.me=this,t.tbody=e.up(".table").down("tbody"),t.searchTxt=$F($(t.me._htmlIds.searchPanel).down("input.search-txt")),t.tbody.update().insert({bottom:t.me._getWordEditPanel(t.searchTxt)}).down('[save-item-panel="name"]').click(),t.me},_getWordEditPanel:function(e){var t={};return t.me=this,t.searchTxt=e||"",t.newDiv=new Element("tr",{"class":"save-item-panel info"}).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"id",value:t.me._word.id?t.me._word.id:"NEW"})}).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"categoryId",value:t.me._category.id})}).insert({bottom:new Element("input",{type:"hidden","save-item-panel":"languageId",value:t.me._language.id})}).insert({bottom:new Element("td",{"class":"form-group",colspan:2}).insert({bottom:new Element("input",{required:!0,"class":"form-control",placeholder:"The Name of the Word","save-item-panel":"name",value:t.me._word.name?t.me._word.name:t.searchTxt})}).observe("click",function(){$(this).down("input").select(),$(this).down("input").focus()}).observe("keydown",function(e){return t.btn=$(this),t.me.keydown(e,function(){t.btn.up(".save-item-panel").down(".btn.btn-save-word").click()}),!1})}).insert({bottom:new Element("td",{"class":"form-group"}).insert({bottom:new Element("input",{"class":"form-control",disabled:!0,title:"Category Name","save-item-panel":"categoryName",value:t.me._category.name})})}).insert({bottom:new Element("td",{"class":"form-group"}).insert({bottom:new Element("input",{"class":"form-control",disabled:!0,title:"Language Name","save-item-panel":"languageName",value:t.me._language.name})})}).insert({bottom:new Element("td").insert({bottom:t.isTitle===!0?word.active:new Element("input",{type:"checkbox",disabled:!0,checked:t.me._word.active?t.me._word.active:!0})})}).insert({bottom:new Element("td",{"class":"text-right"}).insert({bottom:new Element("span",{"class":"btn-group btn-group-sm"}).insert({bottom:new Element("span",{"class":"btn btn-success btn-save-word",title:"Save"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-ok"})}).observe("click",function(){t.btn=this,t.me._word=t.me._collectFormData($(t.btn).up(".save-item-panel"),"save-item-panel"),t.me.selectWord()})}).insert({bottom:new Element("span",{"class":"btn btn-danger",title:"Delete"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){t.me._word.id?$(this).up(".save-item-panel").replace(t.me._getWordEditPanel().addClassName("item_row").writeAttribute("item_id",t.me._word.id)):$(this).up(".save-item-panel").remove()})})})}),t.me._word.id&&t.newDiv.addClassName("item_row").writeAttribute("item_id",t.me._word.id),t.newDiv},_getWordRow:function(e,t){var n={};return n.me=this,n.isTitle=t||!1,n.tag=n.isTitle===!0?"th":"td",n.newDiv=new Element("tr",{"class":(n.isTitle===!0?"item_top_row":"btn-hide-row item_row")+(0==e.active?" danger":""),item_id:n.isTitle===!0?"":e.id}).store("data",e).insert({bottom:new Element(n.tag,{"class":n.isTitle?"hidden":""}).insert({bottom:n.isTitle===!0?"&nbsp;":new Element("span",{"class":"btn btn-primary btn-xs"}).update("select").observe("click",function(){n.me.selectWord(e)})})}).insert({bottom:new Element(n.tag,{colspan:n.isTitle?2:1}).update(e.name)}).insert({bottom:new Element(n.tag).update(n.isTitle===!0?"Category":n.me._category.name)}).insert({bottom:new Element(n.tag).update(n.isTitle===!0?"Language":n.me._language.name)}).insert({bottom:new Element(n.tag).insert({bottom:n.isTitle===!0?e.active:new Element("input",{type:"checkbox",disabled:!0,checked:e.active})})}).insert({bottom:n.isTitle!==!0?"":new Element(n.tag,{id:n.me._htmlIds.newWordBtn,"class":"text-right"}).insert({bottom:new Element("a",{"class":"btn btn-success btn-xs"}).insert({bottom:new Element("span",{"class":"fa fa-plus"})})}).observe("click",function(){n.me._getNewWordRow($(this))})}),n.newDiv},_searchWord:function(e){var t={};return t.me=this,t.searchTxt=$F(e).strip(),t.searchPanel=$(e).up("#"+t.me._htmlIds.searchPanel),t.me.postAjax(t.me.getCallbackId("searchWord"),{searchTxt:t.searchTxt},{onLoading:function(){$(t.searchPanel).down(".list-div")&&$(t.searchPanel).down(".list-div").remove(),$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getLoadingImg())})},onSuccess:function(e,n){$(t.searchPanel).down(".panel-body")&&$(t.searchPanel).down(".panel-body").remove();try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.items)return;$(t.searchPanel).insert({bottom:new Element("small",{"class":"table-responsive list-div"}).insert({bottom:new Element("table",{"class":"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:t.me._getWordRow({name:"Name",active:"Active?"},!0)})}).insert({bottom:t.listDiv=new Element("tbody")})})}),t.result.items.each(function(e){t.listDiv.insert({bottom:t.me._getWordRow(e)})})}catch(o){$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getAlertBox("ERROR",o).addClassName("alert-danger"))})}}}),t.me},_getWordListPanel:function(){var e={};return e.me=this,e.newDiv=new Element("div",{id:e.me._htmlIds.searchPanel,"class":"panel panel-default search-panel"}).insert({bottom:new Element("div",{"class":"panel-heading form-inline"}).insert({bottom:new Element("strong").update("Select the Word to Edit: ")}).insert({bottom:new Element("span",{"class":"input-group col-sm-6"}).insert({bottom:new Element("input",{"class":"form-control search-txt init-focus",placeholder:"the Name of Word ..."}).observe("keydown",function(t){return e.txtBox=this,e.me.keydown(t,function(){e.txtBox.up("#"+pageJs._htmlIds.searchPanel).down(".search-btn").click()}),!1})}).insert({bottom:new Element("span",{"class":"input-group-btn search-btn"}).insert({bottom:new Element("span",{"class":" btn btn-primary"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-search"})})}).observe("click",function(){e.btn=this,e.txtBox=$(e.me._htmlIds.searchPanel).down(".search-txt"),$F(e.txtBox).blank()?$(e.me._htmlIds.searchPanel).down(".table tbody")&&($(e.me._htmlIds.searchPanel).down(".table tbody").innerHTML=null):e.me._searchWord(e.txtBox)})})}).insert({bottom:new Element("span",{"class":"btn btn-success pull-right btn-sm btn-danger"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){$(e.me._htmlIds.searchPanel).down(".search-txt").clear().focus(),$(e.me._htmlIds.searchPanel).down(".table tbody").innerHTML=null})})}),e.newDiv},selectCategory:function(e){var t={};return t.me=this,t.me._category=e,t.me._language=e.language,$(t.me._htmlIds.itemDiv).update(t.wordPanel=t.me._getWordListPanel()),t.wordPanel.down("input.search-txt").focus(),t.me},_getCategoryRow:function(e,t){var n={};return n.me=this,n.isTitle=t||!1,n.tag=n.isTitle===!0?"th":"td",n.newDiv=new Element("tr",{"class":(n.isTitle===!0?"item_top_row":"btn-hide-row item_row")+(0==e.active?" danger":""),item_id:n.isTitle===!0?"":e.id}).store("data",e).insert({bottom:new Element(n.tag).insert({bottom:n.isTitle===!0?"&nbsp;":new Element("span",{"class":"btn btn-primary btn-xs"}).update("select").observe("click",function(){n.me.selectCategory(e)})})}).insert({bottom:new Element(n.tag).update(e.name)}).insert({bottom:new Element(n.tag).update(e.language.name)}).insert({bottom:new Element(n.tag).insert({bottom:n.isTitle===!0?e.active:new Element("input",{type:"checkbox",disabled:!0,checked:e.active})})}),n.newDiv},_searchCategory:function(e){var t={};return t.me=this,t.searchTxt=$F(e).strip(),t.searchPanel=$(e).up("#"+t.me._htmlIds.searchPanel),t.me.postAjax(t.me.getCallbackId("searchCategory"),{searchTxt:t.searchTxt},{onLoading:function(){$(t.searchPanel).down(".list-div")&&$(t.searchPanel).down(".list-div").remove(),$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getLoadingImg())})},onSuccess:function(e,n){$(t.searchPanel).down(".panel-body")&&$(t.searchPanel).down(".panel-body").remove();try{if(t.result=t.me.getResp(n,!1,!0),!t.result||!t.result.items)return;$(t.searchPanel).insert({bottom:new Element("small",{"class":"table-responsive list-div"}).insert({bottom:new Element("table",{"class":"table table-hover table-condensed"}).insert({bottom:new Element("thead").insert({bottom:t.me._getCategoryRow({name:"Name",active:"Active?",language:{name:"Language"}},!0)})}).insert({bottom:t.listDiv=new Element("tbody")})})}),t.result.items.each(function(e){t.listDiv.insert({bottom:t.me._getCategoryRow(e)})})}catch(o){$(t.searchPanel).insert({bottom:new Element("div",{"class":"panel-body"}).update(t.me.getAlertBox("ERROR",o).addClassName("alert-danger"))})}}}),t.me},_getCategoryListPanel:function(){var e={};return e.me=this,e.newDiv=new Element("div",{id:e.me._htmlIds.searchPanel,"class":"panel panel-default search-panel"}).insert({bottom:new Element("div",{"class":"panel-heading form-inline"}).insert({bottom:new Element("strong").update("Select the Category for the Word: ")}).insert({bottom:new Element("span",{"class":"input-group col-sm-6"}).insert({bottom:new Element("input",{"class":"form-control search-txt init-focus",placeholder:"the Name of Category ..."}).observe("keydown",function(t){return e.txtBox=this,e.me.keydown(t,function(){e.txtBox.up("#"+pageJs._htmlIds.searchPanel).down(".search-btn").click()}),!1})}).insert({bottom:new Element("span",{"class":"input-group-btn search-btn"}).insert({bottom:new Element("span",{"class":" btn btn-primary"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-search"})})}).observe("click",function(){e.btn=this,e.txtBox=$(e.me._htmlIds.searchPanel).down(".search-txt"),$F(e.txtBox).blank()?$(e.me._htmlIds.searchPanel).down(".table tbody")&&($(e.me._htmlIds.searchPanel).down(".table tbody").innerHTML=null):e.me._searchCategory(e.txtBox)})})}).insert({bottom:new Element("span",{"class":"btn btn-success pull-right btn-sm btn-danger"}).insert({bottom:new Element("span",{"class":"glyphicon glyphicon-remove"})}).observe("click",function(){$(e.me._htmlIds.searchPanel).down(".search-txt").clear().focus(),$(e.me._htmlIds.searchPanel).down(".table tbody").innerHTML=null})})}),e.newDiv},init:function(e){var t={};return t.me=this,t.category=e||!1,t.category?(t.me.selectCategory(e),t.me._category=t.category):$(t.me._htmlIds.itemDiv).update(t.me._getCategoryListPanel()),$$(".init-focus").size()>0&&$$(".init-focus").first().focus(),t.me}});