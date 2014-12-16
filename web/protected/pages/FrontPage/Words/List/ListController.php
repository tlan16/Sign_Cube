<?php
/**
 * This is the listing page for customer
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ListController extends FrontPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'words';
	protected $_focusEntity = 'Word';
	/**
	 * constructor
	 */
	public function __construct()
	{
		parent::__construct();
	}
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs";
		return $js;
	}
}
?>
