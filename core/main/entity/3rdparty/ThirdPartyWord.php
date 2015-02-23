<?php
/**
 * ThirdPartyWord Entity
 *
 * All foreigh Word is different, even they may have same spelling
 * But no duplicate Word allowed for within same spoken Language
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class ThirdPartyWord extends BaseEntityAbstract
{
	const TYPE_DEFAULT = 'DEFAULT';
	/**
	 *  The name of the Word
	 *  
	 *  @var string
	 */
	private $name;
	/**
	 *  The link of the Word
	 *  
	 *  @var string
	 */
	private $link;
	/**
	 *  The tag of the Word
	 *  
	 *  @var string
	 */
	private $tag = self::TYPE_DEFAULT;
	/**
	 * Getter for name
	 * 
	 * @return $this->name;
	 */
	public function getName()
	{
		return $this->name;
	}
	/**
	 * Setter for name
	 * 
	 * @param string $value The Name
	 * 
	 * @return ThirdPartyWord
	 */
	public function setName($value)
	{
		$this->name = trim($value);
		return $this;
	}
	/**
	 * getter for link
	 *
	 * @return $this->link
	 */
	public function getLink()
	{
		return $this->link;
	}
	/**
	 * Setter for link
	 *
	 * @return ThirdPartyWord
	 */
	public function setLink($link)
	{
		$this->link = $link;
		return $this;
	}
	/**
	 * Getter for tag
	 * 
	 * @return $this->tag;
	 */
	public function getTag()
	{
		return $this->tag;
	}
	/**
	 * Setter for tag
	 * 
	 * @param string $value The tag
	 * 
	 * @return ThirdPartyWord
	 */
	public function setTag($value)
	{
		$this->tag = trim($value);
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new Exception('Name can NOT be empty');
		if(trim($this->getTag()) === '')
			throw new Exception('Tag can NOT be empty');
	}
	/**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'trdwd');
        DaoMap::setStringType('name', 'varchar', 64);
        DaoMap::setStringType('tag', 'varchar', 32);
        DaoMap::setStringType('link', 'text');
        parent::__loadDaoMap();
        
        DaoMap::commit();
    }
    /**
     * overload parent getJson
     *
     * @param bool $reset Forcing the function to fetch data from the database again
     *
     * @return array The associative arary for json
     */
    public function getJson($extra = array(), $reset = false)
    {
    	$videos = array();
    	foreach (ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ?', array($this->getId())) as $wordVideo)
    	{
    		$videos[] = $wordVideo->getVideo()->getJson();
    	}
    	return parent::getJson(array_merge($extra, array('videos'=> $videos)));
    }
    /**
     * creating a property
     *
     * @param string		$name
     * @param string		$link
     * @param string		$tag
     *
     * @return ThirdPartyWord
     */
    public static function create($name, $link = '', $tag = self::TYPE_DEFAULT)
    {
    	$existingEntity = self::getAllByCriteria('name = ?', array(trim($name)));
    	$entity = count($existingEntity) > 0 ? $existingEntity[0] : new self();
    	return $entity->setName(trim($name))
    		->setLink($link)
	    	->setTag($tag)
	    	->save();
    }
}
?>