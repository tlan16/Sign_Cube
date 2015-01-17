<?php
require_once ('../bootstrap.php');
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

echoLog ('START ' . new UDate() . "\n");
// /////////////////////////////////////////////////////////////////

// $url = "http://www.auslan.org.au/dictionary/words/alzheimer's-1.html";
// print_r(getVideos($url));

// die;

// ///////////////////////////////////////////////////////////////

const MAX_PAGE_NO = 99;

try {
	$dictionaryURL = 'http://www.auslan.org.au/dictionary/';
	foreach (getAZLinks($dictionaryURL) as $AZLink)
	{
		echoLog( ($AZLink . "\n"));
		
		$pageWords = array();
		for($pageNo=1; $pageNo<MAX_PAGE_NO; $pageNo++)
		{
			echoLog( ('Page ' . $pageNo . ':' . "\n"));
			echoLog( ('Sleep for 5 seconds' . "\n"));
			sleep(5);
			
			$pageWordsThis = getPageWords($AZLink . '&page=' . $pageNo);
			$pageWordsNext = getPageWords($AZLink . '&page=' . ($pageNo+1) );
			if($pageWordsThis !== $pageWordsNext)
			{
				foreach ($pageWordsThis as $item)
				{
					$item['word'] = $item['word'];
					$item['videos'] = getVideos($item['href']);
					$pageWords[] = $item;
					
					$auslanWord = AuslanWord::create($item['word'], $item['href']);
					echoLog( ($auslanWord->getName() . '('));
					foreach ($item['videos'] as $video)
					{
						$newAsset = bindAsset($video['video']);
						$newVideo = AuslanVideo::create($video['video'], '', $video['poster'], $newAsset->getId());
						$auslanWord->addVideo($newVideo);
						echoLog( ($newVideo->getAssetId()));
					}
					echoLog( (count($item['videos'])));
					echoLog( (')' . "\n"));
				}
				echoLog( ("\n"));
			} else
			{
				foreach ($pageWordsNext as $item)
				{
					$item['word'] = $item['word'];
					$item['videos'] = getVideos($item['href']);
					$pageWords[] = $item;
					
					$auslanWord = AuslanWord::create($item['word'], $item['href']);
					echoLog( ($auslanWord->getName() . '('));
					foreach ($item['videos'] as $video)
					{
						$newAsset = bindAsset($video['video']);
						$newVideo = AuslanVideo::create($video['video'], '', $video['poster'], $newAsset->getId());
						$auslanWord->addVideo($newVideo);
						echoLog( $newVideo->getAssetId());
					}
					echoLog( (count($item['videos'])));
					echoLog( (')' . "\n"));
				}
				echoLog( ("\n"));
				break;
			}
		}
		echoLog( ("\n"));
	// 	break; // remove this to run entire A-Z
	}

} catch (Exception $ex) {
	echo '<pre>';
	echoLog( $ex->getMessage());
}
function bindAsset($url)
{
	try{
		$extraOpts = array(
				CURLOPT_BINARYTRANSFER => true,
				CURLOPT_FOLLOWLOCATION     => true
		);
		
		$tmpFile = '..\runtime\tmp.mp4';
		$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
		$asset = Asset::registerAsset(basename($url), $tmpFile);
		return $asset;
	}
	catch(Exception $ex)
	{
		echo '<pre>';
		echoLog( ("\n"));
		echoLog( $ex->getMessage());
	}
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
	try 
	{
		$url = str_replace('&#39;s', "'" . 's', $url);
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
		echo '<pre>';
		echoLog( $ex->getMessage());
	}
	return $result;
}
function getAZLinks($url)
{
	$results = array();
	try
	{
		$url = str_replace('&#39;s', "'" . 's', $url);
		$array = array();
		
		foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] p')[1]->find('a') as $alpha)
			$results[] = getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href);
	}
	catch(Exception $ex)
	{
		echo '<pre>';
		echoLog( $ex->getMessage());
	}
	return $results;
}
function getPageWords($pageURL)
{
	try
	{
		$pageURL = str_replace('&#39;s', "'" . 's', $pageURL);
		
		$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
		$pageWords = array();
		foreach ($pageHtml->find('#searchresults a') as $link)
		{
			$pageWords[] =  array('href'=> getHostUrl($pageURL) . $link->href,
					'word'=> $link->plaintext,
			);
		}
	}
	catch(Exception $ex)
	{
		echo '<pre>';
		echoLog( $ex->getMessage());
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
		echo '<pre>';
		echoLog( $ex->getMessage());
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
	$logFile = '..\logs\auslan.txt';
	$current = file_get_contents($logFile);
	$current .=  $message;
	file_put_contents($logFile, $current);
}