<?php
/** Address Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Explanation extends BaseEntityAbstract
{
	/**
	 * The content of the Explanation
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
	 * @return Explanation
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
		DaoMap::begin($this, 'expl');
	
		DaoMap::setStringType('content','text');
		
		parent::__loadDaoMap();
	
		DaoMap::commit();
	}
	/**
	 * Creating a word object
	 *
	 * @param string $name       The name of the word
	 *
	 * @return Explanation
	 */
	public static function create($content)
	{
		$obj = new Explanation();
		return $obj->setContent($content)
			->save();
	}
}