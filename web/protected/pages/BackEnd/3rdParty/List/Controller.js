/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	_pagination: {'pageNo': 1, 'pageSize': 5} //the pagination details
	
	,_getVideosDiv: function() {
		var tmp = {};
		tmp.me = this;
		
		tmp.newDiv = new Element('div', {'class': 'videosContainer'});
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), tmp.data, {
			'onLoading': function(sender, param) {
			}
			,'onSuccess': function (sender, param) {
				try {
					tmp.result = tmp.me.getResp(param, false, true);
					console.debug(tmp.result);
					
					tmp.result.items.each(function(item){
						tmp.newDiv.insert({'bottom': new Element('div', {'class': 'row'})
							.insert({'bottom': new Element('video', {'width': '200', 'height': '200', 'controls': ''})
								.insert({'bottom': new Element('source', {'src': item.media, 'type': 'video/mp4'}) })
							})
						})
					});
					
				}  catch (e) {
					tmp.me.showModalBox('<strong class="text-danger">Error:</strong>', e, false);
				}
			}
			,'onComplete': function(sender, param) {
			}
		});
		
		return tmp.newDiv;
	}

	,_init: function() {
		var tmp = {};
		tmp.me = this;
		
		tmp.resultDiv = $('result-div');
		tmp.resultDiv.insert({'bottom': tmp.me._getVideosDiv() });
		
		return tmp.me;
	}


});