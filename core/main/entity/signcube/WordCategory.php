<?php
/**
 * Word-Category Relationship Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class WordCategory extends BaseEntityAbstract
{
	/**
	 * The Word of the WordCategory
	 * 
	 * @var Word
	 */
	protected $word;
	/**
	 * The Category of the WordCategory
	 * 
	 * @var Category
	 */
	protected $category;
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
	 * @return WordCategory
	 */
	public function setWord(Word $value)
	{
		$this->word = $value;
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
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'wdcat');
		DaoMap::setManyToOne('word', 'Word', 'wdcat_wd', false);
		DaoMap::setManyToOne('category', 'Category', 'wdcat_cat', false);
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
	/**
	 * creating a WordCategory Relationship
	 *
	 * @param Word		$word
	 * @param Category	$category
	 *
	 * @return WordCategory
	 */
	public static function create(Word $word, Category $category)
	{
		$wordCategory = new WordCategory();
		return $wordCategory->setWord($word)
			->setCategory($category)
			->save()
			->addLog(Log::TYPE_SYS, 'WordCategory Created with word(' . $word->getName() . ') and Category(' . $category->getName() . ')', __CLASS__ . '::' . __FUNCTION__);
	}
}
?>