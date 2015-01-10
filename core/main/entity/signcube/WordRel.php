<?php
/**
 * Word Relationship Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class WordRel extends ConfirmEntityAbstract
{
	/**
	 * The word for this relationship
	 *
	 * @var Word
	 */
	protected $word;
	/**
	 * The video for this relationship
	 *
	 * @var Video
	 */
	protected $video;
	/**
	 * The category for this relationship
	 *
	 * @var Category
	 */
	protected $category;
	/**
	 * The defType for this relationship
	 *
	 * @var DefType
	 */
	protected $defType;
	/**
	 * The wordTag for this relationship
	 *
	 * @var WordTag
	 */
	protected $wordTag;
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
	 * @return WordRel
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
	 * @return WordRel
	 */
	public function setVideo(Video $value)
	{
		$this->video = $value;
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
	 * Setter for Category
	 *
	 * @param Category $value The category
	 *
	 * @return WordRel
	 */
	public function setCategory(Category $value)
	{
		$this->category = $value;
		return $this;
	}
	/**
	 * Getter for DefType
	 *
	 * @return DefType
	 */
	public function getDefType()
	{
		$this->loadManyToOne('defType');
		return $this->defType;
	}
	/**
	 * Setter for defType
	 *
	 * @param DefType $value The defType
	 *
	 * @return WordRel
	 */
	public function setDefType(DefType $value)
	{
		$this->defType = $value;
		return $this;
	}
	/**
	 * Getter for wordTag
	 *
	 * @return WordTag
	 */
	public function getWordTag()
	{
		$this->loadManyToOne('wordTag');
		return $this->wordTag;
	}
	/**
	 * Setter for wordTag
	 *
	 * @param WordTag $value The wordTag
	 *
	 * @return WordRel
	 */
	public function setWordTag(WordTag $value)
	{
		$this->wordTag = $value;
		return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'word_rel');
	
		DaoMap::setManyToOne('word', 'Word');
		DaoMap::setManyToOne('video', 'Video');
		DaoMap::setManyToOne('category', 'Category');
		DaoMap::setManyToOne('defType', 'DefType');
		DaoMap::setManyToOne('wordTag', 'WordTag');
	
		parent::__loadDaoMap();
		DaoMap::commit();
	}
	/**
	 * Getting the relationships for a user
	 *
	 * @param Word			$word
	 * @param Video			$video
	 * @param Category		$category
	 * @param DefType		$defType
	 * @param WordTag		$wordTag
	 * @param int			$pageNo
	 * @param int			$pageSize
	 * @param array			$orderBy
	 * @param array			$stats
	 *
	 * @throws CoreException
	 * @return Ambigous <Ambigous, multitype:, multitype:BaseEntityAbstract >
	 */
	public static function getRelationships(Word $word = null, Video $video = null, Category $category = null, DefType $defType = null, WordTag $wordTag = null, $activeOnly = true, $pageNo = null, $pageSize = DaoQuery::DEFAUTL_PAGE_SIZE, $orderBy = array(), &$stats = array())
	{
		if(!$word instanceof Word && !$person instanceof Person)
			throw new CoreException('At least one of the search criterial should be provided: property or user');
		$where = array();
		$param = array();
		if($word instanceof Word)
		{
			$where[]= 'wordId = ?';
			$param[] = $word->getId();
		}
		if($video instanceof Video)
		{
			$where[] = 'videoId = ?';
			$param[] = $video->getId();
		}
		if($category instanceof Category)
		{
			$where[] = 'categoryId = ?';
			$param[] = $category->getId();
		}
		if($defType instanceof DefType)
		{
			$where[] = 'defTypeId = ?';
			$param[] = $defType->getId();
		}
		if($wordTag instanceof WordTag)
		{
			$where[] = 'wordTagId = ?';
			$param[] = $wordTag->getId();
		}
		return self::getAllByCriteria(implode(' AND ', $where), $param, $activeOnly, $pageNo, $pageSize, $orderBy, $stats);
	}
	/**
	 * Creating a wordrel
	 *
	 * @param Word			$word
	 * @param Video			$video
	 * @param Category		$category
	 * @param DefType		$defType
	 * @param WordTag		$wordTag
	 *
	 * @return WordRel
	 */
	public static function create(Word $word, Video $video, Category $category, DefType $defType, WordTag $wordTag)
	{
		$exsitingRels = self::getAllByCriteria('wordId = ? and videoId = ? and categoryId = ? and defTypeId = ?and wordTagId = ?', array($word->getId(), $video->getId(), $category->getId(), $defType->getId(), $wordTag->getId()), true, 1, 1);
		if(count($exsitingRels) > 0)
			return $exsitingRels[0];
		$msg = 'Video(ID=' . $video->getId() . ') is now a Video of Word(' . $word->getName() . ') with Category(' . $category->getName() . ') with DefType(' . $defType->getName() . ') with WordTag(' . $wordTag->getName() . ').';
		$rel = new WordRel();
		return $rel->setWord($word->addLog(Log::TYPE_SYS, $msg, __CLASS__ . '::' . __FUNCTION__))
			->setVideo($video)
			->setCategory($category)
			->setDefType($defType)
			->setWordTag($wordTag)
			->save()
			->addLog(Log::TYPE_SYS, $msg, __CLASS__ . '::' . __FUNCTION__);
	}
	/**
	 * deleting the word relationships
	 *
	 * @param Word			$word
	 * @param Video			$video
	 * @param Category		$category
	 * @param DefType		$defType
	 * @param WordTag		$wordTag
	 */
	public static function delete(Word $word, Video $video, Category $category, DefType $defType = null, WordTag $wordTag = null)
	{
		$where = 'wordId = ? and videoId = ? and categoryId = ?';
		$params = array($word->getId(), $video->getId(), $category->getId());
		if($defType instanceof DefType)
		{
			$where .= ' AND defTypeId = ?';
			$params[] = $defType->getId();
		}
		if($wordTag instanceof WordTag)
		{
			$where .= ' AND wordTagId = ?';
			$params[] = $wordTag->getId();
		}
		self::updateByCriteria('active = 0', $where, $params);
	}
}
?>