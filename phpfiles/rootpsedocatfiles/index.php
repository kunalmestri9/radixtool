<?php
function extractPsedocat($path){
	 $rootPath=$_SERVER['ROOTPATH'].$path;
	 $zip = new ZipArchive; 
	 $zip->open($rootPath."/pseudocat.zip"); 
	 $zip->extractTo($rootPath); 
	 $zip->close(); 
}
function deletePsedocatZip($path){
	 $rootPath=$_SERVER['ROOTPATH'].$path."/pseudocat.zip";
	 if($path==""){
		die("directoryName is empty");
	 }
	 unlink($rootPath);
}

if($_REQUEST["action"]=="extractpseudocat"){
	extractPsedocat($_REQUEST["directoryName"]);	
}else if($_REQUEST["action"]=="deletepseudocatzip"){
	deletePsedocatZip($_REQUEST["directoryName"]);	
} 
?>
