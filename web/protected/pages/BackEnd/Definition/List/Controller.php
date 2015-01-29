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
	protected $_focusEntity = 'Definition';
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
				
			$where = array(1);
			$params = array();
			if(isset($serachCriteria['def.content']) && ($content = trim($serachCriteria['def.content'])) !== '')
			{
				$where[] = 'def.content like ?';
				$params[] = '%' . $content . '%';
			}
			$stats = array();
			$objects = $class::getAllByCriteria(implode(' AND ', $where), $params, false, $pageNo, $pageSize, array('def.id' => 'desc'), $stats);
			$results['pageStats'] = $stats;
			$results['items'] = array();
			foreach($objects as $obj)
			{
				$word = $obj->getWord();
				$definitionType = $obj->getDefinitionType();
				$category = $word->getCategory();
				$results['items'][] = array('id'=> $obj->getId(), 'active'=> $obj->getActive(), 'content'=> $obj->getContent(),'sequence'=> $obj->getSequence()
										,'word'=> $word->getName(),'wordId'=> $word->getId(), 'category'=> $category->getName(), 'categoryId'=> $category->getId()
										,'definitionType'=> $definitionType->getName(), 'definitionTypeId'=> $definitionType->getId()
				);
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
    			
    		$obj = $class::get($id);
    			
    		$obj->setActive(false)
    			->save();
    		
    		$word = $obj->getWord();
    		$definitionType = $obj->getDefinitionType();
    		$category = $word->getCategory();
    		$results['item'] = array('id'=> $obj->getId(), 'active'=> $obj->getActive(), 'content'=> $obj->getContent(),'sequence'=> $obj->getSequence()
    				,'word'=> $word->getName(),'wordId'=> $word->getId(), 'category'=> $category->getName(), 'categoryId'=> $category->getId()
    				,'definitionType'=> $definitionType->getName(), 'definitionTypeId'=> $definitionType->getId()
    		);
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
    		Dao::beginTransaction();
    		
    		$class = trim($this->_focusEntity);
    		if(!isset($param->CallbackParameter->item))
    			throw new Exception("System Error: no item information passed in!");
    		if(!isset($param->CallbackParameter->item->id) || !($definition = Definition::get(trim($param->CallbackParameter->item->id))) instanceof Definition)
    			throw new Exception("Invalid Definition passed in");
    		if(!isset($param->CallbackParameter->item->wordId) || !($word = Word::get(trim($param->CallbackParameter->item->wordId))) instanceof Word)
    			throw new Exception("Invalid Word passed in");
    		if(!isset($param->CallbackParameter->item->categoryId) || !($category = Category::get(trim($param->CallbackParameter->item->categoryId))) instanceof Category)
    			throw new Exception("Invalid Category passed in");
    		if(!isset($param->CallbackParameter->item->definitionTypeId) || !($definitionType = DefinitionType::get(trim($param->CallbackParameter->item->definitionTypeId))) instanceof DefinitionType)
    			throw new Exception("Invalid Definition Type passed in");
    		$content = trim($param->CallbackParameter->item->content);
    		$sequence = trim($param->CallbackParameter->item->sequence) === '' ? 0 : intval(trim($param->CallbackParameter->item->sequence));
    		
    		$definition->setContent($content)->setSequence($sequence)->save();
    		
    		$results['item']= array('id'=> $definition->getId(), 'active'=> $definition->getActive(), 'content'=> $definition->getContent(),'sequence'=> $definition->getSequence()
    				,'word'=> $word->getName(),'wordId'=> $word->getId(), 'category'=> $category->getName(), 'categoryId'=> $category->getId()
    				,'definitionType'=> $definitionType->getName(), 'definitionTypeId'=> $definitionType->getId()
    		);
    	}
    	catch(Exception $ex)
    	{
    		$errors[] = $ex->getMessage();
    	}
    	$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
    }
}
?>