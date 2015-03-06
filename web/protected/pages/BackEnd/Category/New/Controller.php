<?php
/**
 * This is the property list for the backend
 * 
 * @package    Web
 * @subpackage Controller
 * @author     tlan<tlan16@sina.com>
 */
class Controller extends BackEndPageAbstract
{
	protected $_focusEntity = 'Category';
	protected function _getEndJs()
	{
		$language = (isset($_REQUEST['languageid']) && ($language = Language::get(trim($_REQUEST['languageid']))) instanceof Language) ? $language->getJson() : null;
		
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('saveItem', '" . $this->saveItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('searchLanguage', '" . $this->searchLanguageBtn->getUniqueID() . "')";
		$js .= ".setHTMLIds('detailswrapper', 'search_panel')";
		$js .= ".init(" . json_encode($language) . ");";
		return $js;
	}
	/**
	 * Searching Customer
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * 
	 * @throws Exception
	 *
	 */
	public function searchLanguage($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			foreach(Language::getAllByCriteria('name like :searchTxt or code = :searchTxtExact', array('searchTxt' => $searchTxt . '%', 'searchTxtExact' => $searchTxt)) as $language)
			{
				$items[] = $language->getJson();
			}
			$results['items'] = $items;
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
	/**
	 * getting the focus entity
	 *
	 * @return string
	 */
	public function getFocusEntity()
	{
		return trim($this->_focusEntity);
	}
	/**
	 * Getting the items
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * @throws Exception
	 *
	 */
	public function getItems($sender, $param)
	{
		$results = $errors = array();
		try
		{
			var_dump($param->CallbackParameter);
			$class = trim($this->_focusEntity);
			
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			if(isset($param->CallbackParameter->pagination))
			{
				$pageNo = $param->CallbackParameter->pagination->pageNo;
				$pageSize = $param->CallbackParameter->pagination->pageSize;
			}
			if(!($language = Language::get($param->CallbackParameter->language->id)) instanceof Language)
    			throw new Exception("Invalid Language passed in!");
			
			$stats = array();
			$objects = $class::getAllByCriteria('cat.languageId = ?', array($language->getId()), false, $pageNo, $pageSize, array('cat.id' => 'asc'), $stats);
			
			$results['pageStats'] = $stats;
			$results['items'] = array();
			
			foreach($objects as $obj)
				$results['items'][] = $obj->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
	}
    /**
     * save the items
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function saveItem($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		var_dump($param->CallbackParameter->item);
    		
    		Dao::beginTransaction();
    			
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("No category information passed in!");
    		if(!($language = Language::get($param->CallbackParameter->item->languageId)) instanceof Language)
    			throw new Exception("Invalid Language passed in!");
    		if(!isset($param->CallbackParameter->item) || ($name = trim($param->CallbackParameter->item->category)) == '')
    			throw new Exception("Invalid Category Name passed in!");
    		
    		$item = $class::create($language, $name);
    		
    		Dao::commitTransaction();
    		
    		$results['item'] = array('category'=> $item->getJson(), 'language'=> $language->getJson());
    	}
    	catch(Exception $ex)
    	{
    		Dao::rollbackTransaction();
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
}
?>