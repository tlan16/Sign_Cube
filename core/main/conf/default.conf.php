<?php
return array(
	'Database' => array(
			'Driver' => 'mysql',
			'DBHost' => 'localhost',
			'DB' => 'signcube',
			'Username' => 'root',
			'Password' => 'root'
		)
	,'Application' => array(
		'name' => 'Signcube'
		,'version' => '1.0.0'
	)
	,'MailServer' =>  array (
		'host' => 'mail.budgetpc.com.au',
		'port' => 587,
		'SMTPAuth' => true,
		'Username' => 'noreply@budgetpc.com.au',
		'Password' => 'budget123pc',
		'SMTPSecure' => 'smtp',
		'default_from_addr' => 'noreply@properta.com.au',
		'default_from_name' => 'Signcube'            
	)
	,'google' => array(
		'reCaptcha' => array (
			'public-key' => '6LfeqgITAAAAALqnAHc5r3v6uk4MQ5487x9PjMTB', 
			'verify-url' => 'https://www.google.com/recaptcha/api/siteverify',
			'secret-key' => '6LfeqgITAAAAALYcYcQFP2jd7oAqnvMxZBcxyl'
		)
	)
	,'mailChimp' => array(
		'api-key' => '24672389dcbb536fddab603d23a0ad2a-us10'
	)
	,'contact-us' => array (
		'tos' => array('tlan16@sina.com' => 'Signcube Web Contact')
	)
	,'handbrake' => array (
		'program' => 
			(substr(php_uname(), 0, 7) == "Windows") ?
				'"S:\Program Files\Handbrake\HandBrakeCLI.exe"'
			:
				'HandBrakeCLI'
		,'param' =>
			(substr(php_uname(), 0, 7) == "Windows") ?
				" -e x264  -q 20.0 -r 24 --vfr  -a 1,1 -E ffaac,copy:ac3 -B 80,80 -6 mono,none -R Auto,Auto -D 0.0,0.0 --audio-copy-mask aac,ac3,dtshd,dts,mp3 --audio-fallback ffac3 -f mp4 -X 480 --keep-display-aspect --modulus 2 -m --x264-preset fast --h264-profile high --h264-level 4.0"
					: // server has an older version
				" -e x264  -q 20.0 -r 24 -a 1,1 -E faac,copy:ac3 -B 80,80 -6 mono,none -R Auto,Auto -D 0.0,0.0 -f mp4 -X 480 --loose-anamorphic -m -x cabac=0:ref=2:me=umh:bframes=0:weightp=0:8x8dct=0:trellis=0:subme=6"
	)
);

?>
