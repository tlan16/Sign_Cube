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
	protected $_focusEntity = 'Category';
	
	
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= "._bindSearchKey()";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('saveItem', '" . $this->saveItemBtn->getUniqueID() . "')";
		$js .= ".setHTMLIds('item-list', 'searchPanel', 'total-found-count')";
		$js .= ".getResults(true, " . DaoQuery::DEFAUTL_PAGE_SIZE . ");";
		return $js;
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
			$class = trim($this->_focusEntity);
			$pageNo = 1;
			$pageSize = DaoQuery::DEFAUTL_PAGE_SIZE;
			if(isset($param->CallbackParameter->pagination))
			{
				$pageNo = $param->CallbackParameter->pagination->pageNo;
				$pageSize = $param->CallbackParameter->pagination->pageSize;
			}
			
			$serachCriteria = isset($param->CallbackParameter->searchCriteria) ? json_decode(json_encode($param->CallbackParameter->searchCriteria), true) : array();
			var_dump($serachCriteria);
				
			$where = array(1);
			$params = array();
			if(isset($serachCriteria['category.name']) && ($name = trim($serachCriteria['category.name'])) !== '')
			{
				$where[] = 'category.name like ?';
				$params[] = '%' . $name . '%';
			}
			if(isset($serachCriteria['language.name']) && ($language = trim($serachCriteria['language.name'])) !== '')
			{
				$where[] = 'language.name = ?';
				$params[] = $language;
			}
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('cat.id' => 'asc'), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
				$results['items'][] = array('category'=> $obj->getJson(), 'language'=>$obj->getLanguage()->getJson());
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
     * save the items
     *
     * @param unknown $sender
     * @param unknown $param
     * @throws Exception
     *
     */
    public function deactivateItems($sender, $param)
    {
    	$results = $errors = array();
    	try
    	{
    		$class = trim($this->_focusEntity);
    		$id = isset($param->CallbackParameter->item_id) ? $param->CallbackParameter->item_id : array();
    			
    		$item = $class::get($id);
    			
    		$item->setActive(false)
    			->save();
    		$results['item'] = $item->getJson();
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage() . $ex->getTraceAsString();
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
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		$item = (isset($param->CallbackParameter->item->id) && ($item = $class::get($param->CallbackParameter->item->id)) instanceof $class) ? $item : null;
    		$name = trim($param->CallbackParameter->item->category->name);
    		$language = trim($param->CallbackParameter->item->language->name);
    		$active = (!isset($param->CallbackParameter->item->active) || $param->CallbackParameter->item->active !== true ? false : true);
    			
    		if($item instanceof $class)
    		{
    			$item->setName($name)
    			->setLanguage($language)
    			->setActive($active)
    			->save();
    		}
    		else
    		{
    			$item = $class::create($language, $name);
    		}
    		$results['item'] = $item->getJson();
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
}
?>