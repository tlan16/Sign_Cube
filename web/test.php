<?php
require_once 'bootstrap.php';
echo '<pre>';

try
{
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
}
catch(Exception $e) {
	echo $e;
}

echo '</pre>';
