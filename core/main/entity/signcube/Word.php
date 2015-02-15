<?php
/**
 * Word Entity
 *
 * All foreigh Word is different, even they may have same spelling
 * But no duplicate Word allowed for within same spoken Language
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Word extends BaseEntityAbstract
{
	const TYPE_DEFAULT = 'DEFAULT';
	/**
	 *  The name of the Word
	 *  
	 *  @var string
	 */
	private $name;
	/**
	 *  The tag of the Word
	 *  
	 *  @var string
	 */
	private $tag = self::TYPE_DEFAULT;
	/**
	 * The Word language
	 * 
	 * @var Language
	 */
	protected $language;
	/**
	 * The Category of the WordCategory
	 *
	 * @var Category
	 */
	protected $category;
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
	 * @return Word
	 */
	public function setName($value)
	{
		$this->name = trim($value);
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
	 * @return Word
	 */
	public function setTag($value)
	{
		$this->tag = trim($value);
		return $this;
	}
	/**
	 * Getter for language
	 *
	 * @return Language
	 */
	public function getLanguage() 
	{
		$this->loadManyToOne('language');
	    return $this->language;
	}
	/**
	 * Setter for language
	 *
	 * @param Language $value The language
	 *
	 * @return Word
	 */
	public function setLanguage(Language $value) 
	{
	    $this->language = $value;
	    return $this;
	}
	/**
	 * Getter for category
	 *
	 * @return Category
	 */
	public function getCategory()
	{
		$this->loadManyToOne('category');
		return $this->category;
	}
	/**
	 * Setter for category
	 *
	 * @param Category $value The category
	 *
	 * @return WordCategory
	 */
	public function setCategory(Category $value)
	{
		$this->category = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new Exception('Name can NOT be empty', 'exception_entity_word_name_empty');
		if(trim($this->getTag()) === '')
			throw new Exception('Tag can NOT be empty');
	}
	/**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'wd');
        DaoMap::setStringType('name', 'varchar', 64);
        DaoMap::setStringType('tag', 'varchar', 32);
        DaoMap::setManyToOne('language', 'Language', 'wd_lang', false);
        DaoMap::setManyToOne('category', 'Category', 'wdcat_cat', false);
        parent::__loadDaoMap();
        
        DaoMap::createIndex('name');
        DaoMap::createIndex('tag');
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
    	foreach (WordVideo::getAllByCriteria('wordId = ?', array($this->getId())) as $wordVideo)
    	{
    		$videos[] = $wordVideo->getVideo()->getJson();
    	}
    	return parent::getJson(array_merge($extra, array('videos'=> $videos)));
    }
    /**
     * creating a property
     *
     * @param Language		$language
     * @param string		$name
     * @param string		$tag
     *
     * @return Word
     */
    public static function create(Language $language, Category $category, $name, $tag = self::TYPE_DEFAULT)
    {
    	$existingEntity = self::getAllByCriteria('languageId = ? AND categoryId = ? AND name = ?', array($language->getId(), $category->getId(), trim($name)));
    	$entity = count($existingEntity) > 0 ? $existingEntity[0] : new Word();
    	return $entity->setLanguage($language)
    		->setCategory($category)
	    	->setName($name)
	    	->setTag($tag)
	    	->save()
	    	->addLog(Log::TYPE_SYS, 'Word ' . (count($existingEntity) > 0 ? 'updated' : 'created') . ' with name(' . $name . ') and language(' . $language->getName() . ') with Category(' . $category->getName() . ') with tag(' . $tag . ')', __CLASS__ . '::' . __FUNCTION__);
    }
}
?>