<?php
/**
 * This is the property list for the backend
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class Controller extends BackEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
 		$js .= "._init();";
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
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE / 3;
			
			$array = array();
			
			foreach (AuslanVideo::getAll() as $video)
				$array[] = $video->getJson();
			 
			$results['items'] = $array;
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