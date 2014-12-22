<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Video extends BaseEntityAbstract
{
	/**
	 * The location of the video
	 * 
	 * @var string
	 */
	private $location;
	/**
	 * Getter for location
	 *
	 * @return string
	 */
	public function getLocation() 
	{
	    return $this->location;
	}
	/**
	 * Setter for location
	 *
	 * @param string $value The location
	 *
	 * @return Video
	 */
	public function setLocation($value) 
	{
	    $this->location = trim($value);
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'vid');
		
		DaoMap::setStringType('location','varchar', 255);
		
		parent::__loadDaoMap();
		
		DaoMap::commit();
	}
	/**
	 * Creating a video object
	 *
	 * @param string $location       The location of the video
	 *
	 * @return Video
	 */
	public static function create($location)
	{
		$obj = new Video();
		return $obj->setName($location)
			->save();
	}
}