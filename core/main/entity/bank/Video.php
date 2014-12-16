<?php
/**
 * Video Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Video extends BaseEntityAbstract
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
        DaoMap::begin($this, 'v');
        DaoMap::setStringType('name');
        parent::__loadDaoMap();
        
        DaoMap::createIndex('name');
        DaoMap::commit();
    }
}

?>
