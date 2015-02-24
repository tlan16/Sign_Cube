<?php
require_once dirname(__FILE__) . '/../bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

echoLog ('START ' . new UDate() . "\n");

const MAX_PAGE_NO = 99;

try {
	if(count($category = Category::getAllByCriteria('name = ?', array('British'), true, 1, 1)) == 0 || !($category = $category[0]) instanceof Category)
		throw new Exception('auslan Category must exist');
// 	getAllLinks('http://bslsignbank.ucl.ac.uk/dictionary/');
	getAllVideoLinks();
} catch (Exception $ex) {
	echoLog($ex->getMessage());
}
function getWordDefinition($name) // from dictionary.com
{
	$definitionGroups = array();
	
	$pageURL = htmlspecialchars_decode(("http://dictionary.reference.com/browse/" . trim($name)), ENT_QUOTES);
	$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
	foreach ($pageHtml->find('.source-data section.def-pbk') as $block)
	{
		if(count($headers = $block->find('header')) > 0)
		{
			$type = trim($headers[0]->plaintext);
			$type = str_replace('</audio>', '', $type);
			if(strpos($type,'[') !== false)
				$type = trim(preg_replace('/\[.*/', '', $type));
			foreach ($block->find('.def-set') as $defset)
			{
				if(count($sequences = $defset->find('.def-number')) > 0 && count($contents = $defset->find('.def-content')) > 0 && (intval(isset($sequence) ? $sequence : 0) < intval(trim(str_replace('.', '', $sequences[0]->plaintext)))))
				{
					$sequence = trim(str_replace('.', '', $sequences[0]->plaintext));
					$sequence = preg_replace("/[^0-9]/", "", $sequence); // only take numbers from string
					$content = trim($contents[0]->plaintext);
					$definitionGroups[] = array('type'=> htmlspecialchars_decode($type, ENT_QUOTES), 'content'=> htmlspecialchars_decode($content, ENT_QUOTES), 'sequence'=> htmlspecialchars_decode($sequence, ENT_QUOTES));
				}
			}
		}
	}
	return $definitionGroups;
}
function getPageDefinition($url)
{
	$pageURL = htmlspecialchars_decode($url, ENT_QUOTES);
	
	$pageHtml = Simple_HTML_DOM_Abstract::file_get_html($pageURL);
	$definitionGroups = $definitionTypes = $definitionRows = array();
	foreach ($pageHtml->find('#definitionblock .col-md-8 h3') as $item)
		$definitionTypes[] = $item->plaintext;
	foreach ($pageHtml->find('#definitionblock .col-md-8 ol') as $item)
	{
		$array = array();
		foreach ($item->find('li') as $itemdetail)
		{
			if(strpos($itemdetail->plaintext, 'Auslan Signbank') === false)
				$array[] = htmlspecialchars_decode($itemdetail->plaintext, ENT_QUOTES);
		}
		$definitionRows[] = $array;
	}
	foreach ($definitionRows as $key=>$value)
	{
		if(count($value) > 0 && isset($definitionTypes[$key]))
		{
			$definitionGroups[] = array(htmlspecialchars_decode($definitionTypes[$key], ENT_QUOTES) => $value);
		}
	}
	return $definitionGroups;
}
function getAllVideoLinks($delay = 0)
{
	foreach (ThirdPartyWord::getAll() as $word)
	{
		sleep($delay);
		echoLog($delay === 0 ? '' : ('Delay for ' . $delay . ' seconds' . "\n"));
		try 
		{
			Dao::beginTransaction();
			foreach (getVideos($word->getLink()) as $video)
			{
				$page = $video['page'];
				$video = count(ThirdPartyVideo::getAllByCriteria('link = ?', array($video['video']), false, 1, 1)) == 0 ? ThirdPartyVideo::create(basename($video['video']), $video['video'], $video['poster']) : ThirdPartyVideo::getAllByCriteria('link = ? AND poster = ?', array($video['video'], $video['poster']), false, 1, 1)[0];
				echoLog($page . "\n");
				if(count($pageDefinitions = getPageDefinition($page)) > 0)
				{
					foreach ($pageDefinitions as $definition)
					{
						foreach ($definition as $key=>$value)
						{
							$definitionType = ThirdPartyDefinitionType::create($key);
							$definitionRows = array();
							foreach ($value as $item)
							{
								$definitionRows[] = $definitionRow = ThirdPartyDefinition::create($item, $definitionType, $video);
								echoLog($definitionType->getName() . '(ID=' . $definitionType->getId() . '): (ID=' . $definitionRow->getId() . ')' . $definitionRow->getContent() . "\n");
							}
						}
					}
				}
				elseif(count($pageDefinitions = getWordDefinition($word->getName())) > 0)
				{
					foreach ($pageDefinitions as $definition)
					{
						$definitionType = ThirdPartyDefinitionType::create($definition['type']);
						$definitionRow = ThirdPartyDefinition::create($definition['content'], $definitionType, $video, $definition['sequence']);
						echoLog($definitionType->getName() . '(ID=' . $definitionType->getId() . '):' . (empty($definition['sequence']) ? '' : ' ' . $definition['sequence'] . ' :') . ' (ID=' . $definitionRow->getId() . ')' . $definitionRow->getContent() . "\n");
					}
				}
				else throw new Exception('No definition found for word ' . $word->getName());
				$wordVideo = count(ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ? AND thirdPartyVideoId = ?', array($word->getId(), $video->getId()), 1, 1)) == 0 ? ThirdPartyWordVideo::create($word, $video) : ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ? AND thirdPartyVideoId = ?', array($word->getId(), $video->getId()), 1, 1)[0];
				echoLog('word(id=' . $wordVideo->getThirdPartyWord()->getId() . '):' . $wordVideo->getThirdPartyWord()->getName() . ', video(id=' . $wordVideo->getThirdPartyVideo()->getId() . '): ' . $wordVideo->getThirdPartyVideo()->getLink() . ', poster: ' . $wordVideo->getThirdPartyVideo()->getPoster() . "\n");
				echoLog("\n");
			}
			$word->setActive(false)->save();
			Dao::commitTransaction();
		} catch (Exception $ex) {
			Dao::rollbackTransaction();
			echoLog($ex->getMessage());
		}
	}
}
function getAllLinks($url, $delay = 0)
{
	$dictionaryURL = $url;
	foreach (getAZLinks($dictionaryURL) as $AZLink)
	{
		try 
		{
			Dao::beginTransaction();
			sleep($delay);
			echoLog($delay === 0 ? '' : ('Delay for ' . $delay . ' seconds' . "\n"));
			
			for($pageNo=1; $pageNo<MAX_PAGE_NO; $pageNo++)
			{
				echoLog(('Page ' . $pageNo . ':' . "\n"));
				
				$pageWordsThis = getPageWords($AZLink . '&page=' . $pageNo);
				$pageWordsNext = getPageWords($AZLink . '&page=' . ($pageNo+1) );
				if($pageWordsThis !== $pageWordsNext)
				{
					foreach ($pageWordsThis as $item)
					{
						$word = count(ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), false, 1, 1)) == 0 ? ThirdPartyWord::create($item['word'], $item['href']) : ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), false, 1, 1)[0];
						echoLog($word->getName() . "(id= " . $word->getId() . "): " . $word->getLink() . "\n");
					}
					echoLog("\n");
				} else
				{
					foreach ($pageWordsNext as $item)
					{
						$word = count(ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), false, 1, 1)) == 0 ? ThirdPartyWord::create($item['word'], $item['href']) : ThirdPartyWord::getAllByCriteria('name = ? AND link = ?', array($item['word'], $item['href']), false, 1, 1)[0];
						echoLog($word->getName() . "(id= " . $word->getId() . "): " . $word->getLink() . "\n");
					}
					echoLog("\n");
					break;
				}
			}
			echoLog("\n");
			Dao::commitTransaction();
		} catch (Exception $ex) {
			Dao::rollbackTransaction();
			echoLog($ex->getMessage());
		}
	}
}
function bindAsset($url)
{
	try{
		$extraOpts = array(
				CURLOPT_BINARYTRANSFER => true,
				CURLOPT_FOLLOWLOCATION => true
		);
		$tmpFile = 'bslTemp.tmp';
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
		
		$obj = new stdClass();
		$obj->dom = Simple_HTML_DOM_Abstract::file_get_html($url);
		$obj->link = $url;
		$pages[] = $obj;
		
		foreach($obj->dom->find('#signinfo .pull-right .btn-group a') as $item)
		{
			$obj = new stdClass();
			$obj->dom = Simple_HTML_DOM_Abstract::file_get_html(changeUrlTail($url, $item->href));
			$obj->link = changeUrlTail($url, $item->href);
			$pages[] = $obj;
		}
		
		foreach ($pages as $page)
		{
			$iframe = Simple_HTML_DOM_Abstract::file_get_html(getHostUrl($url) . $page->dom->find('#videocontainer iframe')[0]->src);
			$source = $iframe->find('video source')[0]->src;
			$poster = $iframe->find('video')[0]->poster;
			$result[] = array('poster'=> (strpos($poster, "http://") === false ? getHostUrl($page->link) . $poster : $poster), 'video'=> (strpos($source, "http://") === false ? getHostUrl($page->link) . $source : $source), 'page'=> $page->link);
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
		foreach(Simple_HTML_DOM_Abstract::file_get_html($url)->find('div[role=main] .alphablock p')[1]->find('a') as $alpha)
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
	$url = htmlspecialchars_decode($url, ENT_QUOTES);
	$parts = parse_url($url);
	return (isset($parts['scheme']) && isset($parts['host']) ) ? (trim($parts['scheme']) . '://' . trim($parts['host']) ) : '';
}
function echoLog($message)
{
	echo $message;
	$logFile = dirname(__FILE__) . '/bsl.txt';
	file_put_contents($logFile, $message, FILE_APPEND | LOCK_EX);
}