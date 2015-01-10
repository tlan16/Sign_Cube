<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class AuslanWordRel extends BaseEntityAbstract
{
	/**
	 * The AuslanWord of the relationship
	 * 
	 * @var AuslanWord
	 */
	protected $word;
	/**
	 * The AuslanVideo of the relationship
	 * 
	 * @var AuslanVideo
	 */
	protected $video;
	/**
	 * Getter for word
	 *
	 * @return AuslanWord
	 */
	public function getWord() 
	{
		$this->loadManyToOne('word');
	    return $this->word;
	}
	/**
	 * Setter for word
	 *
	 * @param AuslanWord $value The word
	 *
	 * @return AuslanWordRel
	 */
	public function setWord(AuslanWord $value) 
	{
	    $this->word = $value;
	    return $this;
	}
	/**
	 * Getter for video
	 *
	 * @return AuslanVideo
	 */
	public function getVideo() 
	{
		$this->loadManyToOne('video');
	    return $this->video;
	}
	/**
	 * Setter for video
	 *
	 * @param AuslanVideo $value The video
	 *
	 * @return AuslanWordRel
	 */
	public function setVideo(AuslanVideo $value) 
	{
	    $this->video = $value;
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'auwd_rel');
	
		DaoMap::setManyToOne('word', 'AuslanWord');
		DaoMap::setManyToOne('video', 'AuslanVideo');
		
		parent::__loadDaoMap();
		DaoMap::commit();
	}
	/**
	 * Getting the relationships for a user
	 *
	 * @param AuslanWord  $word
	 * @param AuslanVideo $video
	 * @param bool        $activeOnly
	 * @param int         $pageNo
	 * @param int         $pageSize
	 * @param array       $orderBy
	 * @param array       $stats
	 *
	 * @throws CoreException
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public static function getRelationships(AuslanWord $word = null, AuslanVideo $video = null, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		if(!$word instanceof AuslanWord && !$video instanceof AuslanVideo)
			throw new CoreException('At least one of the search criterial should be provided: property or user');
		$where = array();
		$param = array();
		if($word instanceof AuslanWord)
		{
			$where[]= 'wordId = ?';
			$param[] = $word->getId();
		}
		if($video instanceof AuslanVideo)
		{
			$where[] = 'videoId = ?';
			$param[] = $video->getId();
		}
		return self::getAllByCriteria(implode(' AND ', $where), $param, $activeOnly, $pageNo, $pageSize, $orderBy, $stats);
	}
	/**
     * Creating a AuslanWordRel to a user
     * 
     * @param AuslanWord    $word
     * @param AuslanVideo   $video
     * 
     * @return AuslanWordRel
     */
    public static function create(AuslanWord $word, AuslanVideo $video)
    {
    	$exsitingRels = self::getAllByCriteria('wordId = ? and videoId = ?', array($word->getId(), $video->getId()), true, 1, 1);
    	if(count($exsitingRels) > 0)
    		return $exsitingRels[0];
    	$rel = new AuslanWordRel();
    	return $rel->setWord($word)
    		->setVideo($video)
    		->save();
    }
    /**
     * deleting the AuslanWord relationships
     * 
     * @param AuslanWord  $word
     * @param AuslanVideo $video
     */
    public static function delete(AuslanWord $word, AuslanVideo $video)
    {
    	$where = 'wordId = ? and videoId = ?';
    	$params = array($word->getId(), $video->getId());

    	self::updateByCriteria('active = 0', $where, $params);
    }
}
?>