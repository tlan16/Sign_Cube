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
	protected $_focusEntity = 'Word';
	protected function _getEndJs()
	{
		$categories = array_map(create_function('$a', 'return $a->getJson();'), Category::getAll(true, null, DaoQuery::DEFAUTL_PAGE_SIZE, array('name'=>'asc')));
		
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= "._bindSearchKey()";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('deactivateItems', '" . $this->deactivateItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('saveItem', '" . $this->saveItemBtn->getUniqueID() . "')";
		$js .= ".setHTMLIds('item-list', 'searchPanel', 'total-found-count')";
		$js .= ".getResults(true, " . DaoQuery::DEFAUTL_PAGE_SIZE . ");";
		$js .= "pageJs._categories=" . json_encode($categories);
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
			if(isset($serachCriteria['wd.name']) && ($name = trim($serachCriteria['wd.name'])) !== '')
			{
				$where[] = 'wd.name like ?';
				$params[] = '%' . $name . '%';
			}
			if(isset($serachCriteria['category.name']) && ($category = trim($serachCriteria['category.name'])) !== '')
			{
				$where[] = 'category.name = ?';
				$params[] = $category;
			}
			if(isset($serachCriteria['language.name']) && ($language = trim($serachCriteria['language.name'])) !== '')
			{
				$where[] = 'language.name = ?';
				$params[] = $language;
			}
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('wd.id' => 'asc'), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
				$results['items'][] = $obj->getJson(array('language'=> $obj->getLanguage()->getJson(), 'category'=>$obj->getCategory()->getJson()));
// 				$results['items'][] = array('category'=> $obj->getJson(), 'language'=>$obj->getLanguage()->getJson());
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
    		Dao::beginTransaction();
    		
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		if(!($word = Word::get(trim(($param->CallbackParameter->item->id)))) instanceof Word)
    			throw new Exception("Invalid Word passed in!");
    		if(($name = trim(($param->CallbackParameter->item->name))) === '')
    			throw new Exception("Invalid Name passed in!");
    		if(!($category = Category::get(trim(($param->CallbackParameter->item->category)))) instanceof Category)
    			throw new Exception("Invalid category passed in!");
    		if(!($language = Language::get(trim(($param->CallbackParameter->item->languageId)))) instanceof Language)
    			throw new Exception("Invalid language passed in!");
    		$active = trim($param->CallbackParameter->item->active);
    		
    		$word->setName($name)
    			->setActive($active)
    			->setLanguage($category->getLanguage())
    			->setCategory($category)
    			->save();
    		
			$results['item'] = $word->getJson(array('language'=> $word->getLanguage()->getJson(), 'category'=>$word->getCategory()->getJson()));
    		Dao::commitTransaction();
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