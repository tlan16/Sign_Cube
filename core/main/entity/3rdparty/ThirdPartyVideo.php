<?php
/**
 * ThirdPartyVideo Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class ThirdPartyVideo extends BaseEntityAbstract
{
	/**
	 * The asset Id of the video
	 * 
	 * @var string
	 */
	protected $assetId;
	/**
	 * The thirdparty name of imported Video
	 * 
	 * @var string
	 */
	private $name;
	/**
	 * The thirdparty link of imported Video
	 * 
	 * @var string
	 */
	private $link;
	/**
	 * The poster link of imported Video
	 * 
	 * @var string
	 */
	private $poster;
	/**
	 * Getter for the assetId
	 *
	 * @return string
	 */
	public function getAssetId()
	{
		return $this->assetId;
	}
	/**
	 * Setter for the AssetId
	 *
	 * @param string $value The asset Id of the video
	 *
	 * @return ThirdPartyVideo
	 */
	public function setAssetId($value)
	{
		if(!empty($value) && !(Asset::get($value)) instanceof Asset)
			throw new Exception('$asset(' . $value . ') must be empty string or an instance of Asset');
		$this->assetId = $value;
		return $this;
	}
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
	 * Setter for the name
	 * 
	 * @param string $value
	 * 
	 * @return ThirdPartyVideo
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * Getter for link
	 * 
	 * @return string
	 */
	public function getLink()
	{
		return $this->link;
	}
	/**
	 * Setter for the link
	 * 
	 * @param string $value
	 * 
	 * @return ThirdPartyVideo
	 */
	public function setLink($value)
	{
		$this->link = trim($value);
		return $this;
	}
	/**
	 * getter for poster
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
	 * @return ThirdPartyVideo
	 */
	public function setPoster($poster)
	{
		$this->poster = $poster;
		return $this;
	}
	/**
	 * Getter for asset url
	 * 
	 * @return string
	 */
	public function getUrl()
	{
		return ($asset = Asset::get($this->getAssetId())) instanceof Asset ? $asset->getUrl() : '';
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'trdvid');
	
		DaoMap::setIntType('assetId');
		DaoMap::setStringType('name', 'varchar', '32');
		DaoMap::setStringType('link', 'text');
		DaoMap::setStringType('poster', 'text');
	
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
	 * creating a ThirdPartyVideo
	 * @param string	$assetId
	 * @param string	$name
	 * @param string	$link
	 * @param string	$poster
	 * 
	 * @return ThirdPartyVideo
	 */
	public static function create($name, $link, $poster = '', $assetId = '')
	{
		if(!empty($assetId) && !(Asset::get($assetId)) instanceof Asset)
			throw new Exception('$asset must be empty string or an instance of Asset');
		$existingEntity = self::getAllByCriteria('link = ?', array($link), true ,1 ,1);
		$entity = count($existingEntity) > 0 ? $existingEntity[0] : new self();
		$entity
			->setAssetId($assetId)
			->setName($name)
			->setLink($link)
			->setPoster($poster)
			->save();
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