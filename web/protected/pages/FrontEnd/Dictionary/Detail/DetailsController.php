<?php
/**
 * This is the OrderController
 * 
 * @package    Web
 * @subpackage Controller
 * @author     tlan<tlan16@sina.com>
 */
class DetailsController extends FrontEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::$menuItem
	 */
	public $menuItem = 'order.new';
	/**
	 * (non-PHPdoc)
	 * @see BPCPageAbstract::onLoad()
	 */
	public function onLoad($param)
	{
		parent::onLoad($param);
	}
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		if(!isset($this->Request['id']))
			die('System ERR: no param passed in!');
		if(!($word = Word::get($this->Request['id'])) instanceof Word)
			die('Invalid Word passed in!');
		
		$js = parent::_getEndJs();
		
		$videos = array_map(create_function('$a', 'return $a->getVideo();'), WordVideo::getAllByCriteria('wordId = ?', array($word->getId())));
		$json = array();
		foreach ($videos as $video)
		{
			$array = array('url'=> $video->getAsset()->getUrl(), 'definitions'=> array());
			
			foreach(Definition::getAllByCriteria('videoId = ?', array($video->getId())) as $definition)
			{
				$type = $definition->getDefinitionType()->getName();
				if(empty($array['definitions'][$type]))
					$array['definitions'][$type] = array();
				$array['definitions'][$type][] = array('content'=> $definition->getContent(), 'order'=> $definition->getSequence());
			}
			$json[] = $array;
		}
		$js .= "pageJs._word=" . json_encode($word->getJson(array('category'=> $word->getCategory()->getJson()))) . ";";
		$js .= "pageJs._videos=" . json_encode($json) . ";";
		$js .= "pageJs";
			$js .= ".setHTMLIDs('detailswrapper')";
			$js .= ".init();";
		return $js;
	}
}
?>
