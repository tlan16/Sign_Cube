<?php
require_once 'bootstrap.php';

echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

try
{
	$extraOpts = array(
			CURLOPT_BINARYTRANSFER => true,
			CURLOPT_FOLLOWLOCATION     => true
	);
	
	$url = 'http://media.auslan.org.au/mp4video/65/65520_1.mp4';
	$tmpFile = __DIR__ . '\runtime\tmp.mp4';
	
	$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
	$asset = Asset::registerAsset(basename($url), $tmpFile);
	var_dump($asset->getUrl());
	echo '<video controls src="' . $asset->getUrl() . '">';
}
catch(Exception $e) {
	echo $e;
}

echo '</pre>';