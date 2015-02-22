<?php
/**
 * ThirdParty Definition Entity
 *  - the content row of defination
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class ThirdPartyDefinition extends BaseEntityAbstract
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
	 * The ThirdPartyVideo of Definition
	 *
	 * @var ThirdPartyVideo
	 */
	protected $thirdPartyVideo;
	/**
	 * The ThirdPartyDefinitionType of Definition
	 *
	 * @var ThirdPartyDefinitionType
	 */
	protected $thirdPartyDefinitionType;
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
	 * @return ThirdPartyDefinition
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
	 * @return ThirdPartyDefinition
	 */
	public function setSequence($value)
	{
		$this->sequence = $value;
		return $this;
	}
	/**
	 * Getter for thirdPartyVideo
	 *
	 * @return ThirdPartyVideo
	 */
	public function getThirdPartyVideo() 
	{
		$this->loadManyToOne('thirdPartyVideo');
	    return $this->thirdPartyVideo;
	}
	/**
	 * Setter for thirdPartyVideo
	 *
	 * @param ThirdPartyVideo $value The thirdPartyVideo
	 *
	 * @return ThirdPartyDefinition
	 */
	public function setThirdPartyVideo(ThirdPartyVideo $value) 
	{
	    $this->thirdPartyVideo = $value;
	    return $this;
	}
	/**
	 * Getter for thirdPartyDefinitionType
	 *
	 * @return ThirdPartyDefinitionType
	 */
	public function getThirdPartyDefinitionType() 
	{
		$this->loadManyToOne('thirdPartyDefinitionType');
	    return $this->thirdPartyDefinitionType;
	}
	/**
	 * Setter for thirdPartyDefinitionType
	 *
	 * @param ThirdPartyDefinitionType $value thirdPartyDefinitionType
	 *
	 * @return ThirdPartyDefinition
	 */
	public function setThirdPartyDefinitionType(ThirdPartyDefinitionType $value) 
	{
	    $this->thirdPartyDefinitionType = $value;
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
		DaoMap::begin($this, 'trddef');
		DaoMap::setStringType('content', 'TEXT', 1000);
		DaoMap::setIntType('sequence');
		DaoMap::setManyToOne('thirdPartyVideo', 'ThirdPartyVideo', 'trddef_trdvid', false);
		DaoMap::setManyToOne('thirdPartyDefinitionType', 'ThirdPartyDefinitionType', 'trddef_trddeftp', false);
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
		return parent::getJson(array_merge($extra, array('video'=> $this->getThirdPartyVideo()->getJson(), 'definitionType'=> $this->getThirdPartyDefinitionType()->getJson())));
	}
	/**
	 * creating a Definition
	 *
	 * @param string 					$content
	 * @param ThirdPartyDefinitionType 	$thirdPartyDefinitionType
	 * @param ThirdPartyVideo			$thirdPartyVideo
	 * @param int 	 					$sequence
	 *
	 * @return ThirdPartyDefinition
	 */
	public static function create($content, ThirdPartyDefinitionType $thirdPartyDefinitionType, ThirdPartyVideo $thirdPartyVideo, $sequence = 0)
	{
		$existingEntity = self::getAllByCriteria('content = ? AND thirdPartyVideoId = ? AND thirdPartyDefinitionTypeId = ?', array(trim($content),$thirdPartyVideo->getId(), $thirdPartyDefinitionType->getId()));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new self();
		return $entity->setContent($content)
			->setSequence($sequence)
			->setThirdPartyDefinitionType($thirdPartyDefinitionType)
			->setThirdPartyVideo($thirdPartyVideo)
			->save();
	}
}
?>