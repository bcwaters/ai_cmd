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
import {PromptProfile} from './prompt_profiles/default.js';
import {TreeModeProfile} from './prompt_profiles/TreeMode.js';
import UserPromptRequest from './utils/UserPromptRequest.js';
import terminal from './utils/terminal.js'; 
import {cleanString, sleep, removeWhiteSpaceAndEnsureAlphabet } from './utils/utils.js';



//Configuration before main -------------------------------
dotenv.config();

// Initialize DOMPurify with JSDOM
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

//apiKey: process.env.XAI_API_KEY,
//baseURL: "https://api.x.ai/v1",
//grok-2-vision-1212
//TODO this does not have to be hardcoded to grok
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
});

const xai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});


let chosenModel = xai;

const tagLength = 16; //8 for grok

//End Configuration before main -------------------------------

// Parse command line arguments and return prompt and flags
export function parseCommandLineArgs() {
   
    terminal.debugLogger = true;
    const args = process.argv.slice(2);

    let userPrompt = "Default prompt if none provided";
    let depth = 500;
    let isNew = false;
    let context = "";
    let filePath = "";
    let isShort = false;
    let specialty = "";
    let treeMode = false;
    let terminalMode = false;
    let browserMode = true;


    if(args.includes("--openai")){
        chosenModel = openai;
    }
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

    }  if (args.includes("--context")) {
        const contextIndex = args.indexOf("--context") + 1;
        if(contextIndex < args.length){
            context = args[contextIndex];
        }
    
    } else if (args.length > 0) {
        userPrompt = args.join(" ");
    }

    let indexOfPrompt = args.indexOf("PROMPT");
    if (indexOfPrompt != -1) {
        userPrompt = args[indexOfPrompt + 1];
    }


    return new UserPromptRequest(userPrompt, isShort, isNew, context, depth, filePath, specialty, treeMode , browserMode);
}

// Read and parse the context file
export async function getConversationContext(context, isNew) {

    //isNew? return "string for a new context": do other stuff
    try {
  
        //TODO FIX CONTEXT HSITRY for new flag
        if (context == "") {
            const context = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
            const parsedContext = JSON.parse(context);
           
            const messages = parsedContext.choices[0]
            //console.log(colors.green, "parsedContext", messages.message.content, colors.reset);
            let messageContent = messages.message.content;
 
            messageContent = cleanString(messageContent);

            return messageContent || "Error returning context";
        } else {
      

            const storedContext = await fs.readFile('./grok/context/history/fullCompletion/' + context + '.json', "utf8");
            const parsedContext = JSON.parse(storedContext);
           
            const messages = parsedContext.choices[0]
            //console.log(colors.green, "parsedContextSET", messages.message.content, colors.reset);
            let messageContent = messages.message.content;
          
            messageContent = cleanString(messageContent);

            return messageContent || "Error returning context for " + context;
        }
    } catch (error) {
        terminal.error("Error reading or processing the context file:", error);
        return "";
    }
}

// Create the request object for the API
export async function createApiRequest(userPromptRequest, priorConverstation, isNew, isShort, contextData, context, filePath, specialty, processingRootNode) {
    let profile = "default";
    let messages = [];
    if (isShort) {
        profile = "short";
    }
    if (specialty) {
        PromptProfile.setSpecialty(specialty);
    }
  
    PromptProfile.isLogging = false;
    
    if(userPromptRequest.treeMode){
        if(processingRootNode){
            messages = TreeModeProfile.getDefaultProfile(isNew, priorConverstation, contextData, userPromptRequest.dynamicPrompt); // Load the array from the default file
        }else{
            messages = TreeModeProfile.getBranchProfile(isNew, priorConverstation, contextData, userPromptRequest.dynamicPrompt); // Load the array from the default file
        }
    }else{
        //load filepaths from userPromptRequest.filePath
        let fileContent = await userPromptRequest.fileContent();
        terminal.debug(terminal.colors.green, "fileContent", terminal.colors.reset, fileContent);

        if(fileContent.length > 0){
            PromptProfile.addFile(fileContent);
        }
        messages = PromptProfile.getDefaultProfile(isNew, priorConverstation, contextData, userPromptRequest.dynamicPrompt); // Load the array from the default file
    }
    
    terminal.debug(terminal.colors.green, "Prompt Sent to Grok", terminal.colors.reset, JSON.stringify(messages, null, 4));
  
    //grok-2-latest
    //terminal.debug(terminal.colors.green, "Prompt Sent to Grok", terminal.colors.reset, JSON.stringify(messages, null, 4));
    return {
        model: chosenModel == openai ? "gpt-4.5-preview" : "grok-2-latest",
        messages: messages, // Use the loaded variable here
    };
}

export async function parseCompletionForResponseAndMetaResponse(completion){

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

export function htmlReplaceTemplateValues(html_string, sanitizedMarkdownContent, priorContextId, responseId){
    //TODO ParentID technically is null here, there needs to be inheritance form a prompt class for a default value
    html_string = html_string.replaceAll("@PARENT_ID@", TreeModeProfile.ParentId) //NICE THIS IS STATIC AND AVAIALBLE!
    .replaceAll("REPLACEME", sanitizedMarkdownContent)
    .replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, tagLength)) //TODO is this substring redundant?
    .replaceAll("@DIRECTORY@", "") // absolute path to the directory not compatible with firefox
    .replaceAll("@CURRENT_ID@", responseId);

    //TODO return can be done without variable assignment if no other processing is needed.
    return html_string;
}

//TODO i should open up threads for CHILD WRITES
export async function  saveHtmlResponse(userPromptRequest, markdownContent, priorContextId) {

    // Save HTML response for parent of treaMode of default prompt
    let indexHtml = await fs.readFile('./grok/html_templates/template.html', "utf8");
    markdownContent =  markdownContent + "\n\nResponseID:" + userPromptRequest.dynamicResponseId ;
    let sanitizedMarkdownContent = preprocessResponse(markdownContent);

    indexHtml = htmlReplaceTemplateValues(indexHtml, sanitizedMarkdownContent, priorContextId, userPromptRequest.dynamicResponseId);


    //If it is treeMode then the children are created here.
    if(userPromptRequest.childDirectory != ""){
        let childHtml = await fs.readFile('./grok/html_templates/child_template.html', "utf8");
        
        childHtml = htmlReplaceTemplateValues(childHtml, sanitizedMarkdownContent, priorContextId, userPromptRequest.dynamicResponseId);
        //TODO ponder the trade offs of using HTML here instead of the markdown.
        TreeModeProfile.addChildReadme(sanitizedMarkdownContent);
    
        terminal.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset);
        terminal.log("childDirectory being written to", userPromptRequest.childDirectory);
        terminal.log(terminal.colors.red,terminal.logDivider, terminal. colors.reset );
        await fs.writeFile(
            `./grok/context/history/responses/${userPromptRequest.rootResponseId}/tree/${userPromptRequest.childDirectory}/${userPromptRequest.dynamicResponseId}.html`,
            childHtml,
            "utf8"
        );
    }else{
        //IF this is treemode but no child is written log that the parent summary page was written
        if(userPromptRequest.treeMode){
            terminal.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset);
            terminal.log("this is a parent write:", userPromptRequest.rootResponseId);
            terminal.log(terminal.colors.red,terminal.logDivider, terminal.colors.reset );
        }
    }//if child directory and not a parent do nothing
       
    // Obfucscated logic to create the directory structure before writing the file, do so before methd call.
    // Create the directory structure before writing the file
    //this only has to be called once if called elsewhere
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

export async function saveMarkdownResponse(userPromptRequest, markdownContent) {
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

export function preprocessResponse(response) {   
    // Use marked to parse the response if available
    if (marked) {
        response = marked.parse(response);
    }
    
    // Sanitizes scripts from output. must be done after marked parses
    if (DOMPurify) {
        response = DOMPurify.sanitize(response);
    }
    
    while(response.charAt(0) != "<"){
        response = response.substring(1);
    }
    return response;
}


export async function appendToContext(newContent, MAX_CONTEXT_LENGTH) {
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
    terminal.debug(terminal.colors.green + "Current Context[" + MAX_CONTEXT_LENGTH, + "]:"+terminal.colors.reset, contextData);
    terminal.debug(terminal.logDivider);
    await fs.writeFile("./grok/context/context.data", contextData);


}

//This can be done with grokruntime for efficiency and be labeled log previos ids.  Might be the place to reduce list size from time to time.
export async function savePreviousId(responseId, userPrompt, contextHistoryLength){
    let previousIds = await fs.readFile("./grok/context/context.history", "utf8");
    let parsedPreviousIds = JSON.parse(previousIds);
    let mostRecentHistoryId = parsedPreviousIds[parsedPreviousIds.length - 1];
    parsedPreviousIds.push({id: responseId, prompt: userPrompt});
    await fs.writeFile("./grok/context/context.history", JSON.stringify(parsedPreviousIds));

    terminal.log(terminal.colors.green, "\nSwitch context to id to resume conversation", terminal.colors.reset);
    terminal.log(terminal.logDivider);
    
    let EntriesToLog = parsedPreviousIds.slice(contextHistoryLength);
    EntriesToLog.reverse();
    EntriesToLog = EntriesToLog.slice(0, 5);
    EntriesToLog.reverse();
 
    for(let i = 0; i < EntriesToLog.length && i < 5; i++){
        terminal.log(terminal.colors.green, "contextId:", terminal.colors.reset, EntriesToLog[i].id,  terminal.colors.yellow, "\n Prompt:\n",terminal.colors.reset, EntriesToLog[i].prompt);
        terminal.log(terminal.colors.yellow, "             - - - - - - - - - - - - - - - - - - - - -           ", terminal.colors.reset);
    }
    terminal.log(terminal.colors.yellow, terminal.getDividerWithMessage("PRIOR-PROMPTS"));
    return mostRecentHistoryId.id;
}

//A recursive approach should remedy this so parent is written last.
export async function saveCompletion(completion, responseId){
    //overwrites the old file
    await fs.writeFile(`./grok/context/currentChat/currentChat.json`, JSON.stringify(completion));
    await fs.writeFile(`./grok/context/history/fullCompletion/${responseId}.json`, JSON.stringify(completion));

}
// Main function
export async function main() {
    //RAG_PROFILE_STATE class needs to be made before this bloats beyond repair
    const userPromptRequest = parseCommandLineArgs();

    let morePrompts = true;
    let processingRootNode = userPromptRequest.treeMode;

    while( morePrompts == true){
 
        //If this is branching request and there are branches to process
        if( userPromptRequest.treeMode && userPromptRequest.branchIndex >= 1){
           
            //Start at last child
            userPromptRequest.currentSubject = userPromptRequest.branchList[userPromptRequest.branchIndex-1]
            userPromptRequest.dynamicPrompt =  "Tell me more about item " + userPromptRequest.branchIndex + " of this list.  Go into more detail about info you already included.: "  + userPromptRequest.branchList[userPromptRequest.branchIndex-1];
            await sleep(1000); // Replaced sleep with wait to avoid overwhelming the API.
            terminal.log(terminal.colors.green, "User Prompt", terminal.colors.reset, userPromptRequest.dynamicPrompt);
            terminal.log(terminal.colors.green, "Branch List", terminal.colors.reset, userPromptRequest.branchList);
            terminal.log(terminal.colors.green, "Branch Index", terminal.colors.reset, userPromptRequest.branchIndex);
            //TODO perhaps this should use the getter and setters...
            userPromptRequest.branchIndex--;
        }

         terminal.debug(terminal.colors.green, "User Prompt Request", terminal.colors.reset, userPromptRequest.toString());

    //TODO Load the previous propmt - there is probably a clever way to use previous id and load as much history as requested... add parent to context.history
    const priorConverstation = await getConversationContext(userPromptRequest.context, userPromptRequest.isNew); // Ensure context is fetched based on context
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");



    //Context is loaded for the api request
    let apiRequest = await createApiRequest(userPromptRequest, priorConverstation, userPromptRequest.isNew, userPromptRequest.isShort, contextData, userPromptRequest.context, userPromptRequest.filePath, userPromptRequest.specialty, processingRootNode);


    const completion = await chosenModel.chat.completions.create(apiRequest);

    //TODO rmove this logic into userPromptRequest as a process completion method
    if(userPromptRequest.treeMode){
        if(processingRootNode){
            userPromptRequest.rootResponseId = completion.id.substring(0, tagLength);
            userPromptRequest.dynamicResponseId = completion.id.substring(0, tagLength);
        }else{
            userPromptRequest.dynamicResponseId = completion.id.substring(0, tagLength);
        }
    }else{ //singular prompt
        userPromptRequest.rootResponseId = completion.id.substring(0, tagLength);
        userPromptRequest.dynamicResponseId = completion.id.substring(0, tagLength);
    }



    let {metaResponse, markdownContent} = await parseCompletionForResponseAndMetaResponse(completion);
    terminal.debug(terminal.getDividerWithMessage("RESPONSE-AND-META-RESPONSE"));
    terminal.debug(terminal.colors.green, "metaResponse", terminal.colors.reset, metaResponse);
    terminal.debug(terminal.colors.green, "markdownContent", terminal.colors.reset, markdownContent);
    terminal.debug(terminal.logDivider);

    if(userPromptRequest.treeMode  && processingRootNode){
        userPromptRequest.parentReadme = markdownContent;
    }


    //STEP 3 now update the context for future prompts
    //let priorContextId = await saveContextFiles(userPromptRequest.dynamicResponseId, metaResponse, completion, markdownContent, userPromptRequest.depth);
    await appendToContext(metaResponse, userPromptRequest.depth);

    //TODO examine the best depth ratio for length. this should round down but be atleast 1
    let contextHistoryLength = userPromptRequest.depth/500;
    let priorContextId = await savePreviousId(userPromptRequest.dynamicResponseId, userPromptRequest.dynamicPrompt, contextHistoryLength);
    

    await saveCompletion(completion, userPromptRequest.dynamicResponseId);
    await saveHtmlResponse(userPromptRequest, markdownContent, priorContextId);
    await saveMarkdownResponse(userPromptRequest, markdownContent);
        //consider whether or not to append response ID
    //ALL makr and html should be saved to the disk now

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
        terminal.log(terminal.colors.green, "\nResponse", terminal.colors.reset, markdownContent);
    }

    let terminalState = userPromptRequest.browserMode?"":"terminalMode";
    await fs.writeFile("./shell_helpers/.grokRuntime", `depthState=${userPromptRequest.depth}\nnewState=""\ncontextState=${userPromptRequest.dynamicResponseId}\nterminalMode=${terminalState}`);
    
    //This is the first loop of treeMode
    if(processingRootNode){
        processingRootNode = false;
        userPromptRequest.branchList = TreeModeProfile.parseSubject(metaResponse);

        //userPromptRequest.branchList = userPromptRequest.branchList.map(subject => removeWhiteSpaceAndEnsureAlphabet(subject));
        userPromptRequest.branchIndex = userPromptRequest.branchList.length;
        TreeModeProfile.setParentId(userPromptRequest.dynamicResponseId);
        TreeModeProfile.setParentReadme(markdownContent);
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
                childReadmeSubject = removeWhiteSpaceAndEnsureAlphabet(childReadmeSubject);
                terminal.debug(terminal.colors.green, "childReadme: ", terminal.colors.reset, childReadme);
                terminal.debug(terminal.colors.green, "childReadmeSubject: ", terminal.colors.reset, childReadmeSubject);
                terminal.debug(terminal.colors.green, "index: ", terminal.colors.reset, i);
                let parsedReadme = preprocessResponse(childReadme);
                //Chance to add attribute is here for hidden or visible                                   //function unneeded but concept is interesting
                let childReadmeHtml = `<div title="${childReadmeSubject}" id="childContent${i+1}" onclick="setVisibileChild('childContent${i+1}')" hidden=true>${parsedReadme}</div>`;
                
                terminal.debug(terminal.colors.green, "childReadmeHtml", terminal.colors.reset, childReadmeHtml);
                //TODO examine ordering
                processedChildReadmes.push(childReadmeHtml);
                //YIKES THIS NEEDS DOM MANIPULATION. No wonder react is so popular.
                //onclick set parent to hidden and child to visible.
                //this will need a fuzzy search in parent headings to properly link the child to the parent.
            }

            terminal.debug(terminal.colors.green, "allChildReadmes", terminal.colors.reset, allChildReadmes);
            terminal.debug("------------Exiting child loop------------");
            terminal.debug(terminal.logDivider);
            //combine all the child divs into a nice incomprehensiible html string
            terminal.debug(terminal.colors.green, "processedChildReadmes", terminal.colors.reset, processedChildReadmes);
            let childDivs = processedChildReadmes.join("");
            terminal.debug(terminal.colors.green, "childDivsCombined", terminal.colors.reset, childDivs);
            
            terminal.debug(terminal.colors.green, "childDivs", terminal.colors.reset, childDivs);
            let parentHtml = await fs.readFile("./grok/html_templates/parent_template.html", "utf8");

            //DO all the replacements
            parentHtml = parentHtml.replace("REPLACEME", preprocessResponse(TreeModeProfile.ParentReadme));
            parentHtml = parentHtml.replace("@REPLACEWITHCHILDRENDIVS@", childDivs);
            parentHtml = parentHtml.replace("@CURRENT_ID@", TreeModeProfile.ParentId);
            //parentHtml = parentHtml.replace("@PREVIOUS_ID@", dynamicResponseId);

            //I could name this more intelligently.
            //I want to explorer a recursive approach for deeper trees. How do i template a child that is a parent and a child
            //I am pretty sure a recursive approach seting the context to the child repsonse ID and the recursively prompts from there
            await fs.writeFile("./grok/context/history/responses/"+userPromptRequest.rootResponseId+"/tree/index.html", parentHtml);
            await fs.writeFile("./grok/context/currentChat/currentChat.html", parentHtml);
            //replace @REPLACEWITHCHILDRENDIVS@ with the childDivs string
            


            /* Thinking time
               * Obtain all of the READMEs for the tree and branches.
               * For each child branch create an <div id="childContent1...5"> 
               * Parent html will have one nav "link".  each list item will be a "link" to the div
               * The links will execute a javascript function which toggles hidden attribute for all over divs.
               * The backend server will use marked to add the styled markdown to each conent div
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
            htmlDir = "history/responses/"+userPromptRequest.rootResponseId+"/tree/index.html";
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
