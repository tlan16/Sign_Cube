<?php
/**
 * DefinitionType Entity
 *  - the type of defination, eg. varb, noun, verb & noun
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class DefinitionType extends BaseEntityAbstract
{
	/**
	 * The name of DefinitionType
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
	 * @return DefType
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
			throw new EntityException('Name can NOT be empty', 'exception_entity_defType_name_empty');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'deftp');
		DaoMap::setStringType('name', 'varchar', 64);
		parent::__loadDaoMap();
	
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * creating a DefType
	 *
	 * @param unknown $name
	 *
	 * @return DefType
	 */
	public static function create($name)
	{
		$entity = new DefinitionType();
		return $entity->setName($name)
			->save()
			->addLog(Log::TYPE_SYS, 'DefinitionType (' . $name . ') created now', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>