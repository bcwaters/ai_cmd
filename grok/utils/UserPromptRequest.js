import fs from "fs/promises";

//Represents the prompt recieved from the user, with dynamic variables for tree mode
class UserPromptRequest {
    constructor(userPrompt, isShort, isNew, context, depth, filePath, specialty, treeMode, browserMode) {
        this.userPrompt = userPrompt?userPrompt:"";
        this.isShort = isShort;
        this.isNew = isNew;
        this.context = context?context:"";
        this.depth = depth;
        this.filePath = filePath;
        this.specialty = specialty;
        this.treeMode = treeMode;
        this.browserMode = browserMode;
        this.rootResponseId = "";
        this._dynamicPrompt = userPrompt;
        this._dynamicResponseId = "";
        this._childDirectory = "";
        this._currentSubject = "";
        this._branchList = [];
        this._branchIndex = 0;
    }

    get dynamicPrompt() {
        return this._dynamicPrompt;
    }

    set dynamicPrompt(value) {
        this._dynamicPrompt = value;
    }

    get dynamicResponseId() {
        return this._dynamicResponseId;
    }

    set dynamicResponseId(value) {
        this._dynamicResponseId = value;
    }
    
    
    get childDirectory() {
        return this._childDirectory;
    }

    set childDirectory(value) {
        this._childDirectory = value;
    }
    
    get currentSubject() {
        return this._currentSubject;
    }

    set currentSubject(value) {
        this._currentSubject = value;
    }

    get branchList() {
        return this._branchList;
    }

    set branchList(value) {
        this._branchList = value;
    }

    get branchIndex() {
        return this._branchIndex;
    }

    set branchIndex(value) {
        this._branchIndex = value;
    }


    async fileContent() {
        // load filepaths from userPromptRequest.filePath
        // determine if the file is a directory or a file
        let fileContent = "";
        
        if(this.filePath == ""){
            return "";
        }
        
        try {
            // Use stat with await instead of callback
            const stats = await fs.stat(this.filePath);
            
            if(stats.isDirectory()){
                // load the files in the directory
                const files = await fs.readdir(this.filePath);
                for(let file of files){
                    // Use path.join to create proper file paths
                    const fullPath = `${this.filePath}/${file}`;
                    try {
                        // Check if it's a file before reading
                        const fileStats = await fs.stat(fullPath);
                        if(fileStats.isFile()) {
                            const content = await fs.readFile(fullPath, "utf8");
                            fileContent += content + "\n";
                        }
                    } catch(err) {
                        console.error(`Error reading file ${fullPath}:`, err);
                    }
                }
            } else {
                // load the file
                fileContent = await fs.readFile(this.filePath, "utf8");
            }
            return fileContent;
        } catch(err) {
            console.error(`Error accessing path ${this.filePath}:`, err);
            return "";
        }
    }



    toString(){
        return JSON.stringify(this);
    }

}



export default UserPromptRequest;