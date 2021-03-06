<?php
/**
 * SystemSettings
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class SystemSettings extends BaseEntityAbstract
{
	const TYPE_ASSET_ROOT_DIR = 'asset_root';
	const TYPE_EMAIL_SENDING_SERVER = 'sending_server_conf';
	const TYPE_EMAIL_DEFAULT_SYSTEM_EMAIL = 'sys_email_addr';
	/**
	 * The value of the setting
	 * 
	 * @var string
	 */
	private $value;
	/**
	 * The type of the setting
	 * 
	 * @var string
	 */
	private $type;
	/**
	 * The description
	 * 
	 * @var string
	 */
	private $description;
	/**
	 * Getting Settings Object
	 * 
	 * @param string $type The type string
	 * 
	 * @return String
	 */
	public static function getSettings($type)
	{
		if(!self::cacheExsits($type))
		{
			$settings = self::getAllByCriteria('type = ?', array($type), true, 1, 1);
			self::addCache($type, (trim(count($settings) === 0 ? '' : $settings[0]->getValue())));
		}
		return self::getCache($type);
	}
	/**
	 * adding a new Settings Object
	 * 
	 * @param string $type The type string
	 * 
	 * @return SystemSettings
	 */
	public static function addSettings($type, $value)
	{
		$class = __CLASS__;
		$settings = self::getAllByCriteria('type=?', array($type), true, 1, 1);
		$setting = ((count($settings) === 0 ? new $class() : $settings[0]));
		$setting->setType($type)
			->setValue($value)
			->setActive(true)
			->save();
		self::addSettings($type, $value);
		return $setting;
	}
	/**
	 * Removing Settings Object
	 * 
	 * @param string $type The type string
	 */
	public static function removeSettings($type)
	{
		self::updateByCriteria('set active = 0', 'type = ?', array($type));
		if(self::cacheExsits($type))
			self::removeCache($type);
		return true;
	}
	/**
	 * Getter for value
	 *
	 * @return int
	 */
	public function getValue() 
	{
	    return $this->value;
	}
	/**
	 * Setter for value
	 *
	 * @param sting $value The value
	 *
	 * @return SystemSettings
	 */
	public function setValue($value) 
	{
	    $this->value = $value;
	    return $this;
	}
	/**
	 * Getter for type
	 *
	 * @return int
	 */
	public function getType()
	{
		return $this->type;
	}
	/**
	 * Setter for type
	 *
	 * @param sting $type The type
	 *
	 * @return SystemSettings
	 */
	public function setType($type)
	{
		$this->type = $type;
		return $this;
	}
	/**
	 * Getter for description
	 *
	 * @return string
	 */
	public function getDescription() 
	{
	    return $this->description;
	}
	/**
	 * Setter for description
	 *
	 * @param string $value The description
	 *
	 * @return SystemSettings
	 */
	public function setDescription($value) 
	{
	    $this->description = $value;
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'syssettings');
	
		DaoMap::setStringType('type','varchar', 50);
		DaoMap::setStringType('value','varchar', 255);
		DaoMap::setStringType('description','varchar', 100);
	
		parent::__loadDaoMap();
	
		DaoMap::createUniqueIndex('type');
		DaoMap::commit();
	}
}