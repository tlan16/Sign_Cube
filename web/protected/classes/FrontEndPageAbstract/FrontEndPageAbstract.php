<?php
/**
 * The FrontEnd Page Abstract
 * 
 * @package    Web
 * @subpackage Class
 * @author     lhe<helin16@gmail.com>
 */
abstract class FrontEndPageAbstract extends TPage 
{
	/**
	 * constructor
	 */
	public function __construct()
	{
	    parent::__construct();
	}
	/**
	 * (non-PHPdoc)
	 * @see TControl::onInit()
	 */
	public function onInit($param)
	{
		parent::onInit($param);
	}
	/**
	 * (non-PHPdoc)
	 * @see TControl::onLoad()
	 */
	public function onLoad($param)
	{
	    if(!$this->IsPostBack || !$this->IsCallback)
	    {
	        $this->getClientScript()->registerEndScript('pageJs', $this->_getEndJs());
	    }
	}
	/**
	 * Getting The end javascript
	 * 
	 * @return string
	 */
	protected function _getEndJs() 
	{
		$js ='jQuery("#header > .top-head").affix({
				offset: {
				    top: 10,
				    bottom: function () {
				      return (this.bottom = jQuery(".footer").outerHeight(true))
				    }
				}
			}).on("affix.bs.affix", function(){ jQuery( this ).data("originalPadding", jQuery( this ).css("padding")).css("padding", 0); })
			.on("affixed-top.bs.affix", function() {jQuery( this ).css("padding", jQuery( this ).data("originalPadding"));});';
	    $js .= 'if(typeof(PageJs) !== "undefined"){var pageJs = new PageJs(); }';
	    return $js;
	}
	/**
	 * (non-PHPdoc)
	 * @see TPage::render()
	 */
	public function onPreInit($param)
	{
	    parent::onPreInit($param);
	    $this->_Load3rdPartyJs();
	    $clientScript = $this->getPage()->getCLientScript();
	    
	    $clientScript->registerPradoScript('ajax');
	    $this->_loadPageJsClass();
        $cScripts = self::getLastestJS(get_class($this));
	    if (isset($cScripts['js']) && ($lastestJs = trim($cScripts['js'])) !== '')
	        $clientScript->registerScriptFile('pageJs', $this->publishAsset($lastestJs));
	    if (isset($cScripts['css']) && ($lastestCss = trim($cScripts['css'])) !== '')
	        $clientScript->registerStyleSheetFile('pageCss', $this->publishAsset($lastestCss));
	}
	/**
	 * loading the page js class files
	 */
	protected function _loadPageJsClass()
	{
		$cScripts = self::getLastestJS(__CLASS__);
		if (isset($cScripts['js']) && ($lastestJs = trim($cScripts['js'])) !== '')
			$this->getPage()->getClientScript()->registerScriptFile('frontEndPageJs', Prado::getApplication()->getAssetManager()->publishFilePath(dirname(__FILE__) . '/'  . $lastestJs, true));
	    return $this;
	}
	private function _Load3rdPartyJs()
	{
		$clientScript = $this->getPage()->getClientScript();
		$folder = $this->publishFilePath(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'videoJs' . DIRECTORY_SEPARATOR);
		$clientScript->registerHeadScriptFile('videoJs.js', $folder . '/video.dev.js');
		$clientScript->registerStyleSheetFile('videoJs.css', $folder . '/video-js.css');
	}
	/**
	 * Getting the lastest version of Js and Css under the Class'file path
	 * 
	 * @param string $className The class name
	 * 
	 * @return multitype:string
	 */
	public static function getLastestJS($className)
	{
	    $array = array('js' => '', 'css' => '');
	    try
	    {
	        //loading controller.js
	        $class = new ReflectionClass($className);
	        $fileDir = dirname($class->getFileName()) . DIRECTORY_SEPARATOR;
	        if (is_dir($fileDir))
	        {
	            //loop through the directory to find the lastes js version or css version
	            $lastestJs = $lastestJsVersionNo = $lastestCss = $lastestCssVersionNo = '';
	            if ($handle = opendir($fileDir))
	            {
	                while (false !== ($fileName = readdir($handle)))
	                {
	                    preg_match("/^" . $className . "\.([0-9]+\.)?(js|css)$/i", $fileName, $versionNo);
	                    if (isset($versionNo[0]) && isset($versionNo[1]) && isset($versionNo[2]))
	                    {
	                        $type = trim(strtolower($versionNo[2]));
	                        $version = str_replace('.', '', trim($versionNo[1]));
	                        if ($type === 'js') //if loading a javascript
	                        {
	                            if ($lastestJs === '' || $version > $lastestJsVersionNo)
	                            $array['js'] = trim($versionNo[0]);
	                        }
	                        else if ($type === 'css')
	                        {
	                            if ($lastestCss === '' || $version > $lastestCssVersionNo)
	                            $array['css'] = trim($versionNo[0]);
	                        }
	                    }
	                }
	            }
	        }
	        unset($className, $class, $fileDir, $lastestJs, $lastestJsVersionNo, $lastestCss, $lastestCssVersionNo);
	    }
	    catch(Exception $e)
	    {
	        //we are not doing anything if we failed here!
	    }
	    return $array;
	}
	/**
	 * Getting the application name
	 *
	 * @return string
	 */
	public function getAppName()
	{
		$array = Core::getAppMetaInfo();
		return isset($array['name']) ? trim($array['name']) : '';
	}
	/**
	 * Getting the 404 page
	 * 
	 * @param string $title   The title of the page
	 * @param string $content The html code content
	 * 
	 * @return string The html code of the page
	 */
	public static function show404Page($title, $content)
	{
		header("HTTP/1.0 404 Not Found");
		$html = "<h1>$title</h1>";
		$html .= $content;
		return $html;
	}
}
?>