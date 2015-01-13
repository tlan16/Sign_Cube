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
	 * The Word of Definition
	 *
	 * @var Word
	 */
	protected $word;
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
	 * @return DefRow
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
	 * @return DefRow
	 */
	public function setSequence($value)
	{
		$this->sequence = $value;
		return $this;
	}
	/**
	 * Getter for word
	 *
	 * @return Word
	 */
	public function getWord() 
	{
		$this->loadManyToOne('word');
	    return $this->word;
	}
	/**
	 * Setter for word
	 *
	 * @param Word $value The word
	 *
	 * @return Definition
	 */
	public function setWord(Word $value) 
	{
	    $this->word = $value;
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
		DaoMap::setManyToOne('word', 'Word', 'def_wd', false);
		DaoMap::setManyToOne('definitionType', 'DefinitionType', 'def_deftp', false);
		parent::__loadDaoMap();
		
		DaoMap::commit();
	}
	/**
	 * creating a Definition
	 *
	 * @param unknown 			$content
	 * @param DefinitionType 	$definitionType
	 * @param unknown 			$sequence
	 *
	 * @return Definition
	 */
	public static function create($content, DefinitionType $definitionType,$sequence = 0)
	{
		$entity = new Definition();
		return $entity->setContent($content)
			->setSequence($sequence)
			->setDefinitionType($definitionType)
			->save()
			->addLog(Log::TYPE_SYS, 'Definition (' . $content . ') with DefinitionType(' . $definitionType->getName() . ') created now with an sequence: ' . $sequence . ')', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>