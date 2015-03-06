/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new FrontPageJs(), {
	_htmlIds: {'itemDiv': '', 'searchPanel': 'search_panel'}
	,_videoIndex: 0
	/**
	 * Setting the HTMLIDS
	 */
	,setHTMLIDs: function(itemDivId) {
		this._htmlIds.itemDiv = itemDivId;
		return this;
	}
	,init: function() {
		var tmp = {};
		tmp.me = this;
		
		$(tmp.me._htmlIds.itemDiv)
			.insert({'bottom': new Element('ol', {'class': 'breadcrumb'})
				.insert({'bottom': new Element('li')
					.insert({'bottom': new Element('a', {'href': '/wordlist.html?language=' + tmp.me._word.category.language.id}).update(tmp.me._word.category.language.name)})
				})
				.insert({'bottom': new Element('li')
					.insert({'bottom': new Element('a', {'href': '/wordlist.html?category=' + tmp.me._word.category.id}).update(tmp.me._word.category.name)})
				})
				.insert({'bottom': new Element('li').update(tmp.me._word.name)})
			})
			.insert({'bottom': new Element('div', {'class': 'mainBlock'})
				.insert({'bottom': new Element('div', {'class': 'col-md-4'})
					.insert({'bottom': new Element('div', {'class': 'video-container'}).update(tmp.me.getBasicVideoEl(tmp.me._videos[tmp.me._videoIndex].url)) })
					.insert({'bottom': tmp.videoNav = new Element('nav')
						.insert({'bottom': new Element('ul', {'class': 'pagination pagination-sm'})
							.insert({'bottom': new Element('span', {'class': 'pull-left'}).update('Videos found:&nbsp;&nbsp;&nbsp;&nbsp;')})
						})
					})
				})
				.insert({'bottom': new Element('div', {'class': 'col-md-8'})
					.insert({'bottom': new Element('h4').update('Definition') })
					.insert({'bottom': new Element('div', {'class': 'definitionContainer'}) })
				})
			})
		;
		tmp.me.getDefinitions(tmp.me._videos[tmp.me._videoIndex]);
		tmp.index = 0;
		tmp.me._videos.each(function(item){
			tmp.videoNav.down('.pagination')
				.insert({'bottom': new Element('li', {'class': tmp.index === 0 ? 'active' : ''})
					.insert({'bottom': new Element('a', {'href': '#'}).update(tmp.index + 1) })
					.observe('click', function(){
						$(this).up('.pagination').down('li.active').removeClassName('active');
						$(this).addClassName('active');
						tmp.me._videoIndex = parseInt($(this).down('a').innerHTML) - 1;
						$(this).up('.mainBlock').down('.video-container video').replace(tmp.me.getBasicVideoEl(tmp.me._videos[tmp.me._videoIndex].url));
						tmp.me.getDefinitions(tmp.me._videos[tmp.me._videoIndex]);
					})
				});
			tmp.index = tmp.index + 1;
		});
		return tmp.me;
	}
	,getDefinitions: function(video) {
		var tmp = {};
		tmp.me = pageJs;
		tmp.container = $('detailswrapper').down('.definitionContainer');
		tmp.container.update('');
		
		$H(video.definitions).each(function(type){
			tmp.container.insert({'bottom': new Element('ul').update('<strong>' + type.key + '</strong>')
				.insert({'bottom': tmp.typeRow = new Element('div')})
			});
			type.value.each(function(row){
				if(parseInt(row.order) < parseInt(tmp.order ? tmp.order : 0))
					tmp.typeRow.insert({'top': new Element('li', {'order': row.order}).update(row.content)});
				else tmp.typeRow.insert({'bottom': new Element('li', {'order': row.order}).update(row.content)});
				tmp.order = row.order;
			});
		});
	}
});