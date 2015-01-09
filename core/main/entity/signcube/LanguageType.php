<?php
/**
 * LanguageType Entity
 *  - the spoken language type of the Word
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class LanguageType extends BaseEntityAbstract
{
	/**
	 * The name of LanguageType
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
	 * @return LanguageType
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new EntityException('Name can NOT be empty', 'exception_entity_languageType_name_empty');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'lang');
		DaoMap::setStringType('name', 'varchar', 50);
		parent::__loadDaoMap();
		
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * creating a LanguageType
	 *
	 * @param unknown $name
	 *
	 * @return LanguageType
	 */
	public static function create($name)
	{
		$entity = new LanguageType();
		return $entity->setName($name)
			->save()
			->addLog(Log::TYPE_SYS, 'LanguageType (' . $name . ') created now');
	}
	// TODO: relationship
}