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
		'name' => 'PropertA'
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
		'default_from_name' => 'PropertA'            
	)
	,'google' => array(
		'reCaptcha' => array (
			'public-key' => '6Lf4xgETAAAAAEZAew6nQnG3e8xya8d7OpZuLFtf', 
			'verify-url' => 'https://www.google.com/recaptcha/api/siteverify',
			'secret-key' => '6Lf4xgETAAAAAKxK7oSZQIyxFFEOD4nXv_c1wMVW'
		)
	)
	,'contact-us' => array (
		'tos' => array('helin16@gmail.com' => 'PropertA Web Contact')
	)
);

?>
