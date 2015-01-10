<?php
/**
 * Category Entity
 *  - sign lanuage category
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class Category extends BaseEntityAbstract
{
	/**
	 * The name of category
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
	 * @param string $value The Name
	 * 
	 * @return Category
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * Getter for Category
	 * 
	 * @return Category
	 */
	public function getCategory()
	{
		$this->loadManyToOne("category");
		return $this->category;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new EntityException('Name can NOT be empty', 'exception_entity_category_name_empty');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'cat');
		DaoMap::setStringType('name', 'varchar', 50);
		parent::__loadDaoMap();
	
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * creating a category
	 *
	 * @param unknown $name
	 *
	 * @return Category
	 */
	public static function create($name)
	{
		$entity = new Category();
		return $entity->setName($name)
		->save()
		->addLog(Log::TYPE_SYS, 'Category (' . $name . ') created now');
	}
	// TODO: relationship
}
?>