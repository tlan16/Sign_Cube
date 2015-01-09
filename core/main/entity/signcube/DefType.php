<?php
/**
 * DefType Entity
 *  - the type of defination, eg. varb, noun, verb & noun
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class DefType extends BaseEntityAbstract
{
	/**
	 * The name of DefType
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
	 * Getter for DefType
	 * 
	 * @return DefType
	 */
	public function getDefType()
	{
		$this->loadManyToOne("defType");
		return $this->defType;
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
		DaoMap::setStringType('name', 'varchar', 50);
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
		$entity = new DefType();
		return $entity->setName($name)
		->save()
		->addLog(Log::TYPE_SYS, 'DefType (' . $name . ') created now');
	}
	// TODO: relationship
}