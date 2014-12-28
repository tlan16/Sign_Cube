/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_pagination: {'pageNo': 1, 'pageSize': 30} //the pagination details
	,_searchCriteria: {} //the searching criteria
	,_propRelTypeIds: {}
	/**
	 * Setting the property user relationship
	 */
	,setPropRelTypes: function (tenantId, agentId, ownerId) {
		this._propRelTypeIds = {'tenant': tenantId, 'agent': agentId, 'owner': ownerId};
		return this;
	}
	,getResults: function(reset, pageSize, completeFunc) {
		var tmp = {};
		tmp.me = this;
		tmp.reset = (reset === true ? true : false);
		tmp.resultDiv = $(tmp.me._htmlIDs.resultDivId);
		
		if(tmp.reset === true)
			tmp.me._pagination.pageNo = 1;
		tmp.me._pagination.pageSize = (pageSize || tmp.me._pagination.pageSize);
		tmp.me.postAjax(tmp.me.getCallbackId('getItems'), {'pagination': tmp.me._pagination, 'searchCriteria': tmp.me._searchCriteria}, {
			'onLoading': function () {
				//reset div
				if(tmp.reset === true) {
					tmp.resultDiv.update( tmp.me._getLoadingDiv() );
				}
			}
			,'onSuccess': function(sender, param) {
				try{
					tmp.result = tmp.me.getResp(param, false, true);
//					console.debug(tmp.result);
					if(!tmp.result)
						return;
					//reset div
					if(tmp.reset === true) {
						if(tmp.result.pageStats.totalRows === 0) {
							tmp.resultDiv.update(tmp.me._getNoResultDiv());
							return;
						}
						$(tmp.me._htmlIDs.totalNoOfItemsId).update(tmp.result.pageStats.totalRows);
						tmp.resultDiv.update('');
					}
					//remove next page button
					tmp.resultDiv.getElementsBySelector('.paginWrapper').each(function(item){
						item.remove();
					});
					
					//show all items
					
						for(var i = 0; i<tmp.result.items.length ; i+=4){
							$(tmp.resultDiv).insert({'bottom': tmp.me._getResultRow(tmp.result.items.slice(i,i+4)) });
							
						}					
					
						
					jQuery('video,audio').mediaelementplayer();
					
//					$(tmp.resultDiv).insert({'bottom': new Element('div')
//						.insert({'bottom': new Element('video', {'class': 'video-js vjs-default-skin', 'controls': '', 'preload': 'auto', 'width': 640, 'height': 264, 'poster': 'http://video-js.zencoder.com/oceans-clip.png', 'data-setup': '{"example_option":true}'} ) 
//							.insert({'bottom': new Element('source', {'src': '/themes/default/videos/oceans-clip.mp4', 'type': 'video/mp4'}) })
//							.insert({'bottom': new Element('p', {'class': 'vjs-no-js', 'type': 'video/ogg'}).update('To view this video please enable JavaScript, and consider upgrading to a web browser that')
//								.insert({'bottom': new Element('a', {'href': 'http://videojs.com/html5-video-support/', 'target':'_blank'}).update('supports HTML5 video') })
//							})
//						})
//					});
					//show the next page button
					if(tmp.result.pageStats.pageNumber < tmp.result.pageStats.totalPages)
						tmp.resultDiv.insert({'bottom': tmp.me._getNextPageBtn().addClassName('paginWrapper') });
				} catch (e) {
					tmp.resultDiv.insert({'bottom': tmp.me.getAlertBox('Error', e).addClassName('alert-danger') });
				}
			}
			,'onComplete': function() {
				if(typeof(completeFunc) === 'function')
					completeFunc();
			}
		});
	}
	
	,_getNextPageBtn: function() {
		var tmp = {}
		tmp.me = this;
		return new Element('div')
			.insert({'bottom': new Element('span', {'class': 'btn btn-primary btn-lg col-xs-12', 'data-loading-text':"Fetching more results ..."}).update('Show More')
				.observe('click', function() {
					tmp.btn = $(this);
					tmp.me._signRandID(tmp.btn);
					jQuery('#' + tmp.btn.id).button('loading');
					tmp.me._pagination.pageNo = tmp.me._pagination.pageNo*1 + 1;
					tmp.me.getResults(false, tmp.me._pagination.pageSize, function() {
						jQuery('#' + tmp.btn.id).button('reset');
					});
				})
			});
	}
	
	,_getTitleRowData: function() {
		return {};
	}
	
	,_getResultRow: function(words) {
		var tmp = {};
		tmp.me = this;
//		console.debug(words);
		tmp.newDiv = new Element('div', {'class': 'row'});
		words.each(function(word){
			tmp.newDiv.insert({'bottom': new Element('div', {'class': 'word-container well well-lg col-sm-3'}).store('data',word)
				.insert({'bottom': new Element('div', {'class': 'row', 'style': 'text-align: center'}).update(word.name)})
				.insert({'bottom': new Element('div', {'class': 'row', 'style': 'text-align: center'}).update(word.video ? word.video : tmp.me.getVideo(200, 100, {'mp4': '/themes/default/videos/test.mp4'}, '/themes/default/videos/test.png'))})
			});
		});
		return tmp.newDiv;
	}
	
	,_getNoResultDiv: function() {
		return new Element('div', {'class': 'no-result-div'})
			.insert({'bottom': new Element('h4', {'class': ''})})
			.insert({'bottom': new Element('p', {'class': 'lead'}).update('There isn\'t any property for you yet, please ')
				.insert({'bottom': new Element('a', {'href': $('new-property-btn').readAttribute('href'), 'class': 'btn btn-success btn-xs'}).update(new Element('span', {'class': 'glyphicon glyphicon-plus'}))
					.insert({'bottom': ' ADD'})
				})
				.insert({'bottom': ' one now.'})
			})
			.insert({'bottom': new Element('hr', {'style': 'width: 100px;'}) })
			.insert({'bottom': new Element('p').update('Only one minute to add a property ')
				.insert({'bottom': new Element('span', {'class': 'fa fa-cog fa-spin'}) })
			})
	}
});