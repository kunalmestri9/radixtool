<?php 
$url=$argv[1];
//echo $url;
exec("svn log -v $url --limit 2 ", $output);
//var_dump($output);
//echo "\n". $output[3];
function getMeTagName(&$arrTag,$skipParam){
	$i=(count($arrTag)-1-$skipParam);
	if((int)$arrTag[$i]==9){
		$arrTag[$i]=0;
		getMeTagName($arrTag,($skipParam+1));
	}else{
		$arrTag[$i]=$arrTag[$i]+1;
	}

}
if(strpos($output[3],"tags")!== false){
	$varUrl=explode(" ",$output[3]);
	$tagName=end(explode("/",$varUrl[4]));
	if(isset($argv[2]) && "getLatestTag"==$argv[2]){
		echo $tagName;
		exit;
	}
	if(strpos($tagName,".")!== false){
		$arrTag=explode(".",$tagName);
		
		$i=end($arrTag);
		getMeTagName($arrTag,0);
		$tagName=implode(".",$arrTag);
	}else{
		$tagName=((int)$tagName+ 1);
	}
	echo $tagName;
}else{
	/*echo "This seems to be the first tag ? Do you want to create it? yes or no ";
	$handle = fopen ("php://stdin","r");
	$line = fgets($handle);
	if(trim($line) != 'yes'){
		echo "ABORTING!\n";
		exit;
	}
	echo "\n";
	echo "Please enter new Tag Version \n";
	$line = fgets($handle);
	echo "Thank you for creating tag :".$line;*/
	echo "FIRST_TAG";
}
?>