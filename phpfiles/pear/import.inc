<?php
$WORKSPACE_DIR =$_SERVER["WORKSPACE_PATH"];
$ZIP_PROJECTS =$_SERVER["ZIP_PROJECTS"];
$OS=$_SERVER["WORKSPACE_OS"];
$THIRDPARTY_DIR=$_SERVER["THIRDPARTIES_DIR"];
$SLASH="";
$classPathArray=array();
$jsFilesArray=array();
$cssFileArray=array();

if($OS=="WINDOWS"){
$SLASH="\\";
}else {
$SLASH="/";
}

function import($classPath)
{
	global $classPathArray;
	//echo "<p style='color:red'>". $classPath . "</p>";
	if(isset($classPathArray[$classPath]))return;
	$classPathArray[$classPath]=$classPath;
	
    global $WORKSPACE_DIR;
    global $OS;
    global $SLASH;
    /* If the path ends with a '.*' then include
       all the files in the last given directory.
    */
    if(preg_match('/(\.\*)$/', $classPath))
    {
        $importFilePath = substr($classPath, 0, strlen($classPath) - 2);
        $importFilePath = str_replace(".", $SLASH, $importFilePath);
        $existedPath=getMeDirectoryBunch($importFilePath);
		//unset($classPathArray[$classPath]);
		if($existedPath==null){
			return;
		}
		foreach($existedPath as $val){
			$d= dir($val);
			while(false !== ($file = $d->read()))
			{
				/* Reject parent, current directories and sub directories */
				if(($file == '.')  ||
				   ($file == '..') ||
				   (is_dir($d->path . $SLASH . $file)))
				{
					continue;
				}else{
					$mee= $val. $SLASH .$file;
					//echo $mee."Kunal<br>";
					include_once($mee);
				}
			}
		
		}
		
    } else {
        /* If a single file is specified */
        $importFile = str_replace(".", $SLASH, $classPath) . ".inc";
    	//echo "<br/>".$importFile."<br/>";
		$path=getMeClassName($importFile);
		//echo $path."<br>";
		include_once($path);
    }
}

function getMeClassName($filepath){
	global $ZIP_PROJECTS;
	global $SLASH;
	global $WORKSPACE_DIR ;
	$arr=explode(";",$ZIP_PROJECTS);
	foreach($arr as $val){
		$filename=$WORKSPACE_DIR.$SLASH.$val.$SLASH.$filepath;
		//echo "<br/>".$filename."<br/>";
		if(!@file_exists($filename) ) {
			//echo $filename . " does not exists<br>";
		}else{
			return $filename;
		}
	}
	return null;
}
function getMeDirectoryBunch($filepath){
	global $ZIP_PROJECTS;
	global $SLASH;
	global $WORKSPACE_DIR ;
	$arr=explode(";",$ZIP_PROJECTS);
	$newArr=array();
	foreach($arr as $val){
		$filename=$WORKSPACE_DIR.$SLASH.$val.$SLASH.$filepath;
		//echo "<br/>".$filename."<br/>";
		if(!@file_exists($filename) ) {
			//echo $filename . " does not exists<br>";
		}else{
			$newArr[]=$filename;
		}
	}
	return $newArr;
}

function importLib($libName,$fileName)
{	
 global $WORKSPACE_DIR;
 global $OS;
 global $SLASH;
 global $THIRDPARTY_DIR;
 $path =$WORKSPACE_DIR . $THIRDPARTY_DIR . DIRECTORY_SEPARATOR . $libName. DIRECTORY_SEPARATOR .$fileName;
 //echo $path;
 include_once ($path );
}


function include_smvc_file($moduleName,$filePath){
	if(class_exists(ModuleLoader)){
		$moduleLoader=ModuleLoader::getInstance();
		if($moduleLoader->isModulePresent($moduleName)){
			$module=$moduleLoader->getModuleByModuleName($moduleName);
			//echo $module->getModulePath().$filePath;
			include_once $module->getModulePath().$filePath;
			return;
		}
	}
	include_once $filePath;
}

function include_smvc_css($moduleName,$fileArray){
	global $cssPathArray;
		
	if(class_exists(ModuleLoader)){
		$moduleLoader=ModuleLoader::getInstance();
		if($moduleLoader->isModulePresent($moduleName)){
			$module=$moduleLoader->getModuleByModuleName($moduleName);
			$moduleURL=$module->getModuleURL()."/";

		}
	}
	foreach ($fileArray as $k=>$v) {
		if(isset($cssPathArray[$k]))continue;
		$cssPathArray[$k]=$k;
        echo "<link rel='stylesheet' href='".$moduleURL."styles/".$v."'/>\r\n";
    }
}

function getModuleURI($moduleName){
    if(class_exists(ModuleLoader)){
            $moduleLoader=ModuleLoader::getInstance();
            if($moduleLoader->isModulePresent($moduleName)){
                    $module=$moduleLoader->getModuleByModuleName($moduleName);
                    $moduleURL=$module->getModuleURL()."/";
                    return $moduleURL;
            }
    }
    return "";
}

function include_smvc_js($moduleName,$fileArray){
	global $jsPathArray;
	if(class_exists(ModuleLoader)){
		$moduleLoader=ModuleLoader::getInstance();
		if($moduleLoader->isModulePresent($moduleName)){
			$module=$moduleLoader->getModuleByModuleName($moduleName);
			$moduleURL=$module->getModuleURL()."/";

		}
	}
	foreach ($fileArray as $k=>$v) {
		if(isset($jsPathArray[$k]))continue;
		$jsPathArray[$k]=$k;
		echo "<script type='text/javascript' src='".$moduleURL."javascript/" . $v . "'></script>\r\n";
    }
}



?>