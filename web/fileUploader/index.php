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
	,'max_file_size' => 1000000/*1MB*/ * 50
));

$fileName = $outputFile = $path . $_FILES['file']['name'];
if($_FILES['file']['type'] !== 'video/mp4')
{
	$inputFile = $fileName;
	$outputFile = $path. pathinfo($inputFile, PATHINFO_FILENAME) . "_after.mp4";
	$commend = Config::get('handbrake', 'program') . "  -i " . $inputFile . " -t 1 --angle 1 -c 1 -o " . $outputFile . Config::get('handbrake', 'param');
	execAndWait($commend);
}

if(!is_file($outputFile))
	throw new Exception('Invalid file!');
$asset = Asset::registerAsset(basename($outputFile), $outputFile);
$video = Video::create($asset, '', '');
header('Content-Type: application/json');
echo json_encode(array('video'=> $video->getJson()));

function execAndWait($cmd) {
	if (substr(php_uname(), 0, 7) == "Windows"){
		$WshShell = new COM("WScript.Shell");
		$oExec = $WshShell->Run($cmd, 3, true);
	}
	else {
		exec($cmd);
	}
}
function execInBackground($cmd) {
	if (substr(php_uname(), 0, 7) == "Windows"){
		$WshShell = new COM("WScript.Shell");
		$oExec = $WshShell->Run($cmd, 3, false);
	}
	else {
		exec($cmd);
	}
}