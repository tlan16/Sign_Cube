/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BackEndPageJs(), {
	load: function(item) {
		var tmp = {};
		tmp.me = this;
		console.debug(jQuery('#fileupload'));
		jQuery('#fileupload').fileupload({
			url: '/fileUploader/'
		    ,progressall: function (e, data) {
		    	
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        jQuery('#progress .bar').css(
		            'width',
		            progress + '%'
		        );
		    }
		});
		
		return tmp.me;
	}
});