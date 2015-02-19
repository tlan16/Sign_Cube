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
		$results = $errors = $videos = array();
		try
		{
			Dao::beginTransaction();
			
			if(!isset($param->CallbackParameter->word) || !isset($param->CallbackParameter->word->id) || !isset($param->CallbackParameter->word->name) || !($wordName = trim($param->CallbackParameter->word->name)) === '')
				throw new Exception('Invalid Word passed in');
			if(!isset($param->CallbackParameter->word->languageId) || !($language = Language::get(trim($param->CallbackParameter->word->languageId))) instanceof Language)
				throw new Exception('Invalid Language passed in');
			if(!isset($param->CallbackParameter->word->categoryId) || !($cateogry = Category::get(trim($param->CallbackParameter->word->categoryId))) instanceof Category)
				throw new Exception('Invalid Category passed in');
			if(!isset($param->CallbackParameter->videos) || count($param->CallbackParameter->videos) < 1)
				throw new Exception('Invalid Video passed in');
			if(!isset($param->CallbackParameter->definitions) || count($definitionGroups = $param->CallbackParameter->definitions) < 1)
				throw new Exception('Nothing passed through');
			
			if(!($word = Word::get(trim($param->CallbackParameter->word->id))) instanceof Word)
				$word = Word::create($language, $cateogry, $wordName);
			foreach ($param->CallbackParameter->videos as $item)
			{
				if(!isset($item->id) || !isset($item->valid) || !($video = Video::get(trim($item->id))) instanceof Video)
					throw new Exception('Nothing passed through'); 
				if($item->valid === false) {
					$video->setActive(false)->save();
					$video->getAsset()->setActive(false)->save();
					if(count($wordVideos = WordVideo::getAllByCriteria('wordId = ? AND videoId = ?', array($word->getId(), $video->getId()), true , 1, 1)) > 0)
						$wordVideos[0]->setActive(false)->save();
				} elseif($item->valid === true)
				{
					WordVideo::create($word, $video);
					$videos[] = $video;
				}
			}
			
			foreach($definitionGroups as $definitionGroup)
			{
				if(!isset($definitionGroup->type) || ($type = trim($definitionGroup->type)) === '')
					throw new Exception('Invalid Definition Type passed in');
				if(!isset($definitionGroup->videoId) || (!($video = Video::get(trim($definitionGroup->videoId))) instanceof Video && $definitionGroup->videoId !== 'ALL'))
					throw new Exception('Invalid Video passed in');
				if(DefinitionType::get($definitionGroup->id) instanceof DefinitionType)
				{
					$definitionType = DefinitionType::get($definitionGroup->id);
					$definitionType->setName($type)->setActive($definitionGroup->valid)->save();
				}
				elseif ($definitionGroup->valid === true)
					$definitionType = DefinitionType::create($type);
				if(!isset($definitionGroup->rows) || count($rows = $definitionGroup->rows) < 1)
					throw new Exception('Invalid Definition passed in (definition type = ' . $type . '.');
				foreach ($rows as $row)
				{
					$order = preg_replace("/[^0-9]/","",$row->order); // only take numbers from string
					if(($definition = Definition::get($row->id)) instanceof Definition)
						$definition->setContent(trim($row->def))->setSequence($order)->setActive(($definitionGroup->valid === false) ? false : $row->valid)->save();
					elseif($definitionGroup->valid === true && $row->valid === true)
					{
						if($definitionGroup->videoId === 'ALL')
						{
							foreach ($videos as $video)
								$definition = Definition::create(trim($row->def), $definitionType, $video, $order);
						} else {
							$definition = Definition::create(trim($row->def), $definitionType, $video, $order);
						}
					}
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
			foreach(Word::getAllByCriteria('name = :searchTxt', array('searchTxt' => $searchTxt)) as $word)
			{
				$definitions = array();
				foreach (WordVideo::getAllByCriteria('wordId = ?', array($word->getId())) as $wordVideo)
				{
					foreach (Definition::getAllByCriteria('videoId = ?', array($wordVideo->getVideo()->getId())) as $definition)
					{
						$definitions[] = $definition->getJson();
					}
				}
				$items[] = $word->getJson(array('definitions'=> $definitions));
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
}
?>