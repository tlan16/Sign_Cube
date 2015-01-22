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
	
	$url = 'http://www.w3.org/html/logo/downloads/HTML5_Logo_256.png';
	$tmpFile = __DIR__ . '\runtime\tmp.jpg';
	
	$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
	$asset = Asset::registerAsset(basename($url), $tmpFile);
	var_dump($asset);
}
catch(Exception $e) {
	echo $e;
}

echo '</pre>';