<?php
/**
 * This is the property list for the backend
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class NewWOrdController extends BackEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$property = new Property();
		$js = parent::_getEndJs();
		$js .= "pageJs._setHtmlIds('new_word_main_container')";
		$js .= ".load();";
		return $js;
	}
}
?>