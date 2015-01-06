<?php

require_once 'bootstrap.php';

echo 'START' . "\n";
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
	
$dictionaryURL = 'http://www.auslan.org.au/dictionary/';
foreach (getAZLinks($dictionaryURL) as $AZLink)
{
	echo $AZLink . "\n";
	
	$pageWords = array();
	for($pageNo=1; $pageNo<99; $pageNo++)
	{
		echo 'Page ' . $pageNo . ':' . "\n";
		$pageWordsThis = getPageWords($AZLink . '&page=' . $pageNo);
		$pageWordsNext = getPageWords($AZLink . '&page=' . ($pageNo+1) );
		if($pageWordsThis !== $pageWordsNext)
		{
			foreach ($pageWordsThis as $item)
			{
				$item['word'] = htmlspecialchars_decode($item['word']);
				$item['videos'] = getVideos($item['href']);
				$pageWords[] = $item;
				
				$auslanWord = AuslanWord::create($item['word'], $item['href']);
				echo $auslanWord->getName() . '(';
				foreach ($item['videos'] as $video)
				{
					$newAsset = bindAsset($video['video']);
					$newVideo = AuslanVideo::create($video['video'], $newAsset->getId(), $video['poster']);
					$auslanWord->addVideo($newVideo);
					echo $newVideo->getAssetId();
				}
				
				echo ')' . "\n";
			}
			echo "\n";
		} else
		{
			foreach ($pageWordsNext as $item)
			{
				$item['word'] = htmlspecialchars_decode($item['word']);
				$pageWords[] = $item;
				echo $item['word'] . "\t";
			}
			break;
		}
	}
	echo "\n";
// 	break; // remove this to run entire A-Z
}
function bindAsset($url)
{
	$videoTempFile = __DIR__ . '\tmp\tmp.video.mp4';
	$videoTempFile = ComScriptCURL::downloadFile($url, $videoTempFile);
	$asset = Asset::registerAsset(basename($url), $videoTempFile);
	
	return $asset;
}
function changeUrlTail($url,$string)
{
	$url = explode('/', rtrim($url, '/'));
	$url[count($url)-1] = $string;
	$url = implode('/', $url);
	return $url;
}
function getVideos($url)
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
function getAZLinks($url)
{
	$results = array();
	try
	{
		$array = array();
			
		foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] p')[1]->find('a') as $alpha)
			$results[] = getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href);
	}
	catch(Exception $ex)
	{
		echo $ex->getMessage();
	}
	return $results;
}
function getPageWords($pageURL)
{
	$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
	$pageWords = array();
	foreach ($pageHtml->find('#searchresults a') as $link)
	{
		$pageWords[] =  array('href'=> getHostUrl($pageURL) . $link->href,
				'word'=> $link->plaintext,
		);
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
		echo $ex->getMessage();
	}
	return $results;
}
function getHostUrl($url)
{
	$parts = parse_url($url);
	return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
}