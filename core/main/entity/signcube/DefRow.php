<?php
/**
 * DefRow Entity
 *  - the content row of defination
 * 
 * @package Core
 * @subpackage Entity
 * @author tlan<tlan16@sina.com>
 */
class DefRow extends BaseEntityAbstract
{
	/**
	 * The content of DefRow
	 */
	private $content;
	/**
	 * The index of DefRow
	 */
	private $index;
	/**
	 * Getter for content
	 * 
	 * @return content
	 */
	public function getContent()
	{
		return $this->content;
	}
	/**
	 * Setter for content
	 * 
	 * @param string $value The content
	 * 
	 * @return DefRow
	 */
	public function setContent($value)
	{
		$this->content = trim($value);
		return $this;
	}
	/**
	 * Getter for index
	 * 
	 * @return index
	 */
	public function getIndex()
	{
		return $this->index;
	}
	/**
	 * Setter for index
	 * 
	 * @param string $value The index
	 * 
	 * @return DefRow
	 */
	public function setIndex($value)
	{
		$this->index = $value;
		return $this;
	}
	/**
	 * Getter for DefRow
	 * 
	 * @return DefRow
	 */
	public function getDefRow()
	{
		$this->loadManyToOne("defRow");
		return $this->defRow;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntityAbstract::preSave()
	 */
	public function preSave()
	{
		if(trim($this->getContent()) === '')
			throw new EntityException('Content can NOT be empty', 'exception_entity_defRow_content_empty');
		if(!is_numeric($this->getIndex()))
			throw new EntityException('index MUST be a number', 'exception_entity_defRow_index_nonnumeric');
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'defr');
		DaoMap::setStringType('content', 'text', 1000);
		DaoMap::setIntType('index');
		parent::__loadDaoMap();
		
		DaoMap::createIndex('name');
		DaoMap::commit();
	}
	/**
	 * creating a DefRow
	 *
	 * @param unknown $content
	 * @param unknown $index
	 *
	 * @return DefRow
	 */
	public static function create($content, $index = 0)
	{
		$entity = new DefRow();
		return $entity->setContent($content)
			->setIndex($index)
			->save()
			->addLog(Log::TYPE_SYS, 'DefRow (' . $content . ') created now with an index: ' . $index);
	}
	// TODO: relationship
}
?>