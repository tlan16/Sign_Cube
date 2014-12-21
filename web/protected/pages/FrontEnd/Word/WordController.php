<?php
/**
 * This is the loginpage
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class WordController extends FrontEndPageAbstract
{
	
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs;";
		
		return $js;
	}
}
?>
