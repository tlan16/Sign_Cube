<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class AuslanWord extends BaseEntityAbstract
{
	/**
	 * The name of the word
	 * 
	 * @var string
	 */
	private $name;
	/**
	 * The link of the word
	 * 
	 * @var string
	 */
	private $href;
	/**
	 * The AuslanWord relationship
	 *
	 * @var array()
	 */
	protected $rels = array();
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
	 * @return AuslanWord
	 */
	public function setName($value) 
	{
	    $this->name = trim($value);
	    return $this;
	}
	/**
	 * Getter for href
	 *
	 * @return string
	 */
	public function getHref() 
	{
	    return $this->href;
	}
	/**
	 * Setter for href
	 *
	 * @param string $value The href
	 *
	 * @return AuslanWord
	 */
	public function setHref($value) 
	{
	    $this->href = trim($value);
	    return $this;
	}
	/**
	 * Getting the relationships
	 *
	 * @return array()
	 */
	public function getRels()
	{
		$this->loadOneToMany('rels');
		return $this->rels;
	}
	/**
	 * Setter for rels
	 *
	 * @param array $value The new AuslanWordRels
	 *
	 * @return AuslanWord
	 */
	public function setRels($value)
	{
		$this->rels = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__toString()
	 */
	public function __toString()
	{
		if(($name = trim($this->getName())) !== '')
			return $name;
		return parent::__toString();
	}
	/**
	 * Getting the relationships for a user
	 *
	 * @param AuslanVideo 	$video
	 * @param bool   		$activeOnly
	 * @param int    		$pageNo
	 * @param int    		$pageSize
	 * @param array  		$orderBy
	 * @param array  		$stats
	 *
	 * @throws CoreException
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public function getRelationships(AuslanVideo $video, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		return AuslanWordRel::getRelationships($this, $video, $activeOnly, $pageNo, $pageSize, $orderBy, $stats);
	}
	/**
	 * adding a AuslanVideo to the AuslanWord
	 *
	 * @param AuslanVideo 	$video
	 *
	 * @return AuslanWord
	 */
	public function addVideo(AuslanVideo $video)
	{
		AuslanWordRel::create($this, $video);
		return $this;
	}
	/**
	 * removing the AuslanWord from the AuslanVideo
	 *
	 * @param AuslanVideo $video The video
	 * @return AuslanWord
	 */
	public function rmVideo(AuslanVideo $video)
	{
		AuslanWordRel::delete($this, $video);
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'auwd');
	
		DaoMap::setStringType('name','varchar', 32);
		DaoMap::setStringType('href','text', 255);
		DaoMap::setOneToMany('rels', 'AuslanWordRel', 'auwd_rel');
		
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
		return (count($words = self::getAllByCriteria('auwd.name = ? ', array(trim($name)), true, 1, 1)) === 0 ? null : $words[0]);
	}
	/**
	 * Creating a word object
	 *
	 * @param string $name       The name of the word
	 *
	 * @return Word
	 */
	public static function create($name, $href)
	{
		if(!($word = self::getByName($name)) instanceof AuslanWord)
			$word = new AuslanWord();
		return $word->setName($name)
		->setHref($href)
		->save();
	}
}