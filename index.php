<?php
function listFolderFiles($dir,$exclude=null){ 
    $ffs = scandir($dir); 
    foreach($ffs as $ff){ 
          $arr=explode(".",$ff);
		  if(end($arr)=="zip"){
			  echo $ff. "<br>";
		  }
    }  
} 
function xtractFolderFiles($dir,$dir2,$exclude=null){ 
    $ffs = scandir($dir); 
    foreach($ffs as $ff){ 
          $arr=explode(".",$ff);
		  if(end($arr)=="zip"){
			 $zip = new ZipArchive; 
			 $fileName=$dir."/".$ff;
			 echo $fileName;
			 $zip->open($fileName); 
			 $zip->extractTo($dir2); 
			 $zip->close(); 
		  }
    }  
} 
function xtractewebs($dir,$dir2,$exclude=null){ 
    $ffs = scandir($dir); 
    foreach($ffs as $ff){ 
          $arr=explode(".",$ff);
		  if(end($arr)=="zip"){
			 $zip = new ZipArchive; 
			 $fileName=$dir."/".$ff;
			 echo $fileName;
			 $zip->open($fileName); 
			 $zip->extractTo($dir2.$arr[0]); 
			 $zip->close(); 
		  }
    }  
} 
listFolderFiles('../lib'); 
?>
<?php 
    if($_REQUEST["action"]=="xracttelib"){
		xtractFolderFiles('../lib','../lib');	
	}
	else if($_REQUEST["action"]=="update"){
		xtractFolderFiles('../lib','../_pseudobin/');	
	}
	else if($_REQUEST["action"]=="deleteelib"){
		unlink('../lib/elib.zip');	
	}else if($_REQUEST["action"]=="xractteweb"){
		xtractFolderFiles('../app','../app/');	
	}else if($_REQUEST["action"]=="updateweb"){
		xtractewebs('../app','../app/');	
	}else if($_REQUEST["action"]=="deleteweb"){
		unlink('../app/eweb.zip');	
	}	
?>
