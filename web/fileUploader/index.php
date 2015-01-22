<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */



error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');

require_once '../bootstrap.php';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

setlocale(LC_CTYPE, "en_US.UTF-8");
$path = '/tmp/' . md5(new UDate()) . '/';
$upload_handler = new UploadHandler(array(
	'print_response' => false
	,'upload_dir'	=> $path 
	,'param_name' => 'file'
));

$fileName = $path . $_FILES['file']['name'];
if(!is_file($fileName))
	die('Invalid file!');
$asset = Asset::registerAsset($_FILES['file']['name'], $fileName);
$video = Video::create($asset, '', '');
header('Content-Type: application/json');
echo json_encode(array('asset'=> $asset->getJson(), 'video'=> $video->getJson()));


// function bindAsset($url, $mimeType)
// {
// 	try{
// 		$extraOpts = array(
// 				CURLOPT_BINARYTRANSFER => true,
// 				CURLOPT_FOLLOWLOCATION     => true
// 		);

// 		$tmpFile = '..\runtime\tmp.mp4';
// 		$tmpFile = ComScriptCURL::downloadFile($url, $tmpFile, null, $extraOpts);
// 		$name = basename(str_replace('?file=', '', str_replace('&download=1', '', $url)));
// 		$asset = Asset::registerAsset('', $tmpFile, $mimeType);
// 		return $asset;
// 	}
// 	catch(Exception $ex)
// 	{
// 		throw new Exception($ex->getMessage());
// 	}
// }