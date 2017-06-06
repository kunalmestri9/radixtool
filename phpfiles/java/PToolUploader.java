import java.io.*;
import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.httpclient.params.HttpMethodParams;

public class PToolUploader{
	private static String URL="";
	private static String FTYPE="";
	public static void uploadFiles(int count,String path,String originalFileName){
		int i;
		for(i=1;i<=count;i++){
			String fileName = path  + originalFileName +  "." + String.format("%03d",i);
			System.out.println("Uploading Part"+ i);
			uploadFile(originalFileName,fileName);
		}
	}
	
	public static void uploadFile(String originalFileName ,String fileName) {
		// Create an instance of HttpClient.
		HttpClient client = new HttpClient();
		PutMethod method = new PutMethod(URL);
		try {
			method.setRequestBody(new FileInputStream(fileName));
		}catch (FileNotFoundException e) {
			System.err.println("Fatal Error" + e.getMessage());
			return;
		}
        // Provide custom retry handler is necessary
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,new DefaultHttpMethodRetryHandler(3, false));
		
		method.addRequestHeader("ftype",FTYPE);
		method.addRequestHeader("filename",originalFileName);
		
		try {
		  // Execute the method.
		  
		  int statusCode = client.executeMethod(method);
		  if (statusCode != HttpStatus.SC_OK) {
				System.err.println("Method failed: " + method.getStatusLine());
		  }
		  // Read the response body.
		  byte[] responseBody = method.getResponseBody();
		  // Deal with the response.
		  // Use caution: ensure correct character encoding and is not binary data
		  System.out.println(new String(responseBody));

		} catch (HttpException e) {
			System.err.println("Fatal protocol violation: " + e.getMessage());
			e.printStackTrace();
		} catch (IOException e) {
			System.err.println("Fatal transport error: " + e.getMessage());
			e.printStackTrace();
		} finally {
			// Release the connection.
			method.releaseConnection();
		}  
	}
	
	public static void main(String args[]) throws IOException{
		//uploadFile("Oriental.rar","Oriental.rar.002");
		String path="",fileName="",workspace="";
		
		if("elib".equals(args[2])){
			path="/elib/";
			fileName="elib.zip";
		}else if("eweb".equals(args[2])){
			path="/eweb/";
			fileName="eweb.zip";
		}
		
		String currentFilePath = new File("..").getCanonicalPath() ;
		System.out.println(currentFilePath);
		/*String fullFileName = workspace + path + fileName;
		int count=FileSplit.splitFile(new File(fullFileName));
		URL = "http://"+args[1]+"/manager/chunkaccept.php";
		FTYPE=args[3];
		uploadFiles(count,path,fileName);*/
	}

}