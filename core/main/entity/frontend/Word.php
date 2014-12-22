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
	    $this->name = trim($value);
	    return $this;
	}
	/**
	 * Getter for video
	 *
	 * @return string
	 */
	public function getVideo() 
	{
// 	    return $this->video;
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
// 	    $this->video = $value;
// 	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'word');
	
		DaoMap::setStringType('name','varchar', 32);
	
		parent::__loadDaoMap();
	
		DaoMap::createIndex('name');
	
		DaoMap::commit();
	}
	/**
	 * Creating a word object
	 *
	 * @param string $name       The name of the word
	 *
	 * @return Word
	 */
	public static function create($name)
	{
		$obj = new Word();
		return $obj->setName($name)
			->save();
	}
}