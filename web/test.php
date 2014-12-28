<?php

require_once 'bootstrap.php';

echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

try
{
	$videoTempFile = __DIR__ . '\tmp\tmp.video.mp4';
// 	var_dump($videoTempFile);
	$url = 'http://media.auslan.org.au/mp4video/49/490_1.mp4';
	$videoTempFile = ComScriptCURL::downloadFile($url, $videoTempFile);
	$assetId = Asset::registerAsset('490_1.mp4', $videoTempFile);
	var_dump($assetId->getUrl());
	
	echo '<video width="320" height="240" controls>'
		 . '<source src="'
// 		 . $assetId->getUrl()
		 . Asset::get(4)->getUrl()
		 .'" type="video/mp4">'
		 . '</video>';
	
	
} catch(Exception $ex)
{
	throw new Exception('<pre>' . $ex->getMessage(). "\n" . $ex->getTraceAsString() . '</pre>');
}

function bindAsset($url)
{
	$videoTempFile = __DIR__ . '\tmp\tmp.video.mp4';
	$videoTempFile = ComScriptCURL::downloadFile($url, $videoTempFile);
	$assetId = Asset::registerAsset('490_1.mp4', $videoTempFile);
	
	return $assetId;
}

die;

