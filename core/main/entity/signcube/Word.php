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
	private $tag;
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
			throw new EntityException('Name can NOT be empty', 'exception_entity_word_name_empty');
		if(trim($this->getTag()) === '')
			throw new EntityException('Tag can NOT be empty', 'exception_entity_word_tag_empty');
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
     * creating a property
     *
     * @param Language		$language
     * @param string		$name
     * @param string		$tag
     *
     * @return Word
     */
    public static function create(Language $language, Category $category, $name, $tag = '')
    {
    	$word = new Word();
    	return $word->setLanguage($language)
    		->setCategory($category)
	    	->setName($name)
	    	->setTag($tag)
	    	->save()
	    	->addLog(Log::TYPE_SYS, 'Word Created with name(' . $name . ') and language(' . $language->getName() . ') with Category(' . $category->getName() . ') with tag(' . $tag . ')', __CLASS__ . '::' . __FUNCTION__);
    }
}
?>