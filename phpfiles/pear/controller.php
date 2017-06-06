<?php
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){
exit();
}

session_start();
error_reporting(E_ERROR | E_PARSE);
$postdata=file_get_contents("php://input");
$reqData=json_decode($postdata);
if($reqData && count($reqData)>0){
foreach($reqData as $k=>$v){
	$_REQUEST[$k]=$v;
}
}
include_once($_SERVER["WORKSPACE_PATH"].$_SERVER["THIRDPARTIES_DIR"].$_SERVER["LOG4PHP_DIR"].'Logger.php');
$loggerController = Logger::getLogger("Controller");
Logger::configure($_SERVER["APPLICATION_PATH"].'cfg'. DIRECTORY_SEPARATOR .'log4php_config.xml');
$loggerController->info("Controller Involked");
$IMPORT_FILE_PATH=$_SERVER["WORKSPACE_PEAR_PATH"]."import.inc";
include_once $IMPORT_FILE_PATH;

//Creating Request Wrapper 
import("com.laurus.core.http.HttpRequest");
import("com.laurus.core.util.*");
import("com.laurus.core.services.BootStrapLoader");
$bootStrap= new	BootStrapLoader();
$bootStrap->init();
//Steps to start the controller
//1. Import the controller.. you can extend it for any other specific implmentation
import("com.laurus.core.controller.Controller");
//2.import Any specific ModelConfig
import("com.laurus.core.modelconfig.ModelConfig");
//3. Get the instance of ModelConfig's child
$modelConfig=ModelConfig::getInstance();
//4. Get the instance of the controller
$controller=Controller::getInstance();
//5. Set the config to controller
$controller->setCommandConfig($modelConfig);
//6.Ask the controller to execute the related tasks
$controller->execute();
?>
