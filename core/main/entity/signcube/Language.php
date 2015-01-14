<?php
/**
 * LanguageType Entity
 *  - the spoken language type of the Word
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class Language extends BaseEntityAbstract
{
	/**
	 * The name of Language
	 */
	private $name;
	/**
	 * The code of Language
	 * 	the language code used for google translate api
	 */
	private $code;
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
	 * @return Language
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * Getter for code
	 * 
	 * @return code
	 */
	public function getCode()
	{
		return $this->code;
	}
	/**
	 * Setter for code
	 * 
	 * @param string $value The code
	 * 
	 * @return Language
	 */
	public function setCode($value)
	{
		$this->code = trim($value);
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
		DaoMap::setStringType('name', 'varchar', 32);
		DaoMap::setStringType('code', 'varchar', 16);
		parent::__loadDaoMap();
		
		DaoMap::createIndex('name');
		DaoMap::createIndex('code');
		DaoMap::commit();
	}
	/**
	 * creating a LanguageType
	 *
	 * @param unknown $name
	 *
	 * @return LanguageType
	 */
	public static function create($name, $code = '')
	{
		$existingEntity = self::getAllByCriteria('name = ? OR code = ?', array(trim($name), trim($code)));
		if(count($existingEntity) > 0)
			return $existingEntity[0]->setName($name)
				->setCode($code)
				->save()
				->addLog(Log::TYPE_SYS, 'Language (' . $name . ') with code(' . $code . ') updated now', __CLASS__ . '::' . __FUNCTION__);
		else
		{
			$entity = new Language();
			return $entity->setName($name)
				->setCode($code)
				->save()
				->addLog(Log::TYPE_SYS, 'Language (' . $name . ') with code(' . $code . ') created now', __CLASS__ . '::' . __FUNCTION__);
		}
	}
}
?>