<?php
require_once dirname(__FILE__) . '/../bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

echoLog ('START ' . new UDate() . "\n");

const MAX_PAGE_NO = 99;

try {
	getAllLinks('http://www.auslan.org.au/dictionary/');
	getAllVideoLinks();
} catch (Exception $ex) {
	echoLog($ex->getMessage());
}
function getAllVideoLinks()
{
	foreach (ThirdPartyWord::getAll() as $word)
	{
		foreach (getVideos($word->getLink()) as $video)
		{
			$video = count(ThirdPartyVideo::getAllByCriteria('link = ?', array($video['video']), 1, 1)) == 0 ? ThirdPartyVideo::create(basename($video['video']), $video['video'], $video['poster']) : ThirdPartyVideo::getAllByCriteria('link = ? AND poster = ?', array($video['video'], $video['poster']), 1, 1)[0];
			$wordVideo = count(ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ? AND thirdPartyVideoId = ?', array($word->getId(), $video->getId()), 1, 1)) == 0 ? ThirdPartyWordVideo::create($word, $video) : ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ? AND thirdPartyVideoId = ?', array($word->getId(), $video->getId()), 1, 1)[0];
			echoLog('word(id=' . $wordVideo->getThirdPartyWord()->getId() . '):' . $wordVideo->getThirdPartyWord()->getName() . ', video(id=' . $wordVideo->getThirdPartyVideo()->getId() . '): ' . $wordVideo->getThirdPartyVideo()->getLink() . ', poster: ' . $wordVideo->getThirdPartyVideo()->getPoster() . "\n");
		}
	}
}
function getAllLinks($url, $delay = 0)
{
	$dictionaryURL = $url;
	foreach (getAZLinks($dictionaryURL) as $AZLink)
	{
		sleep($delay);
		echoLog(($AZLink . "\n"));
		
		for($pageNo=1; $pageNo<MAX_PAGE_NO; $pageNo++)
		{
			echoLog(('Page ' . $pageNo . ':' . "\n"));
			
			$pageWordsThis = getPageWords($AZLink . '&page=' . $pageNo);
			$pageWordsNext = getPageWords($AZLink . '&page=' . ($pageNo+1) );
			if($pageWordsThis !== $pageWordsNext)
			{
				foreach ($pageWordsThis as $item)
				{
					$word = count(ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), 1, 1)) == 0 ? ThirdPartyWord::create($item['word'], $item['href']) : ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), 1, 1)[0];
					echoLog($word->getName() . "(id= " . $word->getId() . "): " . $word->getLink() . "\n");
				}
				echoLog("\n");
			} else
			{
				foreach ($pageWordsNext as $item)
				{
					$word = count(ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), 1, 1)) == 0 ? ThirdPartyWord::create($item['word'], $item['href']) : ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), 1, 1)[0];
					echoLog($word->getName() . "(id= " . $word->getId() . "): " . $word->getLink() . "\n");
				}
				echoLog("\n");
				break;
			}
		}
		echoLog("\n");
	}
}
function bindAsset($url)
{
	try{
		$extraOpts = array(
				CURLOPT_BINARYTRANSFER => true,
				CURLOPT_FOLLOWLOCATION => true
		);
		$tmpFile = 'auslanTemp.tmp';
		if (!file_exists($tmpFile))
			file_put_contents($tmpFile, '');
				
		$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
		$asset = Asset::registerAsset(basename($url), $tmpFile);
		return $asset;
	}
	catch(Exception $ex)
	{
		echoLog("\n");
		echoLog($ex->getMessage());
	}
}
function changeUrlTail($url,$string)
{
	$url = explode('/', rtrim($url, '/'));
	$url[count($url)-1] = $string;
	$url = implode('/', $url);
	$url = htmlspecialchars_decode($url, ENT_QUOTES);
	return $url;
}
function getVideos($url)
{
	try 
	{
		$url = htmlspecialchars_decode($url, ENT_QUOTES);
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
	}catch(Exception $ex)
	{
		echoLog($ex->getMessage());
	}
	return $result;
}
function getAZLinks($url)
{
	$results = array();
	try
	{
		$url = htmlspecialchars_decode($url, ENT_QUOTES);
		$array = array();
		
		foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] p')[1]->find('a') as $alpha)
			$results[] = getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href);
	}
	catch(Exception $ex)
	{
		echoLog($ex->getMessage());
	}
	return $results;
}
function getPageWords($pageURL)
{
	try
	{
		$pageURL = htmlspecialchars_decode($pageURL, ENT_QUOTES);
		
		$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
		$pageWords = array();
		foreach ($pageHtml->find('#searchresults a') as $link)
		{
			$link->href = htmlspecialchars_decode($link->href, ENT_QUOTES);
			$pageWords[] =  array('href'=> getHostUrl($pageURL) . $link->href,
					'word'=> htmlspecialchars_decode($link->plaintext, ENT_QUOTES),
			);
		}
	}
	catch(Exception $ex)
	{
		echoLog($ex->getMessage());
	}
	return $pageWords;
}
function getPageLinks($url, $pageNo)
{
	$results =  array();
	try
	{
		$array = array();
			
		$pageWords = getPageWords($url . '&page=' . $pageNo);
		foreach ($pageWords as $item)
			$results[] = $item;
	}
	catch(Exception $ex) 
	{
		echoLog($ex->getMessage());
	}
	return $results;
}
function getHostUrl($url)
{
	$parts = parse_url($url);
	return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
}
function echoLog($message)
{
	echo $message;
	$logFile = dirname(__FILE__) . '/auslan.txt';
	file_put_contents($logFile, $message, FILE_APPEND | LOCK_EX);
}