<?php 
include_once 'Html5Video.php';

$config = array(
  'ffmpeg.bin' => '/usr/bin/ffmpeg',
  'qt-faststart.bin' => '/usr/bin/qt-faststart',
);
$html5 = new Html5Video\Html5Video($config);

$html5->convert('test.MOV', 'html5-720p.mp4', '720p-sd');
var_dump($html5);

 ?>