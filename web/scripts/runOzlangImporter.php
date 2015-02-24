<?php
require_once dirname(__FILE__) . '/../bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

echoLog ('START ' . new UDate() . "\n");

const MAX_PAGE_NO = 99;
const TEMP_FILE = 'auslanTemp.tmp';

try
{
	if(count($category = Category::getAllByCriteria('name = ?', array('Auslan'), true, 1, 1)) == 0 || !($category = $category[0]) instanceof Category)
		throw new Exception('auslan Category must exist');
	if(!($language = $category->getLanguage()) instanceof Language)
		throw new Exception('Language for ' . $category->getName() .' must exist');
	// Drop all ThirdPartyWord unfinished word
	ThirdPartyWord::deleteByCriteria('active = ?', array(true));
	// Set all ThirdPartyWord to active
	echoLog('Initialising ... ');
	foreach (ThirdPartyWord::getAll(false) as $thirdPartyWord)
		$thirdPartyWord->setActive(true)->save();
	
	foreach (ThirdPartyWord::getAll() as $thirdPartyWord)
	{
		try
		{
			Dao::beginTransaction();
			
			// Import Word
			if(count($thirdPartyVideos = ThirdPartyWordVideo::getAllByCriteria('thirdPartyWordId = ?', array($thirdPartyWord->getId()))) == 0)
				throw new Exception('***ERROR: No Video exist for Word ' . $thirdPartyWord->getName(), true);
			$word = Word::create($language, $category, $thirdPartyWord->getName());
			$thirdPartyWord->setActive(false)->save();
			echoLog('WORD(' . $word->getId() . ') ' . $word->getName() . ' CREATED');
			foreach($thirdPartyVideos as $thirdPartyWordVideo)
			{
				$thirdPartyVideo = $thirdPartyWordVideo->getThirdPartyVideo();
				if(count($thirdPartyDefinitions = ThirdPartyDefinition::getAllByCriteria('thirdPartyVideoId = ?', array($thirdPartyVideo->getId()))) == 0)
					throw new Exception('***ERROR: No Definition exist for Video ' . $thirdPartyVideo->getId());
				if (!file_exists(TEMP_FILE))
					file_put_contents(TEMP_FILE, '');
				$tmpFile = ComScriptCURL::downloadFile($url = $thirdPartyVideo->getLink(), TEMP_FILE, null, array(CURLOPT_BINARYTRANSFER => true, CURLOPT_FOLLOWLOCATION => true));
				$asset = Asset::registerAsset(basename($url), $tmpFile);
				echoLog('ASSET(' . $asset->getId() . ') ' . $asset->getUrl() . ' ' . $asset->getPath() . ' CREATED');
				$video = Video::create($asset, 'http://auslan.org.au/', $url);
				echoLog('VIDEO(' . $video->getId() . ')  CREATED');
				foreach ($thirdPartyDefinitions as $thirdPartyDefinition)
				{
					$thirdPartyDefinitionType = $thirdPartyDefinition->getThirdPartyDefinitionType();
					$definitionType = DefinitionType::create($thirdPartyDefinitionType->getName());
					echoLog('DefinitionType(' . $definitionType->getId() . ')' . $definitionType->getName() . ' CREATED/UPDATED');
					$definition = Definition::create($thirdPartyDefinition->getContent(), $definitionType, $video);
					echoLog('Definition(' . $definition->getId() . ') ' . $definition->getContent() .' CREATED');
					$thirdPartyDefinition->setActive(false)->save();
				}
				$thirdPartyVideo->setActive(false)->save();
				$thirdPartyWordVideo->setActive(false)->save();
			}
			Dao::commitTransaction();
		} catch(Exception $ex) {
			Dao::rollbackTransaction();
			echoLog($ex->getMessage());
		}
	}
} catch (Exception $ex) {
	echoLog($ex->getMessage());
}
function bindAsset($url)
{
	try{
		Dao::beginTransaction();
		$extraOpts = array(
				CURLOPT_BINARYTRANSFER => true,
				CURLOPT_FOLLOWLOCATION => true
		);
		$tmpFile = 'auslanTemp.tmp';
		if (!file_exists($tmpFile))
			file_put_contents($tmpFile, '');

		$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
		$asset = Asset::registerAsset(basename($url), $tmpFile);
		Dao::commitTransaction();
		return $asset;
	}
	catch(Exception $ex)
	{
		Dao::rollbackTransaction();
		echoLog("\n");
		echoLog($ex->getMessage());
	}
}
function echoLog($message, $newLine = true)
{
	echo $message . ($newLine ? "\n" : '');
	$logFile = dirname(__FILE__) . '/auslan.txt';
	file_put_contents($logFile, $message, FILE_APPEND | LOCK_EX);
}