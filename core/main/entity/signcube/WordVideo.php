<?php
/**
 * Word-Video Relationship Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class WordVideo extends BaseEntityAbstract
{
	/**
	 * The Word of the WordVideo
	 * 
	 * @var Word
	 */
	protected $word;
	/**
	 * The Video of the WordVideo
	 * 
	 * @var Video
	 */
	protected $video;
	/**
	 * Getter for word
	 *
	 * @return Word
	 */
	public function getWord()
	{
		$this->loadManyToOne('word');
		return $this->word;
	}
	/**
	 * Setter for word
	 *
	 * @param Word $value The word
	 *
	 * @return WordVideo
	 */
	public function setWord(Word $value)
	{
		$this->word = $value;
		return $this;
	}
	/**
	 * Getter for video
	 *
	 * @return Video
	 */
	public function getVideo()
	{
		$this->loadManyToOne('video');
		return $this->video;
	}
	/**
	 * Setter for video
	 *
	 * @param Video $value The video
	 *
	 * @return WordVideo
	 */
	public function setVideo(Video $value)
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
		DaoMap::begin($this, 'wdvid');
		DaoMap::setManyToOne('word', 'Word', 'wdvid_wd', false);
		DaoMap::setManyToOne('video', 'Video', 'wdvid_vid', false);
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
	/**
	 * creating a WordVideo Relationship
	 *
	 * @param Word		$word
	 * @param Video		$video
	 *
	 * @return WordVideo
	 */
	public static function create(Word $word, Video $video)
	{
		$wordVideo = new WordVideo();
		return $wordVideo->setWord($word)
		->setVideo($video)
		->save()
		->addLog(Log::TYPE_SYS, 'WordVideo Created with word(' . $word->getName() . ') and Video(ID=' . $video->getId() . ')', __CLASS__ . '::' . __FUNCTION__);
	}
}

?>