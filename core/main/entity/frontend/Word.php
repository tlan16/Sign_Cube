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
	 * @return array Video
	 */
	public function getVideos() 
	{
		$wordVideos = WordVideo::getAllByCriteria('wv.wordid = :wordid', array('wordid'=> $this->id));
		$videos = array();
		foreach ($wordVideos->getVideoid() as $item) {
			$videos[] = Video::get($item);
		}
	    return $this->$videos;
	}
	/**
	 * Setter for video
	 *
	 * @param string $value The video
	 *
	 * @return Word
	 */
	public function setVideo(Video $video) 
	{
		WordVideo::create($this, $video);
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		$name = trim($this->getName());
		$where = array('name = ? ');
		$params = array($name);
		$exsitingName = Word::countByCriteria(implode(' AND ', $where), $params);
		if($exsitingName > 0)
			throw new EntityException('The NAME(=' . $name . ') is already exists!' );
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
	 * Getting the word via name
	 *
	 * @param string $name The name of the word
	 *
	 * @return Ambigous <NULL, BaseEntityAbstract>
	 */
	public static function getByName($name)
	{
		$words = self::getAllByCriteria('name = ? ', array(trim($name)), true, 1, 1);
		return (count($words) === 0 ? null : $words[0]);
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
		if(!($word = self::getByName($name)) instanceof Word)
			$word = new Word();
		$word->setName($name);
		
		
		return $word->save();
	}
}