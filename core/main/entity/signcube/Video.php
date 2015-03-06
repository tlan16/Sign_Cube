<?php
/**
 * Video Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     tlan<tlan16@sina.com>
 */
class Video extends BaseEntityAbstract
{
	/**
	 * The asset of the video
	 * 
	 * @var Asset
	 */
	protected $asset;
	/**
	 * The thirdparty name of imported Video
	 * 
	 * @var string
	 */
	private $thirdpartyName;
	/**
	 * The thirdparty link of imported Video
	 * 
	 * @var string
	 */
	private $thirdpartyLink;
	/**
	 * Getter for the tag
	 *
	 * @return Asset
	 */
	public function getAsset()
	{
		$this->loadManyToOne('asset');
		return $this->asset;
	}
	/**
	 * Setter for the Asset
	 *
	 * @param Asset $value The tag of the function
	 *
	 * @return Video
	 */
	public function setAsset(Asset $value)
	{
		$this->asset = $value;
		return $this;
	}
	/**
	 * Getter for thirdpartyName
	 * 
	 * @return string
	 */
	public function getThirdpartyName()
	{
		return $this->thirdpartyName;
	}
	/**
	 * Setter for the thirdpartyName
	 * 
	 * @param string $value
	 * 
	 * @return Video
	 */
	public function setThirdpartyName($value)
	{
		$this->thirdpartyName = trim($value);
		return $this;
	}
	/**
	 * Getter for thirdpartyLink
	 * 
	 * @return string
	 */
	public function getThirdpartyLink()
	{
		return $this->thirdpartyLink;
	}
	/**
	 * Setter for the thirdpartyLink
	 * 
	 * @param string $value
	 * 
	 * @return Video
	 */
	public function setThirdpartyLink($value)
	{
		$this->thirdpartyLink = trim($value);
		return $this;
	}
	/**
	 * Getter for asset url
	 * 
	 * @return string
	 */
	public function getUrl()
	{
		return $this->getAsset() instanceof Asset ? $this->getAsset()->getUrl() : '';
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'vid');
	
		DaoMap::setManyToOne('asset','Asset', 'vid_con');
		DaoMap::setStringType('thirdpartyName', 'varchar', '32');
		DaoMap::setStringType('thirdpartyLink', 'varchar', '255');
	
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
/**
     * overload parent
     * 
     * @param bool $reset Forcing the function to fetch data from the database again
     *
     * @return array The associative arary for json
     */
    public function getJson($extra = array(), $reset = false)
    {
    	$array = array('asset'=> $this->getAsset()->getJson());
    	return parent::getJson(array_merge($array, $extra));
    }
	/**
	 * creating a Video
	 * @param Asset		$asset
	 * @param string	$thirdpartyName
	 * @param string	$thirdpartyLink
	 * 
	 * @return EntityTag
	 */
	public static function create(Asset $asset, $thirdpartyName = '', $thirdpartyLink = '')
	{
		$existingEntity = self::getAllByCriteria('assetId = ?', array($asset->getId()));
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new Video();
		$entity
			->setAsset($asset)
			->setThirdpartyName($thirdpartyName)
			->setThirdpartyLink($thirdpartyLink)
			->save()
			->addLog(Log::TYPE_SYS, 'Video (ID=' . $entity->getId() . ') with Asset(ID=' . $asset->getId() . ') with 3rdPartyName(' . $thirdpartyName . ') with 3rdPartyLink(' . $thirdpartyLink . ')' . (count($existingEntity) > 0 ? 'updated' : 'created') . 'now', __CLASS__ . '::' . __FUNCTION__);
		return $entity;
	}
	/**
	 * Getting the asset from asset or assetId
	 *
	 * @param Mixed $assetOrAssetId
	 *
	 * @return Asset|null
	 */
	private static function _getAsset($assetOrAssetId)
	{
		if($assetOrAssetId instanceof Asset)
			return $assetOrAssetId;
		if(is_string($assetOrAssetId) && ($asset = Asset::getAsset(trim($assetOrAssetId))) instanceof Asset)
			return $asset;
		return null;
	}
}
?>