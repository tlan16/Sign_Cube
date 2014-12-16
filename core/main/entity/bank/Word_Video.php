<?php
/**
 * Word_Video Entity
 *
 * @package    Core
 * @subpackage Entity
 * @author     lhe<helin16@gmail.com>
 */
class Word_Video extends BaseEntityAbstract
{
	/**
	 * The word
	 * 
	 * @var Word
	 */
    protected $word;
    public function getWord()
    {
    	$this->loadManyToOne('word');
    	return $this->word;
    }
    public function setWord(Word $word)
    {
    	$this->word = $word;
    	return $this;
    }
    /**
     * (non-PHPdoc)
     * @see BaseEntity::__loadDaoMap()
     */
    public function __loadDaoMap()
    {
        DaoMap::begin($this, 'wv');
        DaoMap::setManyToOne('word', 'Word', 'wv_word');
        parent::__loadDaoMap();
        
        DaoMap::commit();
    }
}

?>
