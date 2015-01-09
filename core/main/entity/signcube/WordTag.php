<?php
/**
 * Tag Entity
 *  - the tag of the Word
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class WordTag extends BaseEntityAbstract
{
	/**
	 * The name of WordTag
	 */
	private $name;
	/**
	 * Getter for name
	 * 
	 * @return name
	 */
	public function getName()
	{
		return $this->name;
	}
	/**
	 * Setter for name
	 * 
	 * @param string $value The name
	 * 
	 * @return WordTag
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * Getter for WordTag
	 * 
	 * @return WordTag
	 */
	public function getWordTag()
	{
		$this->loadManyToOne("wordTag");
		return $this->wordTag;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new EntityException('Name can NOT be empty', 'exception_entity_wordTag_name_empty');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'wtag');
		DaoMap::setStringType('name', 'varchar', 50);
		parent::__loadDaoMap();
		
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * creating a WordTag
	 *
	 * @param unknown $name
	 *
	 * @return WordTag
	 */
	public static function create($name)
	{
		$entity = new WordTag();
		return $entity->setName($name)
			->save()
			->addLog(Log::TYPE_SYS, 'WordTag (' . $name . ') created now');
	}
	// TODO: relationship
}