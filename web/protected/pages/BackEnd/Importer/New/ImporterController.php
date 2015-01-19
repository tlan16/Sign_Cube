<?php
/**
 * This is the PriceMatchController
 * 
 * @package    Web
 * @subpackage Controller
 * @author     lhe<helin16@gmail.com>
 */
class ImporterController extends BackEndPageAbstract
{
	public $PageSize = 10;
	/**
	 * Getting The end javascript
	 *
	 * @return string
	 */
	protected function _getEndJs()
	{
		$importDataTypes = array('language'=> 'Language', 'category'=> 'Category');
		
		$js = parent::_getEndJs();
		// Setup the dnd listeners.
		$js .= 'pageJs';
		$js .= ".setHTMLIDs('importer_div', 'product_code_type_dropdown')";
		$js .= '.setCallbackId("getAllCodeForProduct", "' . $this->getAllCodeForProductBtn->getUniqueID() . '")';
		$js .= '.load(' . json_encode($importDataTypes) . ');';
		return $js;
	}
	

	public function getAllCodeForProduct($sender, $param)
	{
		$result = $errors = $item = array();
		try
		{
// 			var_dump($param->CallbackParameter);
			
			if(!isset($param->CallbackParameter->importDataTypes) || ($type = trim($param->CallbackParameter->importDataTypes)) === '' || ($type = trim($param->CallbackParameter->importDataTypes)) === 'Select a Import Type')
				throw new Exception('Invalid upload type passed in!');

			switch ($type)
			{
				case 'language':
					$index = $param->CallbackParameter->index;
					if(!isset($param->CallbackParameter->name) || ($name = trim($param->CallbackParameter->name)) === '')
						throw new Exception('Invalid language name passed in! (line ' . $index .')');
					if(!isset($param->CallbackParameter->code) || ($code = trim($param->CallbackParameter->code)) === '')
						throw new Exception('Invalid language code passed in! (line ' . $index .')');
					$result['path'] = 'language';
					$item = Language::create($name,$code);
					break;
				case 'category':
					//frank I also want to add a country of origin for the sign language, could we add another column in the database? The catagory and country would have monay to one relationship
					$index = $param->CallbackParameter->index;
					if(!isset($param->CallbackParameter->name) || ($name = trim($param->CallbackParameter->name)) === '')
						throw new Exception('Invalid category name passed in! (line ' . $index .')');
					if(!isset($param->CallbackParameter->language) || ($langname = trim($param->CallbackParameter->language)) === '')
						throw new Exception('Invalid category name passed in! (line ' . $index .')');
					if(!isset($param->CallbackParameter->code) || ($code = trim($param->CallbackParameter->code)) === '')
						throw new Exception('Invalid language code passed in! (line ' . $index .')');
					$result['path'] = 'language';
					$language = Language::create($langname,$code);
					$item = Category::create($language,$name);
					break;
				default:
					throw new Exception('Invalid upload type passed in!');
			}
			
			$result['item'] = $item->getJson();
		}
		catch(Exception $ex)
		{
			$errors[] = $ex->getMessage();
		}
		$param->ResponseData = StringUtilsAbstract::getJson($result, $errors);
	}
	
	private function updateProductCode(Product $product, $myobCode, $productCodeType, $assetAccNo = '', $revenueAccNo = '', $costAccNo = '')
	{
		try
		{
			Dao::beginTransaction();
			
			// only take the myobCode (myob item#) after the first dash
			$position = strpos($myobCode, '-');
			if($position)
			{
				$myobCodeAfter = substr($myobCode, $position+1);	// get everything after first dash
				$myobCodeAfter = str_replace(' ', '', $myobCodeAfter); // remove all whitespace
			}
			else 
			{
				$myobCodeAfter = $myobCode;
			}
			
			$result = array();
			$result['product'] = $product->getJson();
			$result['code']= $myobCodeAfter;
			$result['MYOBcode'] = $myobCode;
			$result['assetAccNo'] = $assetAccNo;
			$result['revenueAccNo'] = $revenueAccNo;
			$result['costAccNo'] = $costAccNo;
			
			// if such code type for such product exist, update it to the new one
			if(!empty($myobCode))
			{
				if(count($productCodes = ProductCode::getAllByCriteria('pro_code.typeId = ? and pro_code.productId = ?', array($productCodeType->getId(), $product->getId()), true,1 ,1 ) ) > 0 )
				{
					$productCodes[0]->setCode($myobCodeAfter)->save();
					$result['codeNew'] = false;
				}
				else // create a new one
				{
					$newCode = ProductCode::create($product, $productCodeType, trim($myobCode));
					$result['codeNew'] = true;
				}
			}
    
			// do the same for MYOB code (NOTE: have to have MYOB code in code type !!!)
			if(!empty($myobCode))
			{
				if(count($productCodes = ProductCode::getAllByCriteria('pro_code.typeId = ? and pro_code.productId = ?', array(ProductCodeType::ID_MYOB, $product->getId()), true,1 ,1 ) ) > 0 )
				{
					$productCodes[0]->setCode($myobCode)->save();
					$result['MYOBcodeNew'] = false;
				}
				else
				{
					ProductCode::create($product, ProductCodeType::get(ProductCodeType::ID_MYOB), trim($myobCode));
					$result['MYOBcodeNew'] = true;
				}
			}
    
			if(!empty($assetAccNo))
				$product->setAssetAccNo($assetAccNo)->save();
			if(!empty($revenueAccNo))
				$product->setRevenueAccNo($revenueAccNo)->save();
			if(!empty($costAccNo))
				$product->setCostAccNo($costAccNo)->save();
			 
			Dao::commitTransaction();
			
			return $result;
		}
		catch(Exception $e) {
			Dao::rollbackTransaction();
			echo $e;
			exit;
		}
	}
	private function checkContainNumber($string)
	{
		return preg_match('/[0-9]+/', $string);
	}
}
?>