<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Word extends BaseEntityAbstract
{
	/**
	 * The name of the word
	 * 
	 * @var string
	 */
	private $name;
	/**
	 * The video of the word
	 * 
	 * @var string
	 */
	private $video;
	/**
	 * Getter for name
	 *
	 * @return string
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
	 * @return Word
	 */
	public function setName($value) 
	{
	    $this->name = $value;
	    return $this;
	}
	/**
	 * Getter for video
	 *
	 * @return string
	 */
	public function getVideo() 
	{
	    return $this->video;
	}
	/**
	 * Setter for video
	 *
	 * @param string $value The video
	 *
	 * @return Word
	 */
	public function setVideo($value) 
	{
	    $this->video = $value;
	    return $this;
	}
	public function preSave()
	{
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::getJson()
	 */
	public function getJson($extra = '', $reset = false)
	{
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'word');
	
		DaoMap::setStringType('name','varchar', 32);
		DaoMap::setStringType('video','varchar', 128);
	
		parent::__loadDaoMap();
	
		DaoMap::createIndex('name');
		DaoMap::createIndex('video');
	
		DaoMap::commit();
	}
	/**
	 * Creating a address object
	 *
	 * @param string $name       The name of the word
	 * @param string $video         The video of the word
	 *
	 * @return Address
	 */
	public static function create($name, $video)
	{
		$obj = new Word();
		return $obj->setName($name)
			->setVideo($video)
			->save();
	}
}