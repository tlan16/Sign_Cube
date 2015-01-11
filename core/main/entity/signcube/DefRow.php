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
	 * The sequence of DefRow
	 */
	private $sequence;
	/**
	 * The DefType of DefRow
	 *
	 * @var DefType
	 */
	protected $defType;
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
	 * Getter for sequence
	 * 
	 * @return sequence
	 */
	public function getSequence()
	{
		return $this->sequence;
	}
	/**
	 * Setter for sequence
	 * 
	 * @param string $value The sequence
	 * 
	 * @return DefRow
	 */
	public function setSequence($value)
	{
		$this->sequence = $value;
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
	 * Setter for DefType
	 *
	 * @param DefType $value The defType
	 *
	 * @return DefRow
	 */
	public function setDefType(DefType $value) 
	{
	    $this->defType = $value;
	    return $this;
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
		DaoMap::setStringType('content', 'TEXT', 1000);
		DaoMap::setIntType('sequence');
		DaoMap::setManyToOne('defType', 'DefType', 'defr_deftp', false);
		parent::__loadDaoMap();
		
		DaoMap::commit();
	}
	/**
	 * creating a DefRow
	 *
	 * @param unknown $content
	 * @param DefType $defType
	 * @param unknown $sequence
	 *
	 * @return DefRow
	 */
	public static function create($content, DefType $defType,$sequence = 0)
	{
		$entity = new DefRow();
		return $entity->setContent($content)
			->setSequence($sequence)
			->setDefType($defType)
			->save()
			->addLog(Log::TYPE_SYS, 'DefRow (' . $content . ') created now with an index: ' . $index);
	}
	// TODO: relationship
}
?>