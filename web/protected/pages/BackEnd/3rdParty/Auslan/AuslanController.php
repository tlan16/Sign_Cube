<?php
/**
 * This is the loginpage
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class AuslanController extends FrontEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see FrontEndPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .="pageJs";
		$js .="._setHtmlIds('auslan_container', 'words_div_container')";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .=".load();";
		return $js;
	}
	/**
	 * Getting the items list
	 *
	 * @param TCallback          $sender
	 * @param TCallbackParameter $param
	 *
	 * @return Controller
	 */
	public function getItems($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
				
			if(isset($param->CallbackParameter->pagination))
			{
				$pageNo = $param->CallbackParameter->pagination->pageNo;
				$pageSize = $param->CallbackParameter->pagination->pageSize;
			}
			$serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();
			$where = array(1);
			$params = array();
			$stats = array();
				
// 			$objects = Message::getAllByCriteria('msg.fromId = :personId or msg.toId = :personId', array('personId'=>  Core::getUser()->getPerson()->getId()), true, $pageNo, $pageSize, array(), $stats);
			$objects = AuslanWord::getAll(true, $pageNo, $pageSize, array(), $stats);
				
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
			{
				$array = $obj->getJson();
				$results['items'][] = $array;
			}
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
		return $this;
	}
}
?>