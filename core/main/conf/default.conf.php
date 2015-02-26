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
	,'contact-us' => array (
		'tos' => array('tlan16@sina.com' => 'Signcube Web Contact')
	)
);

?>
