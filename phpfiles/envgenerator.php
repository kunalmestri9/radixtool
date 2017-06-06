<?php
$fullPath=realpath($argv[1].$argv[2] );
if(!file_exists("$fullPath". DIRECTORY_SEPARATOR ."env.ini")){
	echo "It seems you haven't included env.ini file";
}else{
	$sections=parse_ini_file("$fullPath". DIRECTORY_SEPARATOR ."env.ini",true);
	$array=$sections[$argv[3]];
	echo $fullPath.DIRECTORY_SEPARATOR."env";
	foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($fullPath.DIRECTORY_SEPARATOR."env")) as $filename){
			$file=explode(DIRECTORY_SEPARATOR,$filename);
			if(end($file)=="." || end($file)=="..")continue;
			$str=file_get_contents($filename);
			foreach($array as $key=>$val){
				$str=str_replace("@@@"."$key"."@@@", "$val",$str);
			}
			file_put_contents($filename, $str);
	}
}
?>
