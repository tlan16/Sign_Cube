<?php
/**
 * This is the loginpage
 * 
 * @package    Web
 * @subpackage Controller
 * @author     tlan<tlan16@sina.com>
 */
class Controller extends FrontEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see FrontEndPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .="pageJs";
		$js .=".init()";
		return $js;
	}
}
?>