<?php
session_start();
error_reporting(E_ERROR | E_PARSE);
include_once($_SERVER["WORKSPACE_PATH"].$_SERVER["THIRDPARTIES_DIR"].$_SERVER["LOG4PHP_DIR"].'Logger.php');
$loggerController = Logger::getLogger("Controller");
Logger::configure($_SERVER["APPLICATION_PATH"].'cfg'. DIRECTORY_SEPARATOR .'log4php_config.xml');
$loggerController->info("Controller Involked");
$IMPORT_FILE_PATH=$_SERVER["WORKSPACE_PEAR_PATH"]."import.inc";
include_once $IMPORT_FILE_PATH;
?>
