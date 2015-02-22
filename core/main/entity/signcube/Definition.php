<?php
/**
 * Definition Entity
 *  - the content row of defination
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class Definition extends BaseEntityAbstract
{
	/**
	 * The content of DefRow
	 */
	private $content;
	/**
	 * The sequence of DefRow
	 */
	private $sequence;
	/**
	 * The Video of Definition
	 *
	 * @var Video
	 */
	protected $video;
	/**
	 * The DefinitionType of Definition
	 *
	 * @var DefinitionType
	 */
	protected $definitionType;
	/**
	 * Getter for content
	 * 
	 * @return content
	 */
	public function getContent()
	{
		return $this->content;
	}
	/**
	 * Setter for content
	 * 
	 * @param string $value The content
	 * 
	 * @return Definition
	 */
	public function setContent($value)
	{
		$this->content = trim($value);
		return $this;
	}
	/**
	 * Getter for sequence
	 * 
	 * @return sequence
	 */
	public function getSequence()
	{
		return $this->sequence;
	}
	/**
	 * Setter for sequence
	 * 
	 * @param string $value The sequence
	 * 
	 * @return Definition
	 */
	public function setSequence($value)
	{
		$this->sequence = $value;
		return $this;
	}
	/**
	 * Getter for video
	 *
	 * @return Video
	 */
	public function getVideo() 
	{
		$this->loadManyToOne('video');
	    return $this->video;
	}
	/**
	 * Setter for video
	 *
	 * @param Video $value The video
	 *
	 * @return Definition
	 */
	public function setVideo(Video $value) 
	{
	    $this->video = $value;
	    return $this;
	}
	/**
	 * Getter for DefinitionType
	 *
	 * @return DefinitionType
	 */
	public function getDefinitionType() 
	{
		$this->loadManyToOne('definitionType');
	    return $this->definitionType;
	}
	/**
	 * Setter for DefinitionType
	 *
	 * @param DefinitionType $value The definitionType
	 *
	 * @return Definition
	 */
	public function setDefinitionType(DefinitionType $value) 
	{
	    $this->definitionType = $value;
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getContent()) === '')
			throw new EntityException('Content can NOT be empty', 'exception_entity_defRow_content_empty');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'def');
		DaoMap::setStringType('content', 'TEXT', 1000);
		DaoMap::setIntType('sequence');
		DaoMap::setManyToOne('video', 'Video', 'def_vid', false);
		DaoMap::setManyToOne('definitionType', 'DefinitionType', 'def_deftp', false);
		parent::__loadDaoMap();
		
		DaoMap::commit();
	}
	/**
	 * overload parent getJson
	 *
	 * @param bool $reset Forcing the function to fetch data from the database again
	 *
	 * @return array The associative arary for json
	 */
	public function getJson($extra = array(), $reset = false)
	{
		return parent::getJson(array_merge($extra, array('video'=> $this->getVideo()->getJson(), 'definitionType'=> $this->getDefinitionType()->getJson())));
	}
	/**
	 * creating a Definition
	 *
	 * @param string 			$content
	 * @param DefinitionType 	$definitionType
	 * @param Video				$video
	 * @param int 	 			$sequence
	 *
	 * @return Definition
	 */
	public static function create($content, DefinitionType $definitionType, Video $video, $sequence = 0)
	{
		$existingEntity = self::getAllByCriteria('content = ? AND videoId = ? AND definitionTypeId = ?', array(trim($content),$video->getId(), $definitionType->getId()));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new Definition();
		return $entity->setContent($content)
			->setSequence($sequence)
			->setDefinitionType($definitionType)
			->setVideo($video)
			->save()
			->addLog(Log::TYPE_SYS, 'Definition (' . $content . ') with Video (ID=' . $video->getId() . ') with DefinitionType(' . $definitionType->getName() . ') ' . (count($existingEntity) > 0 ? 'updated' : 'created') . 'now with an sequence: ' . $sequence . ')', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>