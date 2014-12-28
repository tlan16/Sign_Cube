<?php
/**
 * The mediaElements
 *
 * @package    web
 * @subpackage controls
 * @author     lhe<helin16@gmail.com>
 */
class mediaElements extends TClientScript
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
// 			$clientScript->registerHeadScriptFile('mediaElementJs.jquery.js', $folder . '/jquery.js');
			$clientScript->registerHeadScriptFile('mediaElementJs.js', $folder . '/mediaelement-and-player.js');
			$clientScript->registerStyleSheetFile('mediaElementJs.css', $folder . '/mediaelementplayer.css');
		}
	}
}