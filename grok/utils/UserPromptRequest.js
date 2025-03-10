import fs from "fs/promises";

//Represents the prompt recieved from the user, with dynamic variables for tree mode
//TODO: find a btter way to represent the modes
class   UserPromptRequest {
    constructor(userPrompt, isShort, isNew, context, depth, filePath, specialty, treeMode, browserMode, codeReviewMode, baseContextDirectory, visionMode, visionModeDirectory) {
        this.userPrompt = userPrompt?userPrompt:"";
        this.isShort = isShort;
        this.isNew = isNew;
        this.context = context?context:"";
        this.depth = depth;
        this.filePath = filePath;
        this.specialty = specialty;
        this.treeMode = treeMode;
        this._baseContextDirectory = baseContextDirectory;
        this.browserMode = browserMode;
        this.rootResponseId = "";
        this.codeReviewMode = codeReviewMode;
        this._dynamicPrompt = this.userPrompt;
        this._dynamicResponseId = "";
        this._childDirectory = "";
        this._currentSubject = "";
        this._branchList = [];
        this._branchIndex = 0;
        this._visionMode = visionMode;
        this._visionModeDirectory = visionModeDirectory;
    }

    get baseContextDirectory() {
        return this._baseContextDirectory;
    }

    set baseContextDirectory(value){
        this._baseContextDirectory= value;
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

    get visionMode() {
        return this._visionMode;
    }

    set visionMode(value) {
        this._visionMode = value;
    }

    get visionModeDirectory() {
        return this._visionModeDirectory;
    }
    
    

    toString(){
        return JSON.stringify(this);
    }

}



export default UserPromptRequest;