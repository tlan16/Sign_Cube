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
	 * The Word relationship
	 * 
	 * @var array()
	 */
	protected $rels = array();
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
	
}