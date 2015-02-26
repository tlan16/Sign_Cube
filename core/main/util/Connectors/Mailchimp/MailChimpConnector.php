<?php
class MailChimpConnector
{
	/**
	 * get Api key for mail chimp
	 * 
	 * @return Mixed
	 */
	private static function getKey()
	{
		return Config::get('mailChimp', 'api-key');
	}
	public static function subscribe($email, $firstName = '', $lastName = '', $listId = '', $debug = false)
	{
		if(empty($listId)) // if listId not given, use the first list
		{
			$class = new MailChimp(self::getKey());
			$list = $class->call('lists/list');
			if($debug === true)
				print_r($list);
			if(!isset($list) || empty($list['total']) || !empty($list['errors']))
				throw new Exception('MainChimp Connection Error');
			$list = $list['data'][0];
			$listId = $list['id'];
		}
		$result = $class->call('lists/subscribe', array(
				'id'                => $listId,
				'email'             => array('email'=>trim($email)),
				'merge_vars'        => array('FNAME'=>trim($firstName), 'LNAME'=>trim($lastName)),
				'double_optin'      => false,
				'update_existing'   => true,
				'replace_interests' => false,
				'send_welcome'      => false,
		));
		if($debug === true)
			print_r($result);
		return $result;
	}
}