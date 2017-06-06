<?php
if (!function_exists('getallheaders')) { 
    function getallheaders() 
    { 
       $headers = ''; 
        foreach ($_SERVER as $name => $value) 
        { 
            if (substr($name, 0, 5) == 'HTTP_') 
            { 
                $headers[str_replace(' ', '-', strtolower(str_replace('_', ' ', substr($name, 5))))] = $value; 
            } 
        } 
         return $headers; 
    } 
}
function getHeaderValue(/*String*/ $headerName){
         
        $headers=getallheaders();
        return ($headers[$headerName]!=null)?$headers[$headerName]:null ;
 }

 
 function appendFile($path, $streamHandle, $length) {
        
        $handle=fopen($path, 'a');
        if(!$handle){
           
            throw new FileException(FileException_SUBTYPE::UNKNOWN,"File Canot be created Please try again");
        }
        
        /* Read the data 1 KB at a time and write to the file */
        while ($data = fread($streamHandle, $length))
          fwrite($handle, $data);

        /* Close the streams */
        fclose($handle);
        fclose($streamHandle);

    }
if(getHeaderValue("ftype")=="elib"){
	$uploaddir = realpath('../lib') . '/';
}else{
	$uploaddir = realpath('../app') . '/';
}
$uploadfile = $uploaddir . getHeaderValue('filename');
$length=getHeaderValue("Content-Length");
 $streamHandle= fopen("php://input", "r");
 appendFile($uploadfile, $streamHandle,$length);
	
?>