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
listFolderFiles('../lib'); 
?>
