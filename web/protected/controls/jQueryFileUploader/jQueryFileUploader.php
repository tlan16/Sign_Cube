<?php
/**
 * The Fancy Select Box
 *
 * @package    web
 * @subpackage controls
 * @author     lhe<helin16@gmail.com>
 */
class jQueryFileUploader extends TClientScript
{
	/**
	 * (non-PHPdoc)
	 * @see TControl::onLoad()
	 */
	public function onLoad($param)
	{
		if(!$this->getPage()->IsPostBack || !$this->getPage()->IsCallback)
		{
			$clientScript = $this->getPage()->getClientScript();
			$folder = $this->publishFilePath(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR);
			// Add jQuery library
			// Add mousewheel plugin (this is optional)
			$clientScript->registerHeadScriptFile('jQueryFileUploader.jquery.ui.widget.js', $folder . '/js/vendor/jquery.ui.widget.js');
			$clientScript->registerHeadScriptFile('jQueryFileUploader.fileupload.js', $folder . '/js/jquery.fileupload.js');
			$clientScript->registerHeadScriptFile('jQueryFileUploader.iframe-transport.js', $folder . '/js/jquery.iframe-transport.js');
			$clientScript->registerStyleSheetFile('select2.css.bootstrap', $folder . '/css/jquery.fileupload-noscript.css', 'screen');
			$clientScript->registerStyleSheetFile('select2.css.bootstrap', $folder . '/css/jquery.fileupload-ui-noscript.css', 'screen');
		}
	}
}