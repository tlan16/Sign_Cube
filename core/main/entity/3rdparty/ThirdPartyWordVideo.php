<?php
/**
 * Third Party Word-Video Relationship Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class ThirdPartyWordVideo extends BaseEntityAbstract
{
	/**
	 * The ThirdPartyWord of the ThirdPartyVideo
	 * 
	 * @var ThirdPartyWord
	 */
	protected $thirdPartyWord;
	/**
	 * The ThirdPartyVideo of the ThirdPartyWord
	 * 
	 * @var ThirdPartyVideo
	 */
	protected $thirdPartyVideo;
	/**
	 * Getter for word
	 *
	 * @return ThirdPartyWord
	 */
	public function getThirdPartyWord()
	{
		$this->loadManyToOne('thirdPartyWord');
		return $this->thirdPartyWord;
	}
	/**
	 * Setter for thirdPartyWord
	 *
	 * @param ThirdPartyWord $value The thirdPartyWord
	 *
	 * @return ThirdPartyWordVideo
	 */
	public function setThirdPartyWord(ThirdPartyWord $value)
	{
		$this->thirdPartyWord = $value;
		return $this;
	}
	/**
	 * Getter for thirdPartyVideo
	 *
	 * @return ThirdPartyVideo
	 */
	public function getThirdPartyVideo()
	{
		$this->loadManyToOne('thirdPartyVideo');
		return $this->thirdPartyVideo;
	}
	/**
	 * Setter for thirdPartyVideo
	 *
	 * @param ThirdPartyVideo $value The thirdPartyVideo
	 *
	 * @return ThirdPartyWordVideo
	 */
	public function setThirdPartyVideo(ThirdPartyVideo $value)
	{
		$this->thirdPartyVideo = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'trdwdvid');
		DaoMap::setManyToOne('thirdPartyWord', 'ThirdPartyWord', 'trdwdvid_trdwd', false);
		DaoMap::setManyToOne('thirdPartyVideo', 'ThirdPartyVideo', 'trdwdvid_trdvid', false);
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
	/**
	 * creating a ThirdPartyWordVideo Relationship
	 *
	 * @param ThirdPartyWord		$thirdPartyWord
	 * @param ThirdPartyVideo		$thirdPartyVideo
	 *
	 * @return ThirdPartyWordVideo
	 */
	public static function create(ThirdPartyWord $thirdPartyWord, ThirdPartyVideo $thirdPartyVideo)
	{
		$existingEntity = self::getAllByCriteria('thirdPartyWordId = ? AND thirdPartyVideoId = ?', array($thirdPartyWord->getId(), $thirdPartyVideo->getId()));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new self();
		return $entity->setThirdPartyWord($thirdPartyWord)
		->setThirdPartyVideo($thirdPartyVideo)
		->save();
	}
}

?>