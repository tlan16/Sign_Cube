var PageJs=new Class.create
PageJs.prototype=Object.extend(new FrontPageJs,{_getTitleRowData:function(){return{name:"Word",category:{name:"Category",language:{name:"Language"}},language:{name:"Language"}}},_bindSearchKey:function(){var e={}
return e.me=this,$("searchPanel").getElementsBySelector("[search_field]").each(function(t){t.observe("keydown",function(t){e.me.keydown(t,function(){$(e.me.searchDivId).down("#searchBtn").click()})})}),e.selectEl=new Element("select",{"class":"select2 form-control","data-placeholder":"Select a Category",search_field:"category.id"}).insert({bottom:new Element("option").update("")}),e.me._categories&&e.me._categories.length>0&&e.me._categories.each(function(t){e.foundLanguage=!1,$(e.selectEl).getElementsBySelector("optgroup").each(function(n){e.foundLanguage===!1&&n.readAttribute("langId")==t.language.id&&(e.foundLanguage=!0,e.option=n.insert({bottom:new Element("option",{categoryId:t.id,value:t.id}).update(t.name)}))}),e.foundLanguage===!1&&e.selectEl.insert({bottom:new Element("optgroup",{langId:t.language.id,label:t.language.name}).update(t.language.name).store("data",t.language)})}),$("searchPanel").down('input[search_field="category.id"]').replace(e.selectEl),e.selectEl=new Element("select",{"class":"select2 form-control","data-placeholder":"Select a Language",search_field:"language.id"}).insert({bottom:new Element("option").update("")}),e.me._categories&&e.me._categories.length>0&&e.me._categories.each(function(t){e.foundLanguage=!1,$(e.selectEl).getElementsBySelector("option").each(function(n){e.foundLanguage===!1&&n.readAttribute("value")==t.language.id&&(e.foundLanguage=!0,e.option=n)}),e.foundLanguage===!1&&e.selectEl.insert({bottom:new Element("option",{value:t.language.id}).update(t.language.name)})}),e.me.sortlist(e.selectEl),$("searchPanel").down('input[search_field="language.id"]').replace(e.selectEl),jQuery(".select2").select2({allowClear:!0}),e.me},sortlist:function(e){var t={}
for(t.me=this,t.cl=e,t.clTexts=[],i=2;i<t.cl.length;i++)t.clTexts[i-2]=t.cl.options[i].text.toUpperCase()+","+t.cl.options[i].text+","+t.cl.options[i].value
for(t.clTexts.sort(),i=2;i<t.cl.length;i++)t.me.parts=t.clTexts[i-2].split(","),t.cl.options[i].text=t.me.parts[1],t.cl.options[i].value=t.me.parts[2]},_loadChosen:function(){return jQuery(".chosen").chosen({search_contains:!0,inherit_select_classes:!0,no_results_text:"No sign language type found!",width:"100%"}).trigger("chosen:updated"),this},loadAZlinks:function(){var e,t={}
for(t.me=this,e=65;90>=e;e++)$(this.totalNoOfItemsId).up(".panel-heading").insert({bottom:new Element("td").update(String.fromCharCode(e)).setStyle("padding: 0 5px; color: #3071A9; text-decoration: underline; cursor: pointer;").observe("click",function(){t.me.getSearchCriteria(),t.me._searchCriteria=null===t.me._searchCriteria?{}:t.me._searchCriteria,t.me._searchCriteria["wd.startLetter"]=$(this).innerHTML,t.me.getResults(!0)})})},_getResultRow:function(e,t){var n={}
return n.me=this,n.tag=n.isTitle===!0?"th":"td",n.isTitle=t||!1,n.row=new Element("tr").setStyle(n.isTitle?"font-size:110%; font-weight:bold;":"").store("data",e).insert({bottom:new Element(n.tag,{"class":"name col-xs-3"}).update(e.name).setStyle(n.isTitle?"font-weight:bold;":"text-decoration: underline; cursor: pointer;").observe("click",function(){n.me._openDetailPage(e)})}).insert({bottom:new Element(n.tag,{"class":"categoryName col-xs-3",style:n.isTitle?"font-weight:bold;":""}).update(e.category.name+"("+e.category.language.name+")")}),n.row},_openDetailPage:function(e){var t={}
return t.me=this,t.newWindow=window.open("/wordlist/"+e.id+".html","_blank"),t.newWindow.focus(),t.me}})
