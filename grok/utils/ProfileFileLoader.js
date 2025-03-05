import fs from "fs/promises";
import path from "path";
import terminal from "./terminal.js";


//This class supports profiles by encapsulating the loading of files
//It returns an easy to process object for prompt generation
class ProfileFileLoader {
    static debugLogger = true;
    constructor() {
     
    }

    //TODO refine this to use extensions... or something because this gets false positives
   static async isTextFile(filePath) {
        try {
            // Read a small chunk of the file (first 4KB is usually enough)
            const fileHandle = await fs.open(filePath, 'r');
            const buffer = Buffer.alloc(4096);
            const { bytesRead } = await fileHandle.read(buffer, 0, 4096, 0);
            await fileHandle.close();
            
            if (bytesRead === 0) return true; // Empty files are considered text
            
            // Check for NULL bytes and high ASCII/control chars which indicate binary
            for (let i = 0; i < bytesRead; i++) {
                const byte = buffer[i];
                // NULL bytes or too many non-ASCII chars indicate binary
                if (byte === 0) return false;
            }
            
            // Calculate ratio of printable to non-printable characters
            let printable = 0;
            let nonPrintable = 0;
            
            for (let i = 0; i < bytesRead; i++) {
                const byte = buffer[i];
                // Consider typical printable ASCII range and common control chars
                if ((byte >= 32 && byte <= 126) || // Printable ASCII
                    byte === 9 || byte === 10 || byte === 13) { // Tab, LF, CR
                    printable++;
                } else {
                    nonPrintable++;
                }
            }
            
            // If more than 30% non-printable, likely binary
            return (nonPrintable / bytesRead) < 0.3;
        } catch (err) {
            console.error(`Error checking if ${filePath} is text:`, err);
            return false; // Assume binary on error
        }
    }

//recieves a path or directory and returns the content of the file or files
  static async loadFileContent(filePath) {
        // load filepaths from userPromptRequest.filePath
        // determine if the file is a directory or a file
        let files = [];
        terminal.log("Loading file content from: " + filePath);
        let fileContent = "";
        
        if(filePath == ""){
            return "";
        }
        
        // Ensure filePath is a string
        if (typeof filePath !== 'string') {
            console.error("Error: filePath must be a string, received:", typeof filePath);
            return "";
        }
        
        try {
            // Use stat with await instead of callback
            const stats = await fs.stat(filePath);
            
            if(stats.isDirectory()){
                terminal.log("Loading files from directory: " + filePath);
                // load the files in the directory
                const dirFiles = await fs.readdir(filePath);
                for(let file of dirFiles){
                    // Use path.join to create proper file paths
                    const fullPath = path.join(filePath, file);
                    try {
                        // Check if it's a file before reading
                        const fileStats = await fs.stat(fullPath);
                        const isTextFile = await this.isTextFile(fullPath);
                        terminal.log("File is text: " + isTextFile);
                        terminal.log("File is file: " + fileStats.isFile());
                        if(fileStats.isFile() ) {
                            //get file name
                            const fileName = path.basename(fullPath);
                            const content = await fs.readFile(fullPath, "utf8");
                            files.push({fileName: fileName, content: content});
                            fileContent += content + "\n";
                            terminal.log("File content: " + content);
                        }
                    } catch(err) {
                        console.error(`Error reading file ${fullPath}:`, err);
                    }
                }
            } else {
                // load the file
                fileContent = await fs.readFile(filePath, "utf8");
                files.push({fileName: path.basename(filePath), content: fileContent});
            }
            return files;
        } catch(err) {
            console.error(`Error accessing path ${filePath}:`, err);
            return "";
        }
    }



}

export default ProfileFileLoader;