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
		$js .= ".setCallbackId('saveWord', '" . $this->saveWordBtn->getUniqueID() . "')";
		$js .= ".setHTMLIds('detailswrapper', 'search_panel', 'uploader-div')";
		$js .= ".init(" . json_encode($category) . ");";
		return $js;
	}
	public function saveWord($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			
			if(!isset($param->CallbackParameter->word) || !isset($param->CallbackParameter->word->id) || !isset($param->CallbackParameter->word->name) || !($wordName = trim($param->CallbackParameter->word->name)) === '')
				throw new Exception('Invalid Word passed in');
			if(!isset($param->CallbackParameter->word->languageId) || !($language = Language::get(trim($param->CallbackParameter->word->languageId))) instanceof Language)
				throw new Exception('Invalid Language passed in');
			if(!isset($param->CallbackParameter->word->categoryId) || !($cateogry = Category::get(trim($param->CallbackParameter->word->categoryId))) instanceof Category)
				throw new Exception('Invalid Category passed in');
			if(!isset($param->CallbackParameter->asset->id) || !($asset = Asset::get(trim($param->CallbackParameter->asset->id))) instanceof Asset)
				throw new Exception('Invalid Asset passed in');
			if(!isset($param->CallbackParameter->video->id) || !($video = Video::get(trim($param->CallbackParameter->video->id))) instanceof Video || $video->getAsset()->getId() !== $asset->getId())
				throw new Exception('Invalid Video passed in');
			if(!isset($param->CallbackParameter->definitions) || count($definitionGroups = $param->CallbackParameter->definitions) < 1)
				throw new Exception('Nothing passed through');
			
			if(!($word = Word::get(trim($param->CallbackParameter->word->id))) instanceof Word)
				$word = Word::create($language, $cateogry, $wordName);
			
			foreach($definitionGroups as $definitionGroup)
			{
				if(!isset($definitionGroup->type) || ($type = $definitionGroup->type) === '')
					throw new Exception('Invalid Definition Type passed in');
				// TODO: if type if existing
				$definitionType = DefinitionType::create($type);
				if(!isset($definitionGroup->rows) || count($rows = $definitionGroup->rows) < 1)
					throw new Exception('Invalid Definition passed in (definition type = ' . $type . '.');
				foreach ($rows as $row)
				{
					$order = preg_replace("/[^0-9]/","",$row->order); // only take numbers from string
					Definition::create(trim($row->def), $definitionType, $word, $order);
				}
			}
			$results['item'] = array('name'=> $word->getName(), 'id'=> $word->getId());
			
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
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