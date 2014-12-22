<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Definition extends BaseEntityAbstract
{
	/**
	 * The content of the Definition
	 * 
	 * @var string
	 */
	private $content;
	/**
	 * Getter for content
	 *
	 * @return string
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
	 * @return Definition
	 */
	public function setContent($value) 
	{
	    $this->content = trim($value);
	    return $this;
	}
	/**
	 * (non-PHPdoc)
	 * @see BaseEntity::__loadDaoMap()
	 */
	public function __loadDaoMap()
	{
		DaoMap::begin($this, 'def');
	
		DaoMap::setStringType('content', 'text');
		
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
	/**
	 * Creating a word object
	 *
	 * @param string $name       The name of the word
	 *
	 * @return Word
	 */
	public static function create($content)
	{
		$obj = new Definition();
		return $obj->setContent($content)
			->save();
	}
}