<?php
/**
 * Words Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Word extends BaseEntityAbstract
{
    /**
     * The name of the word
     * @var string
     */
    private $name;
    public function setName($name)
    {
    	$this->name = trim($name);
    	return $this;
    }
    public function getName()
    {
    	return $this->name;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'word');
        DaoMap::setStringType('name');
        parent::__loadDaoMap();
        
        DaoMap::createUniqueIndex('name');
        DaoMap::commit();
    }
    public static function create($name)
    {
    	$words = self::getAllByCriteria('name = ?', array($name), false, 1, 1);
    	if(count($words) > 0)
    		return $words[0];
    	
    	$word = new Word();
    	return $word->setName($name)
    		->save();
    }
}

?>
