import OpenAI from "openai";
import dotenv from "dotenv"
import fs from 'fs/promises'
import { exec } from 'child_process'
import os from 'os'

import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';
import {PromptProfile} from './prompt_profiles/default';
import {TreeModeProfile} from './prompt_profiles/TreeMode';

class terminal {
    static debugLogger = false;
    constructor() {
     
    }
    
    static log(...args) {
        console.log(...args);
    }
    static error(...args) {
        console.error(...args);
    }
    static warn(...args) {
        console.warn(...args);
    }
    static info(...args) {
        console.info(...args);
    }
    static debug(...args) {
        if (this.debugLogger) {
            console.log(...args);
        }
    }
    
}


const logDivider = "*---------------------------------------------------------------*";
// Define ANSI color codes
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    purple: "\x1b[35m",
    cyan: "\x1b[36m",
    // context: "\x1b34m",
    // new: "\x1b[32m",  //ARGCOLORS
    // depth: "\x1b33m",           
    // file: "\x1b35m",
    // specialty: "\x1b36m",
    // treeMode: "\x1b44m"
  };


// Initialize DOMPurify with JSDOM
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

//grok-2-vision-1212

// Parse command line arguments and return prompt and flags
function parseCommandLineArgs() {
   
    terminal.debugLogger = true;
    const args = process.argv.slice(2);
    //console.log(...args);
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
    //BUG ALERT this my cause issues since new has no value
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

    return { userPrompt, isShort, isNew, setContext, depth, filePath, specialty, treeMode , browserMode};
}

function cleanString(string) {
    return string.replaceAll("```json", "")
    .replaceAll("```", "")
    .replaceAll(" ", "")
    .replaceAll("\n", "")
    .replaceAll("\\", "")
    .replaceAll("'", "")
    .replaceAll("\"", "")
    .replaceAll(":", "")
    .replaceAll(",", "")
    .replaceAll(".", "")
    .replaceAll("-", "")
    .replaceAll("_", "")
    .replaceAll("*", "")
    .replaceAll("`", "")
    .replaceAll("~", "")
    .replaceAll("^", "")
    .replaceAll("=", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("{", "")
    .replaceAll("}", "")
    .replaceAll(";", "")
    .replaceAll(":", "")
}

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
function createApiRequest(userPrompt, messagesString, isNew, isShort, contextData, setContext, filePath, specialty, isTreeMode) {
    let profile = "default";
    let messages = [];
    if (isShort) {
        profile = "short";
    }
    if (specialty) {
        PromptProfile.setSpecialty(specialty);
    }
  
    PromptProfile.isLogging = false;
    
    if(isTreeMode){
        messages = TreeModeProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt); // Load the array from the default file
    }else{
        messages = PromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt); // Load the array from the default file
    }
    
    terminal.debug(colors.green, "Prompt Sent to Grok", colors.reset, JSON.stringify(messages, null, 4));
  


    return {
        model: "grok-2-latest",
        messages: messages, // Use the loaded variable here
    };
}

// Save response to files
/*
  completion is the response from the api
  userPrompt is the prompt that was sent to the api
  responseId is the id of the response
  contextHistoryLength is the length of the context history
  depth is the depth of the context
*/
async function saveResponse(completion, userPrompt, responseId, contextHistoryLength, depth, browserMode, childDirectory, treeMode) {
    //console.log("saving responses called");
    //TODO UNTANGLE THIS LOGIC

    let jsonContent = "";
    let markdownContent = "";
    const content = completion.choices[0].message.content.replace(/\\n/g, '\n');
    terminal.debug(colors.yellow, "\n\nunprocessed response", colors.green, content, colors.reset);
   try{
     [markdownContent, jsonContent] = content.split("@EOF@"); 
   }catch(error){
    terminal.log(colors.red, "error", colors.reset, error);
     [markdownContent, jsonContent] = ["## Heading 1\n\n## Heading 2\n\n## Heading 3\n\n", "@EOF[keywords,list,always]"];
   }
  
   

    //console.log(colors.green, "markdownContent", colors.reset, markdownContent);
 
    let priorContextId = await saveContextFiles(responseId, jsonContent, completion, markdownContent, depth);
  

    await saveHtmlResponse(userPrompt, responseId, markdownContent, priorContextId, childDirectory, treeMode);
    
    let markdownResponse = await saveMarkdownResponse(userPrompt, responseId, markdownContent);
    await savePreviousId(responseId, userPrompt, contextHistoryLength);
  
    


    //TODO need a better name for this.
    return {jsonContent, markdownResponse};
}

//TODO i should open up threads for CHILD WRITES
async function  saveHtmlResponse(userPrompt, responseId, markdownContent, priorContextId, childDirectory, treeMode) {
    //let pwd = process.cwd();
    //console.log("pwd", pwd);
    // Save HTML response
    let indexHtml = await fs.readFile('./grok/template.html', "utf8");
    markdownContent =  markdownContent + "\ResponseID:" + responseId ;
    let sanitizedMarkdownContent = preprocessResponse(markdownContent);


    indexHtml = indexHtml.replaceAll("@PARENT_ID@", TreeModeProfile.ParentId); //NICE THIS IS STATIC AND AVAIALBLE!
    indexHtml = indexHtml.replaceAll("REPLACEME", sanitizedMarkdownContent);
    indexHtml = indexHtml.replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, 8));
    indexHtml = indexHtml.replaceAll("@DIRECTORY@", ""); // absolute path to the directory not compatible with firefox
    indexHtml = indexHtml.replaceAll("@CURRENT_ID@", responseId);

    if(childDirectory != ""){
        let childHtml = await fs.readFile('./grok/child_template.html', "utf8");
        

        childHtml = childHtml.replaceAll("@PARENT_ID@", TreeModeProfile.ParentId); //NICE THIS IS STATIC AND AVAIALBLE!
        childHtml = childHtml.replaceAll("REPLACEME", sanitizedMarkdownContent);
        childHtml = childHtml.replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, 8));
        childHtml = childHtml.replaceAll("@DIRECTORY@", ""); // absolute path to the directory not compatible with firefox
        childHtml = childHtml.replaceAll("@CURRENT_ID@", responseId);
    

        console.log(colors.red,logDivider, colors.reset);
        console.log("childDirectory being written to", childDirectory);
        console.log(colors.red,logDivider, colors.reset );
        await fs.writeFile(
            `./grok/context/html/${childDirectory}/${responseId}.html`,
            childHtml,
            "utf8"
        );
    }else{
        if(treeMode){
            console.log(colors.red,logDivider, colors.reset);
            console.log("this is a parent write:", responseId);
            console.log(colors.red,logDivider, colors.reset );
        }
    }
        await fs.writeFile(
            `./grok/context/html/${responseId}.html`,
            indexHtml,
            "utf8"
        );
    

    await fs.writeFile(
        `./grok/context/currentChat/${responseId}.html`,
        indexHtml,
        "utf8"
    );

    await fs.writeFile(
        `./grok/context/currentChat/currentChat.html`,
        indexHtml,
        "utf8"
    );


}

async function saveMarkdownResponse(userPrompt, responseId, markdownContent) {
    terminal.debug(logDivider);
    terminal.debug(colors.green, "markdownContent\n",colors.reset, markdownContent);
    terminal.debug(logDivider);
    // Save markdown response
    await fs.writeFile(
        `./grok/context/html/${userPrompt.replaceAll(" ", "_").replaceAll(":", "_").replaceAll("/", "_").replaceAll(".", "").substring(0, 40)}-${responseId}.md`,
        markdownContent,
        "utf8"
    );
    return markdownContent;
    
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

    // Sanitize the response using DOMPurify if available
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



async function saveContextFiles(fullResponseId, jsonContent, completion, markdownContent, depth) {
    // Save context files
    let priorContextId = await moveContextFile();

    // Load the old summary.json into memory
    let oldSummaryContent = "";
    try {
        oldSummaryContent = await fs.readFile("./grok/context/currentChat/summary.json", "utf8");
     

    } catch (error) {
        terminal.error("Error reading the old summary.json:", error);
    }
  
    await appendToContext(jsonContent, depth);
    try{
        await fs.writeFile("./grok/context/currentChat/summary.json", JSON.stringify(jsonContent));
    }catch(error){
        terminal.error("Error writing the summary.json:", error);
    }
    try{
        await fs.writeFile('./grok/context/currentChat/currentChat.json', JSON.stringify(completion));
    }catch(error){
        terminal.error("Error writing the currentChat.json:", error);
    }
    await fs.writeFile(
        `./grok/context/markdown/${fullResponseId}.md`,
        markdownContent,
        "utf8"
    );
    await fs.writeFile(
        `./grok/context/currentChat/markdown/${fullResponseId}.md`,
        markdownContent,
        "utf8"
    );

    await fs.writeFile(
        `./grok/context/currentChat/markdown/${fullResponseId}.md`,
        markdownContent,
        "utf8"
    );

    await fs.writeFile(
        `./grok/context/html/markdown/${fullResponseId}.md`,
        markdownContent,
        "utf8"
    );
    
    
    //I think these prompts can be used to profile the user and make a better system prompt
    return priorContextId;
}

async function appendToContext(newContent, MAX_CONTEXT_LENGTH) {
    if (typeof newContent !== 'string') {
        terminal.error("Grok answered but forgot to include include the proper format! PROMPT AGAIN it should work", newContent);
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
    contextData = contextData
    .replaceAll(/\\n/g, '')
    .replaceAll(/\\/g, '')
    .replaceAll(/"/g, '')
    .replaceAll(/'/g, "")
    .replaceAll(/\n/g, '')
    .replaceAll(/` `/g, '')
    .replaceAll("[", "")
    .replaceAll("]", "");

    terminal.debug(logDivider);
    terminal.debug(colors.green, "Current Subject:",colors.reset, newContent);
    terminal.debug(logDivider);
    terminal.debug(colors.green, "Current Context[",MAX_CONTEXT_LENGTH,"]:",colors.reset, contextData);
    terminal.debug(logDivider);
    await fs.writeFile("./grok/context/context.data", contextData);


}

async function savePreviousId(responseId, userPrompt, contextHistoryLength){
    let previousId = await fs.readFile("./grok/context/context.history", "utf8");
    let parsedPreviousId = JSON.parse(previousId);
    parsedPreviousId.push({id: responseId, prompt: userPrompt});
    await fs.writeFile("./grok/context/context.history", JSON.stringify(parsedPreviousId));
    terminal.log(logDivider);
    
    terminal.log(colors.green, "\nPrevious Context", colors.reset);

    // Log only the last 3 context entries
    const EntriesToLog = parsedPreviousId.slice(contextHistoryLength);
    for(let i = 0; i < EntriesToLog.length && i < 5; i++){
        terminal.log(colors.green, "contextId:", colors.reset, EntriesToLog[EntriesToLog.length - i - 1].id,  colors.yellow, "\n Prompt:\n",colors.reset, EntriesToLog[EntriesToLog.length - i - 1  ].prompt);
        terminal.log(colors.reset, " - - - - - - - - - - - - - - - - - - - - -", colors.reset);
    }
    terminal.log(logDivider);
    return parsedPreviousId;
}

async function moveContextFile() {
    let oldContextFile = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
    let parsedContext = JSON.parse(oldContextFile);
    let parsedContextId = parsedContext.id.substring(0, 8);
    await fs.copyFile(
        './grok/context/currentChat/currentChat.json',
        `./grok/context/history/${parsedContextId}.json`
    );
    return parsedContextId;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function main() {
    const { userPrompt, isShort, isNew, setContext, depth ,filePath, specialty, treeMode, browserMode} = parseCommandLineArgs();
    let morePrompts = true;
    let isTreeMode = treeMode;
    let dynamicPrompt = userPrompt;
    let dynamicResponseId = "";
    let childDirectory = "";
    let currentSubject = ""
    //These are used to crawl the list. start at the end and work your way back to 1;
    let branchList = [];
    let branchIndex = 0;
    //there will be a tree mode which "branches" off into each heading of the readme doc and send a prompt to grok.
    //it will need a parent id make navlink navigation easier. add to template html
    //TODO: add a tree mode flag
    //for now there will be a treemode profile that sends the prompt specify a list of headings.  
    // it will send the prompt. afterwards it will add each heading to an array.  
    // the while loop will terminate when it is done making the default prmops for the branches.
    
    while( morePrompts == true){
         //TODO in order to add depth I will need to simulate the command line arguments.
         // Simulate command line arguments userPrompt, isShort, isNew, setContext, depth ,filePath, specialty, treeMode
         // for now context can remain the same.  
         // Later a branch profile can be called for the api call.
         if( treeMode && branchIndex >= 1){
           
            currentSubject = branchList[branchIndex-1]
          
            dynamicPrompt = "Tell me more about item " + branchIndex + " of this list.  Go into more detail about and info you already included.: "  + branchList[branchIndex-1];
            await sleep(1000); // Replaced sleep with wait to avoid overwhelming the API.
            terminal.log(colors.green, "User Prompt", colors.reset, dynamicPrompt);
            terminal.log(colors.green, "Branch List", colors.reset, branchList);
            terminal.log(colors.green, "Branch Index", colors.reset, branchIndex);
            branchIndex--;
            
         }

    let contextHistoryLength = depth/500;
    const messagesString = await getConversationContext(setContext, isNew); // Ensure context is fetched based on setContext
    
    //console.log(colors.green, "PARSED MESSAGE STATUS", messagesString, colors.reset);
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");
  
 
    //setContext ? console.log(colors.green, "\ncontextID:",colors.reset, setContext,"\n") : console.log(colors.green, "\n", colors.reset); // Log the setContext for debugging
    //terminal.log("*---------------------*")
    let apiRequest = createApiRequest(dynamicPrompt, messagesString, isNew, isShort, contextData, setContext, filePath, specialty, isTreeMode);
    const completion = await openai.chat.completions.create(apiRequest);
    dynamicResponseId = completion.id.substring(0, 8);

    let treeModeList = "";
    let markdownResponse = "";
    let responseOutput = await saveResponse(completion, dynamicPrompt, dynamicResponseId, contextHistoryLength, depth, browserMode, childDirectory, isTreeMode);
    try{
        treeModeList = responseOutput.jsonContent.replace("@EOF@", "");
        markdownResponse = responseOutput.markdownResponse;
    }catch(error){
        terminal.error("AI_CMD bot forgot the @EOF@ tag in the response... try again and it should work", error);
    }
    
    terminal.log( "current contextId",   colors.blue, dynamicResponseId, colors.reset);
    terminal.log(colors.purple, "\nfile used:", colors.reset, filePath?filePath:"none");
    treeMode && !isTreeMode && terminal.log(colors.green, "Tree-"+ colors.reset, TreeModeProfile.ParentId, colors.green, "\nbranches"+colors.green+"["+branchList.length+"]-", branchList);
    terminal.log(logDivider);

    //TODO harded code price function should be dynamic for differnt models.
    const INPUT_TOKEN_PRICE = 200/1000000;
    const OUTPUT_TOKEN_PRICE = 1000/1000000;
    const totalPrice = (completion.usage.prompt_tokens * INPUT_TOKEN_PRICE) + (completion.usage.completion_tokens * OUTPUT_TOKEN_PRICE);
    terminal.log(colors.green, "Tokens used", colors.yellow, "prompt:", colors.reset, completion.usage.prompt_tokens, colors.yellow, "completion:", colors.reset, completion.usage.completion_tokens, colors.reset);
    terminal.log(colors.green, "Aprox price of prompt", colors.yellow, totalPrice, colors.reset, "cents ");
    //TODO ^^^in tree mode these values can be stored and added up
    terminal.log(logDivider);
    //write settings to ../.grokRuntimeterminal
    if(terminal.debugLogger == false){
        terminal.log(colors.green, "\nResponse", colors.reset, markdownResponse);
    }

    let terminalState = browserMode?"":"terminalMode";
    //await fs.writeFile("./grok/context/html/markdown/"+dynamicResponseId+".md", markdownResponse+"\ncontext:"+dynamicResponseId);
    await fs.writeFile(".grokRuntime", `depthState=${depth}\nnewState=""\nsetContextState=${dynamicResponseId}\nterminalMode=${terminalState}`);
    
    if(isTreeMode){
        isTreeMode = false;
        branchList = TreeModeProfile.parseSubject(treeModeList);
        branchIndex = branchList.length;
        TreeModeProfile.setParentId(dynamicResponseId);
        childDirectory = TreeModeProfile.ParentId+"_tree";
        await fs.mkdir("./grok/context/html/"+childDirectory, { recursive: true });
        try{
            //TODO fix the saveHtmlResponse function to handle differnt typeps
            await fs.copyFile("./grok/context/currentChat/currentChat.html", "./grok/context/html/"+childDirectory+"/"+dynamicResponseId+".html");
        }catch(error){
            terminal.error("Error copying the currentChat.html file:", error);
        }
        terminal.log(colors.yellow, "\nParent ID", colors.reset, TreeModeProfile.ParentId);
        terminal.log(colors.blue, "Branches", colors.reset, branchList);
    }
   
    //TODO Optizmize this later. I might put at the top of the while loop to flex... this is more readable though.
    //This index change is to fanagle the initial branch prompt to work.
    if(isTreeMode || branchIndex > 0){
        terminal.log(colors.blue, "parentId", colors.reset, TreeModeProfile.ParentId);
        terminal.log(colors.yellow, "branchId", colors.reset, dynamicResponseId);
        morePrompts = true;
    }else{
        morePrompts = false;
            // Open currentChat.html in the default browser
    if(browserMode){
        let htmlDir =   "currentChat/currentChat.html";
        if(!treeMode){
            htmlDir = "currentChat/currentChat.html";
        }else{
            //open the last child
            htmlDir = "html/"+childDirectory+"/"+dynamicResponseId+".html";
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