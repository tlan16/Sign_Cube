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


// <?php

// require_once '../bootstrap.php';

// echo '<pre>';
// Core::setUser(UserAccount::get(UserAccount::ID_SYSTEM_ACCOUNT));

// // configuration
// $fileName = "SKU-match-16K.csv";

// $start = memory_get_usage(); // monite mem usage

// echo '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">'; // optional, bootstrap just for looking

// try
// {
// 	// validate csv
// 	if(!sizeof($fileName))
// 		throw new Exception('Invalid File Name!');
	 
// 	$handle = fopen($fileName, "r");
	 
// 	echo '<table class="table table-striped">';
// 	echo '<tbody>';
	 
// 	$totalCount = $totalExist = $totalNew = 0;
// 	while (($data = fgetcsv($handle, 100000, ',')) !== FALSE) {
// 		echo '<tr>';
// 		if(!empty($data[0]) && !empty($data[1]))
// 		{
// 			$totalCount++;
// 			$code = trim($data[0]);
			 
			 
// 			$language = Language::getAllByCriteria('lang.code = ?', array($code));
// 			if(count($language)M < 1)
// 			{
// 				echo '<td><span style="color:red;"' . $language->getName() . '</span></td>';
// 				Language::create($data[1],$data[0]);
// 			}
			 
			 
// 			$language = Language::create($name,$code);
// 			echo '<td>' . $language->getName() . '</td>';
// 			echo '<td>' . $language->getCode() . '</td>';
// 		}
// 		echo '</tr>';
// 	}
// 	echo '</tbody></table>';
// 	// result summery, note: all count starts at 1
// 	echo '<br/><b>Total Count: ' .$totalCount . '</b>';
// }
// catch(Exception $e) {
// 	echo $e;
// 	exit;
// }

// echo '<br/><br/><br/>DONE (Memory Usage: ' . (memory_get_usage() - $start)/1024 . ' KB)</br>';