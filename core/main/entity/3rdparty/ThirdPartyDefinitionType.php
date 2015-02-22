<?php
/**
 * ThirdParty DefinitionType Entity
 *  - the type of defination, eg. varb, noun, verb & noun
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class ThirdPartyDefinitionType extends BaseEntityAbstract
{
	/**
	 * The name of ThirdPartyDefinitionType
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
	 * @return ThirdPartyDefinitionType
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
		DaoMap::begin($this, 'trddeftp');
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
		$existingEntity = self::getAllByCriteria('name = ?', array(trim($name)));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new self();
		return $entity->setName($name)
			->save()
			->addLog(Log::TYPE_SYS, 'DefinitionType (' . $name . ') ' . (count($existingEntity) > 0 ? 'updated' : 'created') . 'now', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>