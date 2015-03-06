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
		$languages = array_map(create_function('$a', 'return $a->getJson();'), Language::getAll(true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('name'=>'asc')));
		
		$js = parent::_getEndJs();
		$js .= "pageJs._languages=" . json_encode($languages) . ";";
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
				
			$where = array(1);
			$params = array();
			$query = Category::getQuery();
			if(isset($serachCriteria['cat.name']) && ($name = trim($serachCriteria['cat.name'])) !== '')
			{
				$where[] = 'cat.name like ?';
				$params[] = '%' . $name . '%';
			}
			if(isset($serachCriteria['cat.lang.id']) && ($languageId = trim($serachCriteria['cat.lang.id'])) !== '')
			{
				$query->eagerLoad("Category.language", 'inner join', 'lang', 'lang.id = cat.languageId');
				$where[] = 'cat.languageId = ?';
				$params[] = $languageId;
			}
			$stats = array();
			$objects = Category::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('cat.id' => 'asc'), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
			{
				$language = $obj->getLanguage();
				$results['items'][] = array('id'=> $obj->getId(), 'name'=> $obj->getName(), 'active'=> $obj->getActive()
						, 'langId'=> $language->getId(), 'langName'=> $language->getName(), 'langCode'=> $language->getCode());
			}
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
    		$language = $item->getLanguage();
    		$results['item'] = array('id'=> $item->getId(), 'name'=> $item->getName(), 'active'=> $item->getActive()
    				, 'langId'=> $language->getId(), 'langName'=> $language->getName(), 'langCode'=> $language->getCode());
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
    		$class = trim($this->_focusEntity);
    		
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		if(!isset($param->CallbackParameter->item->id))
    			throw new Exception("System Error: Invalid Category passed in!");
    		if(!isset($param->CallbackParameter->item->langId) || !($language = Language::get(trim($param->CallbackParameter->item->langId))) instanceof Language)
    			throw new Exception("System Error: Invalid Language passed in!");
    		$name = trim($param->CallbackParameter->item->name);
    		$active = (!isset($param->CallbackParameter->item->active) || $param->CallbackParameter->item->active !== true ? false : true);
    		
    		$category = Category::get(trim($param->CallbackParameter->item->id));
    		if($category instanceof Category)
    		{
    			$item = $category->setName($name)
    			->setActive($active)
    			->setLanguage($language)
    			->save();
    		}
    		else
    		{
    			$item = Category::create($language, $name);
    		}
    		$language = $item->getLanguage();
    		$results['item'] = array('id'=> $item->getId(), 'name'=> $item->getName(), 'active'=> $item->getActive()
    				, 'langId'=> $language->getId(), 'langName'=> $language->getName(), 'langCode'=> $language->getCode());
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
}
?>