<?php
use Html5Video\Html5Video;
require_once 'bootstrap.php';
echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));
try
{
	$profileName = '480p-hd'; // other profiles are listed in src/Html5Video/profiles

	$config = array(
	  'ffmpeg.bin' => '/usr/bin/ffmpeg',
	  'qt-faststart.bin' => '/usr/bin/qt-faststart',
	);

	$class = new Html5Video(profileName);

	$class->convert("test.wmv", "test.mp4", $profileName);
	
	die;
	// this username, password only existing in app
	$username = 'test@test.com';
	$password = 'test';
	// app only pass over the skey to get token
	$skey = (md5($username . sha1($password)));
	$user = UserAccount::getUserBySkey($skey);
	Core::setUser($user);
	$username = $user->getUsername();
	$password = $user->getPassword();
	// token is a md5 of username, password and current datetime
	$token = md5($username . $password . trim(new UDate()));
	$now = new UDate();
	// the default expiry is 24 hours
	$newUser = UserAccount::create('token', $token, $user->getPerson(), $now->modify('+' . UserAccount::DEFAULT_TOKEN_EXPIRE . ' hours'));
	// must set newUser active
	$newUser->setActive(true)->save();
	// after first auth, pass over token and do this
	$comfirmUser = UserAccount::getUserBySkey(md5('token' . $token));
	Core::setUser($comfirmUser);
	// to get infomations
	$words = Word::getAll();
	$videos = Video::getAll();
	$languages = Language::getAll();
	$categories = Category::getAllByCriteria('languageId = ?', array($languages[0]->getId()));
	// to get json
	$json = array();
	foreach ($languages as $language)
	{
		$json[] = $language->getJson();
	}
	var_dump($json);
}
catch(Exception $e) {
	echo $e;
}

echo '</pre>';
