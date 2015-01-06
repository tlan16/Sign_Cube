<?php

require_once 'bootstrap.php';

echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

// 	echo '<video width="320" height="240" controls>'
// 		 . '<source src="'
// 		 . AuslanVideo::get(1)->getVideoURL()
// 		 .'" type="video/mp4">'
// 		 . '</video>';
// 	die;
	
foreach (getAllLinks('http://www.auslan.org.au/dictionary/') as $link)
{
	try 
	{
		if(!empty(trim($link['href']) ) )
		{
			$data = array('word'=> $link['word'], 'href'=> $link['href'], 'videos'=> getVideos($link['href']) );
			$auslanWord = AuslanWord::create($data['word'], $data['href']);
			foreach ($data['videos'] as $video){
				$newAsset = bindAsset($video['video']);
				$newVideo = AuslanVideo::create($video['video'], $newAsset->getId(), $video['poster']);
				$auslanWord->addVideo($newVideo);
			}
			echo $data['word'] . ': video(' . count($data['videos']) . ')<br/>';
		}
	} catch(Exception $ex){
		echo $ex->getMessage();
	}
}
function bindAsset($url)
{
	$videoTempFile = __DIR__ . '\tmp\tmp.video.mp4';
	$videoTempFile = ComScriptCURL::downloadFile($url, $videoTempFile);
	$asset = Asset::registerAsset('490_1.mp4', $videoTempFile);

	return $asset;
}
function getAllLinks($url)
{
	// expample $url = 'http://www.auslan.org.au/dictionary/';
	$pageWords = array();
	$i = 1;
	foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] p')[1]->find('a') as $alpha)
	{
		for($pageNo=1; $pageNo<99; $pageNo++)
		{
			$pageWordsThis = getPageWords(getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href) . '&page=' . $pageNo);
			$pageWordsNext = getPageWords(getHostUrl($url) . str_replace('search?', 'search/?', $alpha->href) . '&page=' . ($pageNo+1) );
			if($pageWordsThis !== $pageWordsNext )
				foreach ($pageWordsThis as $item)
					$pageWords[] = $item;
				else
				{
					foreach ($pageWordsNext as $item)
						$pageWords[] = $item;
				}
		}
// 		break;
	}
	return $pageWords;
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

function changeUrlTail($url,$string)
{
	$url = explode('/', rtrim($url, '/'));
	$url[count($url)-1] = $string;
	$url = implode('/', $url);
	return $url;
}
function getHostUrl($url)
{
	$parts = parse_url($url);
	return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
}
n getHostUrl($url)
	{
		$parts = parse_url($url);
		return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
	}
}
?>