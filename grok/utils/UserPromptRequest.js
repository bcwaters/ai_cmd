//Represents the prompt recieved from the user, with dynamic variables for tree mode
class UserPromptRequest {
    constructor(userPrompt, isShort, isNew, setContext, depth, filePath, specialty, treeMode, browserMode) {
        this.userPrompt = userPrompt;
        this.isShort = isShort;
        this.isNew = isNew;
        this.setContext = setContext;
        this.depth = depth;
        this.filePath = filePath;
        this.specialty = specialty;
        this.treeMode = treeMode;
        this.browserMode = browserMode;
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

    toString(){
        return JSON.stringify(this);
    }

}



export default UserPromptRequest;