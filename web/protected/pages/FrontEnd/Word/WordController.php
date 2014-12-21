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
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs.setHTMLIDs(" . json_encode(array('resultDivId' => 'result-div', 'totalNoOfItemsId' => 'totalNoOfItemsId')) . ")";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .= ".setPropRelTypes(" . Role::ID_TENANT . ", " . Role::ID_AGENT .", " . Role::ID_OWNER . ")";
		$js .= ".getResults(true, 10);";
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
// 			$objects = Word::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array(), $stats);
			$objects = Word::getAll();
			
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
