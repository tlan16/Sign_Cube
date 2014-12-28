<?php
/**
 * This is the property list for the backend
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class NewWordController extends FrontEndPageAbstract
{
	/**
	 * (non-PHPdoc)
	 * @see CRUDPageAbstract::_getEndJs()
	 */
	protected function _getEndJs()
	{
		$word = new Word();
		$js = parent::_getEndJs();
		$js .= "pageJs.setHTMLIDs(" . json_encode(array('itemDivId' => 'item-details-div')) . ")";
		$js .= ".setCallbackId('saveWord', '" . $this->saveWordBtn->getUniqueID() . "')";
		$js .= ".load(" . json_encode($word->getJson()) . ");";
		return $js;
	}
	/**
	 * creating the property
	 *
	 * @param TCallback          $sender
	 * @param TCallbackParameter $param
	 *
	 * @return Controller
	 */
	public function saveWord($sender, $param)
	{
		$results = $errors = array();
		try
		{
			Dao::beginTransaction();
			
			$searchTxt = trim($param->CallbackParameter->searchTxt);
			$words = Word::getAllByCriteria('word.name = :name', array('name'=> $searchTxt));
			
			
			
			if(!isset($param->CallbackParameter->relTypeId) || !($role = Role::get($param->CallbackParameter->relTypeId)) instanceof Role)
				throw new Exception('System Error: Invalid rel type provided.');
			
			$propertyObj = isset($param->CallbackParameter->newProperty) ? json_decode(json_encode($param->CallbackParameter->newProperty), true) : array();
			if(!is_array($propertyObj) || count($propertyObj) === 0)
				throw new Exception('System Error: can access provided information, insuffient data provided.');
			
			if(!isset($propertyObj['sKey']) || !($property = Property::getPropertyByKey(trim($propertyObj['sKey']))) instanceof Property)
			{
				$addressObj = $propertyObj['address'];
				$addrKey = Address::genKey($addressObj['street'], $addressObj['city'], $addressObj['region'], $addressObj['country'], $addressObj['postCode']);
				if(!($address = Address::getByKey($addrKey)) instanceof Address)
					$address = Address::create($addressObj['street'], $addressObj['city'], $addressObj['region'], $addressObj['country'], $addressObj['postCode']);
				$property = Property::create($address, trim($propertyObj['noOfRooms']), trim($propertyObj['noOfBaths']), trim($propertyObj['noOfCars']), trim($propertyObj['description']));
			}
			$property->addPerson(Core::getUser()->getPerson(), $role);
			$results['url'] = '/backend/property/' . $property->getSKey() . '.html';
			
			Dao::commitTransaction();
		}
		catch(Exception $ex)
		{
			Dao::rollbackTransaction();
			$errors[] = '<pre>' . $ex->getMessage(). "\n" . $ex->getTraceAsString() . '</pre>';
		}
		$param->ResponseData = StringUtilsAbstract::getJson($results, $errors);
		return $this;
	}
}
?>