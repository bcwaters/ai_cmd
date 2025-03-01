//Node
import fs from 'fs/promises'
import { join } from 'path';
import os from 'os'
import {exec} from 'child_process'         //use exec to run commands like open browser

//NPM packages
import OpenAI from "openai";               //use openai spec
import dotenv from "dotenv"                //use dotenv to load environment variables
import {marked} from 'marked';             //use marked to convert markdown to html
import { JSDOM } from 'jsdom';             //use jsdom to create a DOM object
import createDOMPurify from 'dompurify';   //use dompurify to sanitize the html

//Local packages
import {PromptProfile} from './prompt_profiles/default';
import {TreeModeProfile} from './prompt_profiles/TreeMode';
import UserPromptRequest from './utils/UserPromptRequest.js';
import terminal from './utils/terminal.js'; 
import {cleanString, sleep } from './utils/utils.js';



//Configuration before main -------------------------------
dotenv.config();

// Initialize DOMPurify with JSDOM
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


//grok-2-vision-1212
//TODO this does not have to be hardcoded to grok
const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

//End Configuration before main -------------------------------

// Parse command line arguments and return prompt and flags
function parseCommandLineArgs() {
   
    terminal.debugLogger = true;
    const args = process.argv.slice(2);

    let userPrompt = "Default prompt if none provided";
    let depth = 500;
    let isNew = false;
    let setContext = "";
    let filePath = "";
    let isShort = false;
    let specialty = "";
    let treeMode = false;
    let terminalMode = false;
    let browserMode = true;

    if (args.includes("--treeMode")) {
        treeMode = true;
    }
    if (args.includes("terminalMode")) {
        terminal.debugLogger = false;
        browserMode = false;
    }
    //TODO update specialty to be named role here and in shell script
    if (args.includes("--specialty")) {
        const specialtyIndex = args.indexOf("--specialty") + 1;
        if (specialtyIndex < args.length) {
            specialty = args[specialtyIndex]; //TODO: this should be a sentence and then passed to the profile... does a "sentence in quotes" work as one argument?
        }
    }

    if (args.includes("--depth")) {
      
        const depthIndex = args.indexOf("--depth") + 1;
        if (depthIndex < args.length) {
            depth = args[depthIndex];
        }
    } 
    if (args.includes("--file")) {
        const filePathIndex = args.indexOf("--file") + 1;
        if (filePathIndex < args.length) {
            filePath = args[filePathIndex];
        }
    }
   
    if (args.includes("--new")) {
        isNew = true;

    }  if (args.includes("--setContext")) {
        const contextIndex = args.indexOf("--setContext") + 1;
     
        if (contextIndex < args.length) {
            setContext = args[contextIndex];
            if (contextIndex + 1 < args.length) {
                userPrompt = args.slice(contextIndex + 1).join(" ");
            }
        }
    } else if (args.length > 0) {
        userPrompt = args.join(" ");
    }

    let indexOfPrompt = args.indexOf("PROMPT");
    if (indexOfPrompt != -1) {
        userPrompt = args[indexOfPrompt + 1];
    }

    //TODO this should be a RAG_PROFILE_STATE class with all the properties.
    return new UserPromptRequest(userPrompt, isShort, isNew, setContext, depth, filePath, specialty, treeMode , browserMode);
}

//TODO move to utils


// Read and parse the context file
async function getConversationContext(setContext, isNew) {
    try {
        //console.log(colors.green, "setContext", setContext, colors.reset);
        //TODO FIX CONTEXT HSITRY for new flag
        if (setContext == "") {
            const context = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
            const parsedContext = JSON.parse(context);
           
            const messages = parsedContext.choices[0]
            //console.log(colors.green, "parsedContext", messages.message.content, colors.reset);
            let messageContent = messages.message.content;
        
            messageContent = cleanString(messageContent);
   
            return messageContent || "Error returning context";
        } else {
      
            const context = await fs.readFile('./grok/context/history/' + setContext + '.json', "utf8");
            const parsedContext = JSON.parse(context);
           
            const messages = parsedContext.choices[0]
            //console.log(colors.green, "parsedContextSET", messages.message.content, colors.reset);
            let messageContent = messages.message.content;
          
            messageContent = cleanString(messageContent);

            return messageContent || "Error returning context for " + setContext;
        }
    } catch (error) {
        console.error("Error reading or processing the context file:", error);
        return "";
    }
}

// Create the request object for the API
function createApiRequest(userPrompt, priorConverstation, isNew, isShort, contextData, setContext, filePath, specialty, processingRootNode) {
    let profile = "default";
    let messages = [];
    if (isShort) {
        profile = "short";
    }
    if (specialty) {
        PromptProfile.setSpecialty(specialty);
    }
  
    PromptProfile.isLogging = false;
    
    if(processingRootNode){
        messages = TreeModeProfile.getDefaultProfile(isNew, priorConverstation, contextData, userPrompt); // Load the array from the default file
    }else{
        messages = PromptProfile.getDefaultProfile(isNew, priorConverstation, contextData, userPrompt); // Load the array from the default file
    }
    
    terminal.debug(terminal.colors.green, "Prompt Sent to Grok", terminal.colors.reset, JSON.stringify(messages, null, 4));
  


    return {
        model: "grok-2-latest",
        messages: messages, // Use the loaded variable here
    };
}

async function parseCompletionForResponseAndMetaResponse(completion){

    let metaResponse = "";
    let markdownContent = "";
    const content = completion.choices[0].message.content.replace(/\\n/g, '\n');
    terminal.debug(terminal.colors.yellow, "\n\nunprocessed response", terminal.colors.green, content, terminal.colors.reset);
   try{
     [markdownContent, metaResponse] = content.split("@EOF@"); 
   }catch(error){
    terminal.log(terminal.colors.red, "error", terminal.colors.reset, error);
     [markdownContent, metaResponse] = ["## Heading 1\n\n## Heading 2\n\n## Heading 3\n\n", "@EOF[keywords,list,always]"];
   }

   try{
    metaResponse = metaResponse.replace("@EOF@", "");
    if (metaResponse.length < 1){
 
        throw new Error("AI_CMD repsonded without the @EOF@ tag");
    }
   }catch(error){
    
    terminal.log(terminal.colors.red, "AI)CMD repsonded without the @EOF@ tag", terminal.colors.reset, error);
   }

       return {metaResponse, markdownContent};
}

// Save response to files
/*
  completion is the response from the api
  userPrompt is the prompt that was sent to the api
  responseId is the id of the response
  contextHistoryLength is the length of the context history
  depth is the depth of the context
*/

function htmlReplaceTemplateValues(html_string, sanitizedMarkdownContent, priorContextId, responseId){
    //TODO ParentID technically is null here, there needs to be inheritance form a prompt class for a default value
    html_string = html_string.replaceAll("@PARENT_ID@", TreeModeProfile.ParentId) //NICE THIS IS STATIC AND AVAIALBLE!
    .replaceAll("REPLACEME", sanitizedMarkdownContent)
    .replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, 8)) //TODO is this substring redundant?
    .replaceAll("@DIRECTORY@", "") // absolute path to the directory not compatible with firefox
    .replaceAll("@CURRENT_ID@", responseId);

    //TODO return can be done without variable assignment if no other processing is needed.
    return html_string;
}

//TODO i should open up threads for CHILD WRITES
async function  saveHtmlResponse(userPromptRequest, markdownContent, priorContextId) {
    //let pwd = process.cwd();
    //console.log("pwd", pwd);
    // Save HTML response for parent of treaMode of default prompt
    let indexHtml = await fs.readFile('./grok/template.html', "utf8");
    markdownContent =  markdownContent + "\n\nResponseID:" + userPromptRequest.dynamicResponseId ;
    let sanitizedMarkdownContent = preprocessResponse(markdownContent);

    indexHtml = htmlReplaceTemplateValues(indexHtml, sanitizedMarkdownContent, priorContextId, userPromptRequest.dynamicResponseId);


    //If it is treeMode then the children are created here.
    if(userPromptRequest.childDirectory != ""){
        let childHtml = await fs.readFile('./grok/child_template.html', "utf8");
        
        childHtml = htmlReplaceTemplateValues(childHtml, sanitizedMarkdownContent, priorContextId, userPromptRequest.dynamicResponseId);
        //TODO ponder the trade offs of using HTML here instead of the markdown.
        TreeModeProfile.addChildReadme(sanitizedMarkdownContent);
    
        console.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset);
        console.log("childDirectory being written to", userPromptRequest.childDirectory);
        console.log(terminal.colors.red,terminal.logDivider, terminal. colors.reset );
        await fs.writeFile(
            `./grok/context/history/responses/${userPromptRequest.rootResponseId}/tree/${userPromptRequest.childDirectory}/${userPromptRequest.dynamicResponseId}.html`,
            childHtml,
            "utf8"
        );
    }else{
        //IF this is treemode but no child is written log that the parent summary page was written
        if(userPromptRequest.treeMode){
            console.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset);
            console.log("this is a parent write:", userPromptRequest.rootResponseId);
            console.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset );
        }
    }//if child directory and not a parent do nothing
       
    // Obfucscated logic to create the directory structure before writing the file, do so before methd call.
    // Create the directory structure before writing the file
    //this only has to be called once
    await fs.mkdir(`./grok/context/history/responses/${userPromptRequest.rootResponseId}/html`, { recursive: true });

    //UPDATE writer class path here
    await fs.writeFile(   
        `./grok/context/history/responses/${userPromptRequest.rootResponseId}/html/${userPromptRequest.dynamicResponseId}.html`,
            indexHtml,
            "utf8"
    );
    
    await fs.writeFile(
        `./grok/context/currentChat/currentChat.html`,
        indexHtml,
        "utf8"
    );

}

async function saveMarkdownResponse(userPromptRequest, markdownContent) {
    terminal.debug(terminal.logDivider);
    terminal.debug(terminal.colors.green, "markdownContent\n",terminal.colors.reset, markdownContent);
    terminal.debug(terminal.logDivider);
    await fs.mkdir(`./grok/context/history/responses/${userPromptRequest.rootResponseId}/markdown`, { recursive: true });
    // Save markdown response
    await fs.writeFile(
        `./grok/context/history/responses/${userPromptRequest.rootResponseId}/markdown/${userPromptRequest.dynamicResponseId}.md`,
        markdownContent,
        "utf8"
    );

    await fs.writeFile(
        `./grok/context/currentChat/currentChat.md`,
        markdownContent,
        "utf8"
    );
    
}

function preprocessResponse(response) {
    // response = response
    //     .replace(/\\/g, '\\\\') // Escape backslashes
    //     .replace(/"/g, '\\"')   // Escape double quotes
    //     .replace(/'/g, "\\'")   // Escape single quotes
    //     .replace(/\n/g, '\\n')   // Escape newlines
    //     .replace(/&/g, '&amp;') // Escape ampersands
    //     .replace(/\r/g, '')     // Remove carriage returns
    //     .replace(/\s+/g, ' ');  // Replace multiple whitespace with a single space

    // TODO is this breaking the README because of script tags? Sanitize the response using DOMPurify if available
    if (DOMPurify) {
        response = DOMPurify.sanitize(response);
    }
    
    // Use marked to parse the response if available
    if (marked) {
        response = marked.parse(response);
    }
    
    while(response.charAt(0) != "<"){
        response = response.substring(1);
    }
    return response;
}


async function appendToContext(newContent, MAX_CONTEXT_LENGTH) {
    if (typeof newContent !== 'string') {
        terminal.error("AI_CMD answered but forgot to include include the proper format! PROMPT AGAIN it should work", newContent);
        return; // Exit the function if newContent is invalid
    }
    
    
    let contextData = await fs.readFile("./grok/context/context.data", "utf8");
    newContent = newContent.replaceAll("[", "").replaceAll("]", "");
    let newContextDataKeywords = newContent.split(",");
    newContextDataKeywords.forEach(element => {
        contextData = contextData.replaceAll(element, "");
    });
    contextData = contextData.replaceAll(" ", "");
    contextData = contextData.replaceAll(",","");
    contextData =  newContent + contextData;
    contextData = contextData.replaceAll("KEYWORDS", "");
 
    //CONTEXT can be improved by having separate lists. one is composed of Headings. another is keywords.
    contextData = contextData.substring(0, MAX_CONTEXT_LENGTH);

    //utils helper function 
    contextData = contextData
    .replaceAll(/\\n/g, '')
    .replaceAll(/\\/g, '')
    .replaceAll(/"/g, '')
    .replaceAll(/'/g, "")
    .replaceAll(/\n/g, '')
    .replaceAll(/` `/g, '')
    .replaceAll("[", "")
    .replaceAll("]", "");

    terminal.debug(terminal.logDivider);
    terminal.debug(terminal.colors.green, "Current Subject:",terminal.colors.reset, newContent);
    terminal.debug(terminal.logDivider);
    terminal.debug(terminal.colors.green, "Current Context[",MAX_CONTEXT_LENGTH,"]:",terminal.colors.reset, contextData);
    terminal.debug(terminal.logDivider);
    await fs.writeFile("./grok/context/context.data", contextData);


}

async function savePreviousId(responseId, userPrompt, contextHistoryLength){
    let previousId = await fs.readFile("./grok/context/context.history", "utf8");
    let parsedPreviousId = JSON.parse(previousId);
    parsedPreviousId.push({id: responseId, prompt: userPrompt});
    await fs.writeFile("./grok/context/context.history", JSON.stringify(parsedPreviousId));
    terminal.log(terminal.colors.green, "\nSwitch context to id to resume conversation", terminal.colors.reset);

    terminal.log(terminal.logDivider);
    

    // Log only the last 3 context entries
    const EntriesToLog = parsedPreviousId.slice(contextHistoryLength);
    for(let i = 0; i < EntriesToLog.length && i < 5; i++){
        terminal.log(terminal.colors.green, "contextId:", terminal.colors.reset, EntriesToLog[i].id,  terminal.colors.yellow, "\n Prompt:\n",terminal.colors.reset, EntriesToLog[i].prompt);
        terminal.log(terminal.colors.yellow, "             - - - - - - - - - - - - - - - - - - - - -           ", terminal.colors.reset);
    }
    terminal.log(terminal.colors.yellow, terminal.getDividerWithMessage("PRIOR-PROMPTS"));
    return parsedPreviousId;
}


//There should be only 2 places for all mds json and html files.
//1. context/currentChat/
//2. context/history/

//TODO THERE COULD BE FAULTY LOGIC HERE. a child is saved to currentChat in treeMode for the last response
//A recursive apporach should remedy this so parent is written last.
async function saveCompletion(completion, responseId){
    //overwrites the old file
    await fs.writeFile(`./grok/context/currentChat/currentChat.json`, JSON.stringify(completion));
    await fs.writeFile(`./grok/context/history/fullCompletion/${responseId}.json`, JSON.stringify(completion));
    return responseId;
}

//TODO THIS CAN BE OPTIMIXED examine the user prompt context and load the prior context id from a string
async function obtainPriorContextId() {
    let oldContextFile = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
    let parsedContext = JSON.parse(oldContextFile);
    let parsedContextId = parsedContext.id.substring(0, 8);

    return parsedContextId;
}

// Main function
async function main() {
    //RAG_PROFILE_STATE class needs to be made before this bloats beyond repair
    const userPromptRequest = parseCommandLineArgs();
 
    //This keeps the loop going for treeMode
    let morePrompts = true;
    //This logic is seperate from the promptState because it relates to loop state
    let processingRootNode = userPromptRequest.treeMode;

    while( morePrompts == true){
         //TODO in order to add depth I will need to simulate the command line arguments.
         // Simulate command line arguments userPrompt, isShort, isNew, setContext, depth ,filePath, specialty, treeMode
         // for now context can remain the same.  
         // Later a branch profile can be called for the api call.
         if( userPromptRequest.treeMode && userPromptRequest.branchIndex >= 1){
           
            userPromptRequest.currentSubject = userPromptRequest.branchList[userPromptRequest.branchIndex-1]
          
            userPromptRequest.dynamicPrompt = "Tell me more about item " + userPromptRequest.branchIndex + " of this list.  Go into more detail about info you already included.: "  + userPromptRequest.branchList[userPromptRequest.branchIndex-1];
            await sleep(1000); // Replaced sleep with wait to avoid overwhelming the API.
            terminal.log(terminal.colors.green, "User Prompt", terminal.colors.reset, userPromptRequest.dynamicPrompt);
            terminal.log(terminal.colors.green, "Branch List", terminal.colors.reset, userPromptRequest.branchList);
            terminal.log(terminal.colors.green, "Branch Index", terminal.colors.reset, userPromptRequest.branchIndex);
            //TODO perhaps this should use the getter and setters...
            userPromptRequest.branchIndex--;
            
         }

         terminal.debug(terminal.colors.green, "User Prompt Request", terminal.colors.reset, userPromptRequest.toString());


    //TODO Load the previous propmt - there is probably a clever way to use previous id and load as much history as requested... add parent to context.history
    const priorConverstation = await getConversationContext(userPromptRequest.setContext, userPromptRequest.isNew); // Ensure context is fetched based on setContext
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");
  
 
    //Context is loadup for the api request
    let apiRequest = createApiRequest(userPromptRequest.dynamicPrompt, priorConverstation, userPromptRequest.isNew, userPromptRequest.isShort, contextData, userPromptRequest.setContext, userPromptRequest.filePath, userPromptRequest.specialty, processingRootNode);
    const completion = await openai.chat.completions.create(apiRequest);

    //TODO rename processingRootNode and move this logic into userPromptRequest as a process completion method
    if(userPromptRequest.treeMode){
        if(processingRootNode){//This is the first loop of treeMode
            userPromptRequest.rootResponseId = completion.id.substring(0, 8);
            userPromptRequest.dynamicResponseId = completion.id.substring(0, 8);
        }else{
            userPromptRequest.dynamicResponseId = completion.id.substring(0, 8);
        }
    }else{ // This is not treeMode
        userPromptRequest.rootResponseId = completion.id.substring(0, 8);
        userPromptRequest.dynamicResponseId = completion.id.substring(0, 8);
    }

    //STEP 2
    //TODO this is where the markdown and html are processed and stored in memory
    //parse readme now

    let treeModeList = "";
    let markdownResponse = "";
    let {metaResponse, markdownContent} = await parseCompletionForResponseAndMetaResponse(completion);
    terminal.debug(terminal.getDividerWithMessage("RESPONSE-AND-META-RESPONSE"));
    terminal.debug(terminal.colors.green, "metaResponse", terminal.colors.reset, metaResponse);
    terminal.debug(terminal.colors.green, "markdownContent", terminal.colors.reset, markdownContent);
    terminal.debug(terminal.logDivider);


    //STEP 3 now update the context for future prompts
    //let priorContextId = await saveContextFiles(userPromptRequest.dynamicResponseId, metaResponse, completion, markdownContent, userPromptRequest.depth);
    await appendToContext(metaResponse, userPromptRequest.depth);
    
    //TODO examine the best depth ratio for length. this should round down but be atleast 1
    let contextHistoryLength = userPromptRequest.depth/500;
    await savePreviousId(userPromptRequest.dynamicResponseId, userPromptRequest.dynamicPrompt, contextHistoryLength);
    
  
    //priorContextId is missing until completion is written.
    //Step 4 save the completion to currentChat.json and history/fullCompletion/responseId.json
    let priorContextId = await obtainPriorContextId();
    await saveCompletion(completion, userPromptRequest.dynamicResponseId);
    await saveHtmlResponse(userPromptRequest, markdownContent, priorContextId);
    await saveMarkdownResponse(userPromptRequest, userPromptRequest.dynamicResponseId, markdownContent);
        //consider whether or not to append response ID
    //ALL makr and html should be saved to the disk now


    treeModeList = metaResponse;
    markdownResponse = markdownContent; //unneceasary asignment
 
   //TODO name a bool for this   userPromptRequest.treeMode && !processingRootNode   
    terminal.log( "current contextId",   terminal.colors.blue, userPromptRequest.dynamicResponseId, terminal.colors.reset);
    terminal.log(terminal.colors.purple, "\nfile used:", terminal.colors.reset, userPromptRequest.filePath?userPromptRequest.filePath:"none");
    userPromptRequest.treeMode && !processingRootNode && terminal.log(terminal.colors.green, "Tree-"+ terminal.colors.reset, TreeModeProfile.ParentId, terminal.colors.green, "\nbranches"+terminal.colors.green+"["+userPromptRequest.branchList.length+"]-", userPromptRequest.branchList);
    terminal.log(terminal.logDivider);

    //TODO harded code price function should be dynamic for differnt models.
    const INPUT_TOKEN_PRICE = 200/1000000;
    const OUTPUT_TOKEN_PRICE = 1000/1000000;
    const totalPrice = (completion.usage.prompt_tokens * INPUT_TOKEN_PRICE) + (completion.usage.completion_tokens * OUTPUT_TOKEN_PRICE);
    terminal.log(terminal.colors.green, "Tokens used", terminal.colors.yellow, "prompt:", terminal.colors.reset, completion.usage.prompt_tokens, terminal.colors.yellow, "completion:", terminal.colors.reset, completion.usage.completion_tokens, terminal.colors.reset);
    terminal.log(terminal.colors.green, "Aprox price of prompt", terminal.colors.yellow, totalPrice, terminal.colors.reset, "cents ");
    //TODO ^^^in tree mode these values can be stored and added up
    terminal.log(terminal.logDivider);
    //write settings to ../.grokRuntimeterminal
    if(terminal.debugLogger == false){
        terminal.log(terminal.colors.green, "\nResponse", terminal.colors.reset, markdownResponse);
    }

    let terminalState = userPromptRequest.browserMode?"":"terminalMode";
    await fs.writeFile("./shell_helpers/.grokRuntime", `depthState=${userPromptRequest.depth}\nnewState=""\nsetContextState=${userPromptRequest.dynamicResponseId}\nterminalMode=${terminalState}`);
    
    //This is the first loop of treeMode
    if(processingRootNode){
        processingRootNode = false;
        userPromptRequest.branchList = TreeModeProfile.parseSubject(treeModeList);
        userPromptRequest.branchIndex = userPromptRequest.branchList.length;
        TreeModeProfile.setParentId(userPromptRequest.dynamicResponseId);
        TreeModeProfile.setParentReadme(markdownResponse);
        userPromptRequest.childDirectory = TreeModeProfile.ParentId+"_children";
        await fs.mkdir("./grok/context/history/responses/"+userPromptRequest.rootResponseId+"/tree/"+userPromptRequest.childDirectory+"/html", { recursive: true });
        
        terminal.log(terminal.colors.yellow, "\nParent ID", terminal.colors.reset, TreeModeProfile.ParentId);
        terminal.log(terminal.colors.blue, "Branches", terminal.colors.reset, userPromptRequest.branchList);
    }
   
    //TODO Optizmize this conditionallater. I might put at the top of the main while loop to flex... this is more readable though.
    //This index change is to fanagle the initial branch prompt to work.
    if(processingRootNode || userPromptRequest.branchIndex > 0){
        terminal.log(terminal.colors.blue, "parentId", terminal.colors.reset, TreeModeProfile.ParentId);
        terminal.log(terminal.colors.yellow, "branchId", terminal.colors.reset, userPromptRequest.dynamicResponseId);
        morePrompts = true;
    }else{
        terminal.log(terminal.colors.green, terminal.logDivider, terminal.colors.reset);
        terminal.log(terminal.colors.yellow, terminal.getDividerWithMessage("READ-RESPONSE-ABOVE"));
        terminal.log(terminal.colors.green, terminal.logDivider, terminal.colors.reset);
        morePrompts = false;

        //We are currently handling the bundling of tree mode children.
        if(userPromptRequest.treeMode){
        try{
                //TODO fix the saveHtmlResponse function to handle differnt typeps
                //REMOVE THIS AND RETURN STATIC FULL PAGE
                //await fs.copyFile("./grok/context/currentChat/currentChat.html", "./grok/context/history/responses/"+userPromptRequest.rootResponseId+"/"+userPromptRequest.childDirectory+"/"+userPromptRequest.dynamicResponseId+".html");
            
            let processedChildReadmes = [];
            //Is this a reference or a copy? 
            let allChildReadmes = TreeModeProfile.childReadme;
            let subjectList = TreeModeProfile.subjectList;
            terminal.debug(terminal.logDivider);
            terminal.debug(terminal.colors.green, "allChildReadmes", terminal.colors.reset, allChildReadmes);
            terminal.debug("------------Entering child loop------------");
            for(let i = 0; i < allChildReadmes.length; i++){
                let childReadme = allChildReadmes[i];
                // let childReadmeId = childReadme.contextId;   WOULD THIS BE USEFUL TO HAVE? perhaps in a more robust system.
                let childReadmeSubject = subjectList[i];
                
                let parsedReadme = marked.parse(childReadme);
                //MAYBE switch to aplha numeric ids 
                let childReadmeHtml = `<div id="childContent${i}">${parsedReadme}</div>`;
                
                terminal.debug(terminal.colors.green, "childReadmeHtml", terminal.colors.reset, childReadmeHtml);
                //TODO ordering wrong?
                processedChildReadmes.push(childReadmeHtml);
                //YIKES THIS NEEDS DOM MANIPULATION. No wonder react is so popular.
                //onclick set parent to hidden and child to visible. There needs to be a way to go back to parent.
                //this will need a fuzzy search in parent headings to properly link the child to the parent.
             
       
            }

            terminal.debug(terminal.colors.green, "allChildReadmes", terminal.colors.reset, allChildReadmes);
           

            terminal.debug("------------Exiting child loop------------");
            terminal.debug(terminal.logDivider);
            //combine all the child divs into a nice incomprehensiible html string
            terminal.debug(terminal.colors.green, "processedChildReadmes", terminal.colors.reset, processedChildReadmes);
            let childDivs = processedChildReadmes.join("");
            terminal.debug(terminal.colors.green, "childDivsComined", terminal.colors.reset, childDivs);
            
            terminal.debug(terminal.colors.green, "childDivs", terminal.colors.reset, childDivs);
            let parentHtml = await fs.readFile("./grok/parent_template.html", "utf8");

            //DO all the replacements
            parentHtml = parentHtml.replace("REPLACEME", marked.parse(TreeModeProfile.ParentReadme));
            parentHtml = parentHtml.replace("@REPLACEWITHCHILDRENDIVS@", childDivs);
            parentHtml = parentHtml.replace("@CURRENT_ID@", TreeModeProfile.ParentId);
            //parentHtml = parentHtml.replace("@PREVIOUS_ID@", dynamicResponseId);

            //I could name this more intelligently.
            //I want to explorer a recursive approach for deeper trees. How do i template a child that is a parent and a child
            //I am pretty sure a recursive approach seting the context to the child repsonse ID and the recursively prompts from there
            await fs.writeFile("./grok/context/history/responses/"+userPromptRequest.rootResponseId+"/tree/"+"MASTER_HTML_FILE"+".html", parentHtml);
            await fs.writeFile("./grok/context/currentChat/currentChat.html", parentHtml);
            //replace @REPLACEWITHCHILDRENDIVS@ with the childDivs string
            


            /* Thinking time
               * Obtain all of the READMEs for the tree and branches.
               * For each child branch create an <div id="childContent1...5"> 
               * Parent html will have one nav "link".  each list item will be a "link" to the div
               * The links will execute a javascript function which toggles hidden attribute for all over divs.
               * The backend server will  use marked to add the styled markdown to each conent div
               * 
               * 
            */
            }catch(error){
                terminal.error("Error copying the currentChat.html file:", error);
            }
        }
    

            // Open currentChat.html in the default browser
    if(userPromptRequest.browserMode){
        let htmlDir =   "currentChat/currentChat.html";
        if(!userPromptRequest.treeMode){
            htmlDir = "currentChat/currentChat.html";
        }else{
            //open the last child soon to be MONO_HTML_FILE  this can be wapped for currentchathtml too
            htmlDir = "history/responses/"+userPromptRequest.rootResponseId+"/tree/"+"MASTER_HTML_FILE"+".html";
        }
  
     
    const openCommand = os.platform() === 'win32' ? 'start' : 'open';
    exec(`${openCommand} ./grok/context/${htmlDir}`, (err) => {
        if (err) {
                terminal.error("Error opening the HTML file:", err);
            }
        });
    }
       
    }

    }
}

main().catch(terminal.error);


/*
 * Note: When implementing this script as a microservice in NestJS,
 * the static nature of the getDefaultProfile method may need to be refactored.
 *
 * Trade-offs:
 * 1. Static Method:
 *    - Pros: 
 *      - No need to instantiate the class, making it easy to call.
 *      - Slightly better performance due to reduced overhead.
 *    - Cons:
 *      - Less flexible for future changes that may require state management.
 *      - Harder to mock for unit testing.
 *
 * 2. Instance Method:
 *    - Pros:
 *      - More flexible for managing state and dependencies.
 *      - Easier to test with dependency injection.
 *    - Cons:
 *      - Requires instantiation, which may add overhead if called frequently.
 *
 * Consider the future architecture and requirements when deciding on the method's nature.
 */