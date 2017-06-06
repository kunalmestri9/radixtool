

import java.io.*;
public class FileSplit {

   public static int splitFile(File f) throws IOException {
        int partCounter = 1;
		int sizeOfFiles = 1024 * 1024;// 1MB
        byte[] buffer = new byte[sizeOfFiles];
		BufferedInputStream bis = new BufferedInputStream(new FileInputStream(f));
		try {
            String name = f.getName();
            int tmp = 0;
            while ((tmp = bis.read(buffer)) > 0) {
                //write each chunk of data into separate file with different number in name
                File newFile = new File(f.getParent(), name + "."
                        + String.format("%03d", partCounter++));
                FileOutputStream out = new FileOutputStream(newFile);
                out.write(buffer, 0, tmp);
				out.close();
            }
        }catch(IOException ex){
			throw ex;
		}finally{
			bis.close();
		}
		return --partCounter;
    }
	/*
	
	public static void mergeFile(String directoryName) throws IOException {
        File originalFile = new File(directoryName);
		int totalChunkSize=0;
		int i;
		FileOutputStream out=null;
		out = new FileOutputStream(originalFile); 
		int sizeOfFiles = 1024 * 1024;// 1MB
        
		for(i=1;i<=91;i++){
				String name = directoryName  + "." + String.format("%03d",i);
				System.out.println(name);
				File newFile = new File(name);
				 try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(newFile))){
				 byte[] buffer = new byte[sizeOfFiles];
				 int tmp = 0;
				 while ((tmp = bis.read(buffer)) > 0) {
					//write each chunk of data into separate file with different number in name
					System.out.println(buffer + " " +totalChunkSize+ " " + tmp);
						out.write(buffer, 0, tmp);//tmp is chunk size
						totalChunkSize+=tmp;
					
				 }	
				
			}
		}
        
    }*/

    public static void main(String[] args) throws IOException {
        splitFile(new File("E:\\sali\\Arti mhaskar_1.avi"));
		//mergeFile("D:\\Test\\T\\Oriental.rar");
    }
}