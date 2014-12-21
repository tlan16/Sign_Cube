<?php

require_once 'bootstrap.php';

echo '<pre>';
Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

Word::create('name1', 'vid1');

echo 'DONE';