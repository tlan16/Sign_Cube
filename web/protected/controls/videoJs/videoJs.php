<?php
/**
 * The Fancy Select Box
 *
 * @package    web
 * @subpackage controls
 * @author     lhe<helin16@gmail.com>
 */
class videoJs extends TClientScript
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
			
			$clientScript->registerHeadScriptFile('videoJs', $folder . '/video.js');
			$clientScript->registerStyleSheetFile('videoJsCss', $folder . '/video-js.css', 'screen');
		}
	}
}