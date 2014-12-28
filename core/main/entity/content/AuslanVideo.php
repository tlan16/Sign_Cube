<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class AuslanVideo extends BaseEntityAbstract
{
	/**
	 * The link of content of video of the word
	 * 
	 * @var string
	 */
	private $media;
	/**
	 * The poster of video of the word
	 * 
	 * @var string
	 */
	private $poster;
	/**
	 * The AssetId of video of the word
	 * 
	 * @var string
	 */
	private $assetId;
    /**
     * getter AuslanVideo
     *
     * @return AuslanVideo
     */
    public function getMedia()
    {
        return $this->media;
    }
    /**
     * Setter for media
     *
     * @param string $value The media
     *
     * @return AuslanVideo
     */
    public function setMedia($value)
    {
    	$this->media = $value;
    	return $this;
    }
	/**
	 * Getter for poster
	 *
	 * @return string
	 */
	public function getPoster() 
	{
	    return $this->poster;
	}
	/**
	 * Setter for poster
	 *
	 * @param string $value The poster
	 *
	 * @return AuslanVideo
	 */
	public function setPoster($value) 
	{
	    $this->poster = trim($value);
	    return $this;
	}
	/**
	 * Getter for AssetId
	 *
	 * @return string
	 */
	public function getAssetId() 
	{
	    return $this->assetId;
	}
	/**
	 * Setter for AssetId
	 *
	 * @param string $value The AssetId
	 *
	 * @return AuslanVideo
	 */
	public function setAssetId($value) 
	{
	    $this->assetId = trim($value);
	    return $this;
	}
	/**
	 * getter AuslanVideo
	 *
	 * @return AuslanVideo
	 */
	public function getVideo()
	{
		$this->loadManyToOne("auslanVideo");
		return $this->auslanVideo;
	}
	/**
	 * getter AuslanVideo Asset URL
	 *
	 * @return string
	 */
	public function getVideoURL()
	{
		return Asset::get($this->getAssetId());
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'auvid');
	
		DaoMap::setStringType('media','varchar', 255);
		DaoMap::setStringType('poster','varchar', 255);
		DaoMap::setStringType('assetId','varchar', 255);
		
		parent::__loadDaoMap();
		DaoMap::commit();
	}
	/**
	 * Getting the video via video link
	 *
	 * @param string $link The link of the video
	 *
	 * @return Ambigous <NULL, BaseEntityAbstract>
	 */
	public static function getByMedia($link)
	{
		return (count($medias = self::getAllByCriteria('auvid.media = ? ', array(trim($link)), true, 1, 1)) === 0 ? null : $medias[0]);
	}
	/**
	 * Creating a word object
	 *
	 * @param string $media       The content of video
	 * @param string $poster	  The poster of video
	 *
	 * @return AuslanVideo
	 */
	public static function create($media, $assetId, $poster = '')
	{
		if(!($newVideo = self::getByMedia($media)) instanceof AuslanVideo)
			$newVideo = new AuslanVideo();
		$newVideo->setMedia($media)
			->setAssetId($assetId)
			->setPoster($poster)
			->save();
		return $newVideo;
	}
}