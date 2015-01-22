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
	echo '<img src="' . $tmpFile . '">';
	die($tmpFile);
	$asset = Asset::registerAsset('490_1.mp4', $videoTempFile);
}
catch(Exception $e) {
	echo $e;
}

echo '<br/><br/><br/>DONE (Memory Usage: ' . (memory_get_usage() - $start)/1024 . ' KB)</br>';

echo '</pre>';