<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class WordVideo extends BaseEntityAbstract
{
	/**
	 * The id of the word of the video
	 * 
	 * @var string
	 */
	private $wordid;
	/**
	 * The id of the video of the word
	 * 
	 * @var string
	 */
	private $videoid;
	/**
	 * Getter for wordid
	 *
	 * @return string
	 */
	public function getWordid() 
	{
	    return $this->wordid;
	}
	/**
	 * Setter for wordid
	 *
	 * @param string $value The wordid
	 *
	 * @return WordVideo
	 */
	public function setWordid($value) 
	{
	    $this->wordid = trim($value);
	    return $this;
	}
	/**
	 * Getter for videoid
	 *
	 * @return string
	 */
	public function getVideoid() 
	{
	    return $this->videoid;
	}
	/**
	 * Setter for videoid
	 *
	 * @param string $value The videoid
	 *
	 * @return WordVideo
	 */
	public function setVideoid($value) 
	{
	    $this->videoid = trim($value);
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'wv');
		
		DaoMap::setStringType('wordid','varchar', 32);
		DaoMap::setStringType('videoid','varchar', 32);
		
		parent::__loadDaoMap();
		
		DaoMap::createIndex('wordid');
		DaoMap::createIndex('videoid');
		
		DaoMap::commit();
	}
	/**
	 * Creating a video object
	 *
	 * @param string $location       The location of the video
	 *
	 * @return WordVideo
	 */
	public static function create($wordid, $videoid)
	{
		$obj = new WordVideo();
		return $obj->setWordid($wordid)
			->setVideoid($videoid)
			->save();
	}
}