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
	 * The Word language
	 * 
	 * @var Language
	 */
	protected $language;
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
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getName()) === '')
			throw new EntityException('Name can NOT be empty', 'exception_entity_word_name_empty');
	}
	/**
	 * Getting the relationships for a Word
	 * 
	 * @param 
	 * 
	 * @throws CoreException
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public function getRelationships()
	{
		// TODO
	}
	/**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'word');
        DaoMap::setStringType('name', 'varchar', 32);
        DaoMap::setManyToOne('language', 'Language', 'word_lang', false);
        parent::__loadDaoMap();
        
        DaoMap::createIndex('name');
        DaoMap::commit();
    }
    /**
     * creating a property
     *
     * @param Language		$language
     * @param string		$name
     *
     * @return Word
     */
    public static function create(Language $language, $name)
    {
    	$word = new Word();
    	return $word->setLanguage($language)
	    	->setName($name)
	    	->save()
	    	->addLog(Log::TYPE_SYS, 'Word Created with name(' . $name . ') and language(' . $language->getName() . ')', __CLASS__ . '::' . __FUNCTION__);
    }
}
?>