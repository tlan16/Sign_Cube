<?php
/**
 * This is the property list for the backend
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class Controller extends BackEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$js = parent::_getEndJs();
		$js .= "pageJs._setHTMLIDs(" . json_encode(array('bodyContainerId' => 'body_container', 'resultTableId' => 'result_table', 'addressInputId'=> 'address_input')) . ")";
		$js .= ".setCallbackId('getAZLinks', '" . $this->getAZLinksBtn->getUniqueID() . "')";
		$js .= ".setCallbackId('getPageLinks', '" . $this->getPageLinksBtn->getUniqueID() . "')";
		$js .= ".init();";
		return $js;
	}
	public function getAZLinks($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$array = array();
			if(isset($param->CallbackParameter->url) )
				$url = trim($param->CallbackParameter->url);
			else throw new Exception('Invalid URL!');
			
			foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] p')[1]->find('a') as $alpha) {
				$array[] = $this->getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href);
			}
			$results['items'] = $array;
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
		return $this;
	}
	public function getPageLinks($sender, $param)
	{
		$results = $errors = array();
		try
		{
			$array = array();
			if(isset($param->CallbackParameter->url) )
				$url = trim($param->CallbackParameter->url);
			else throw new Exception('Invalid URL!');
			
			for($pageNo=1; $pageNo<99; $pageNo++)
			{
				$pageWordsThis = $this->getPageWords($url . '&page=' . $pageNo);
				$pageWordsNext = $this->getPageWords($url . '&page=' . ($pageNo+1) );
				if($pageWordsThis !== $pageWordsNext)
					foreach ($pageWordsThis as $item)
						$array[] = $item;
				else
					{
						foreach ($pageWordsNext as $item)
							$array[] = $item;
						break;
					}
			}
			
			$results['items'] = $array;
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
		return $this;
	}
	private function getPageWords($pageURL)
	{
		$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
		$pageWords = array();
		foreach ($pageHtml->find('#searchresults a') as $link)
		{
			$pageWords[] =  array('href'=> $this->getHostUrl($pageURL) . $link->href,
					'word'=> $link->plaintext,
			);
		}
		return $pageWords;
	}
	
	private function getVideos($url)
	{
		$result = array();
	
		$htmls = array(Simple_HTML_DOM_Abstract::file_get_html($url));
		foreach($htmls[0]->find('#signinfo .pull-right .btn-group a') as $item) {
			$htmls[] = Simple_HTML_DOM_Abstract::file_get_html(changeUrlTail($url, $item->href) );
		}
		foreach ($htmls as $html)
		{
			$iframe = Simple_HTML_DOM_Abstract::file_get_html(getHostUrl($url) . $html->find('#videocontainer iframe')[0]->src );
			$result[] = array('poster'=> $iframe->find('video')[0]->poster, 'video'=> $iframe->find('video source')[0]->src);
		}
	
		return $result;
	}
	private function changeUrlTail($url,$string)
	{
		$url = explode('/', rtrim($url, '/'));
		$url[count($url)-1] = $string;
		$url = implode('/', $url);
		return $url;
	}
	private function getHostUrl($url)
	{
		$parts = parse_url($url);
		return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
	}
}
?>