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
		$category = (isset($_REQUEST['categoryid']) && ($category = Category::get(trim($_REQUEST['categoryid']))) instanceof Category) ? $category->getJson(array('language'=> $category->getLanguage()->getJson())) : null;
		$js = parent::_getEndJs();
		$js .= "pageJs";
		$js .= ".setCallbackId('getItems', '" . $this->getItemsBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('saveItem', '" . $this->saveItemBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('searchCategory', '" . $this->searchCategoryBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('searchWord', '" . $this->searchWordBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('getDefTypes', '" . $this->getDefTypesBtn->getUniqueID() . "')";
		$js .= ".setHTMLIds('detailswrapper', 'search_panel', 'uploader-div')";
		$js .= ".init(" . json_encode($category) . ");";
		return $js;
	}
	public function getDefTypes($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			foreach(DefinitionType::getAll(true, 1, 99, array('deftp.name'=> 'asc')) as $defType)
			{
				$items[] = $defType->getJson();
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
	 * Searching Word
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * 
	 * @throws Exception
	 *
	 */
	public function searchWord($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			foreach(Word::getAllByCriteria('name like :searchTxt', array('searchTxt' => $searchTxt . '%')) as $word)
			{
				$items[] = $word->getJson();
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
	 * Searching Category
	 *
	 * @param unknown $sender
	 * @param unknown $param
	 * 
	 * @throws Exception
	 *
	 */
	public function searchCategory($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$items = array();
			$searchTxt = isset($param->CallbackParameter->searchTxt) ? trim($param->CallbackParameter->searchTxt) : '';
			foreach(Category::getAllByCriteria('name like :searchTxt', array('searchTxt' => $searchTxt . '%')) as $category)
			{
				$items[] = $category->getJson(array('language'=> $category->getLanguage()->getJson()));
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