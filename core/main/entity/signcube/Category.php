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
	 * The Word language
	 *
	 * @var Language
	 */
	protected $language;
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
	 * Getter for language
	 *
	 * @return Language
	 */
	public function getLanguage()
	{
		$this->loadManyToOne('language');
		return $this->language;
	}
	/**
	 * Setter for language
	 *
	 * @param Language $value The language
	 *
	 * @return Category
	 */
	public function setLanguage(Language $value)
	{
		$this->language = $value;
		return $this;
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
		DaoMap::setManyToOne('language', 'Language', 'cat_lang', false);
		parent::__loadDaoMap();
	
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * overload parent
	 *
	 * @param bool $reset Forcing the function to fetch data from the database again
	 *
	 * @return array The associative arary for json
	 */
	public function getJson($extra = array(), $reset = false)
	{
		$array = array('language'=> $this->getLanguage()->getJson());
		return parent::getJson($array);
	}
	/**
	 * creating a category
	 *
	 * @param Language	$language
	 * @param unknown 	$name
	 *
	 * @return Category
	 */
	public static function create(Language $language, $name)
	{
		$existingEntity = self::getAllByCriteria('name = ?', array(trim($name)));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new Category();
		return $entity->setLanguage($language)
			->setName($name)
			->save()
			->addLog(Log::TYPE_SYS, 'Category (' . $name . ') with Language(' . $language->getName() . ')' . (count($existingEntity) > 0 ? 'updated' : 'created') . 'now', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>