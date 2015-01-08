<?php

require_once 'bootstrap.php';

echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

try
{
	ComScriptCURL::downloadFile('www.google.com.au', $localFile)
} catch(Exception $ex)
{
	throw new Exception('<pre>' . $ex->getMessage(). "\n" . $ex->getTraceAsString() . '</pre>');
}

echo 'DONE';

die;