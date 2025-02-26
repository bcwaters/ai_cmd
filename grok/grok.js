import OpenAI from "openai";
import dotenv from "dotenv"
import fs from 'fs/promises'
import { exec } from 'child_process'
import os from 'os'

import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { marked } from 'marked';
import {PromptProfile} from './prompt_profiles/default';

const logDivider = "*---------------------------------------------------------------*";
// Define ANSI color codes
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m"
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
    const args = process.argv.slice(2);
    //console.log(...args);
    let userPrompt = "Default prompt if none provided";
    let depth = 500;
    let isNew = false;
    let setContext = "";

    let isShort = false;

    if (args.includes("--depth")) {
      
        const depthIndex = args.indexOf("--depth") + 1;
        if (depthIndex < args.length) {
            depth = args[depthIndex];
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
    }parseCommandLineArgs

    let indexOfPrompt = args.indexOf("PROMPT");
    if (indexOfPrompt != -1) {
        userPrompt = args[indexOfPrompt + 1];
    }

    return { userPrompt, isShort, isNew, setContext, depth };
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
        console.log(colors.green, "setContext", setContext, colors.reset);
        //TODO FIX CONTEXT HSITRY for new flag
        if (setContext == "") {
            const context = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
            const parsedContext = JSON.parse(context);
           
            const messages = parsedContext.choices[0]
            console.log(colors.green, "parsedContext", messages.message.content, colors.reset);
            let messageContent = messages.message.content;
        
            messageContent = cleanString(messageContent);
   
            return messageContent || "Error returning context";
        } else {
      
            const context = await fs.readFile('./grok/context/history/' + setContext + '.json', "utf8");
            const parsedContext = JSON.parse(context);
           
            const messages = parsedContext.choices[0]
            console.log(colors.green, "parsedContextSET", messages.message.content, colors.reset);
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
function createApiRequest(userPrompt, messagesString, isNew, isShort, contextData, setContext) {
    let profile = "default";
    let messages = [];
    if (isShort) {
        profile = "short";
    }
  
    PromptProfile.isLogging = true;
        messages = PromptProfile.getDefaultProfile(isNew, messagesString, contextData, userPrompt); // Load the array from the default file
    
    console.log(colors.green, "messages", JSON.stringify(messages, null, 4), colors.reset);
  


    return {
        model: "grok-2-latest",
        messages: messages, // Use the loaded variable here
    };
}

// Save response to files
async function saveResponses(completion, userPrompt, responseId, contextHistoryLength, depth) {
    //console.log("saving responses called");



    const content = completion.choices[0].message.content.replace(/\\n/g, '\n');
    console.log(colors.yellow, "\n\ncontent", colors.green, content, colors.reset);
    const [markdownContent, jsonContent] = content.split("@EOF@");
    console.log(colors.green, "markdownContent", colors.reset, markdownContent);
    console.log(colors.green, "jsonContent", colors.reset, jsonContent);

    let priorContextId = await saveContextFiles(responseId, jsonContent, completion, markdownContent, depth);
    await saveHtmlResponse(userPrompt, responseId, markdownContent, priorContextId);
    await saveMarkdownResponse(userPrompt, responseId, markdownContent);
    await savePreviousId(responseId, userPrompt, contextHistoryLength);
  
    
    // Open currentChat.html in the default browser
    const openCommand = os.platform() === 'win32' ? 'start' : 'open';
    exec(`${openCommand} ./grok/context/currentChat/currentChat.html`, (err) => {
        if (err) {
            console.error("Error opening the HTML file:", err);
        }
    });
}


async function saveHtmlResponse(userPrompt, responseId, markdownContent, priorContextId) {
    //let pwd = process.cwd();
    //console.log("pwd", pwd);
    // Save HTML response
    let indexHtml = await fs.readFile('./grok/template.html', "utf8");
    markdownContent =  markdownContent + "\ResponseID:" + responseId ;
    let sanitizedMarkdownContent = preprocessResponse(markdownContent);

    indexHtml = indexHtml.replaceAll("REPLACEME", sanitizedMarkdownContent);
    indexHtml = indexHtml.replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, 8));
    indexHtml = indexHtml.replaceAll("@DIRECTORY@", ""); // absolute path to the directory not compatible with firefox
    indexHtml = indexHtml.replaceAll("@CURRENT_ID@", responseId);
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
    console.log(logDivider);
    console.log(colors.green, "markdownContent",colors.reset, markdownContent);
    console.log(logDivider);
    // Save markdown response
    await fs.writeFile(
        `./grok/context/html/${userPrompt.replaceAll(" ", "_").replaceAll(":", "_").replaceAll("/", "_").replaceAll(".", "").substring(0, 40)}-${responseId}.md`,
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
        console.error("Error reading the old summary.json:", error);
    }
  
    await appendToContext(jsonContent, depth);
    await fs.writeFile("./grok/context/currentChat/summary.json", JSON.stringify(jsonContent));
    await fs.writeFile('./grok/context/currentChat/currentChat.json', JSON.stringify(completion));
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
        console.error("newContent is not a valid string:", newContent);
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

    console.log(logDivider);
    console.log(colors.green, "Current Subject:",colors.reset, newContent);
    console.log(logDivider);
    console.log(colors.green, "Current Context[",MAX_CONTEXT_LENGTH,"]:",colors.reset, contextData);
    console.log(logDivider);
    await fs.writeFile("./grok/context/context.data", contextData);

}

async function savePreviousId(responseId, userPrompt, contextHistoryLength){
    let previousId = await fs.readFile("./grok/context/context.history", "utf8");
    let parsedPreviousId = JSON.parse(previousId);
    parsedPreviousId.push({id: responseId, prompt: userPrompt});
    await fs.writeFile("./grok/context/context.history", JSON.stringify(parsedPreviousId));
    console.log(logDivider);
    console.log(colors.green, "\nPrevious Context", colors.reset);

    // Log only the last 3 context entries
    const EntriesToLog = parsedPreviousId.slice(-contextHistoryLength);
    EntriesToLog.forEach(element => {
        console.log(colors.green, "contextId:", colors.reset, element.id,  colors.yellow, "\n Prompt:\n",colors.reset, element.prompt);
        console.log(colors.reset, " - - - - - - - - - - - - - - - - - - - - -", colors.reset);
    });
    console.log(logDivider);
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

// Main function
async function main() {
    const { userPrompt, isShort, isNew, setContext, depth } = parseCommandLineArgs();
    let contextHistoryLength = depth/500;
    const messagesString = await getConversationContext(setContext, isNew); // Ensure context is fetched based on setContext
    
    console.log(colors.green, "PARSED MESSAGE STATUS", messagesString, colors.reset);
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");
  
 
    setContext ? console.log(colors.green, "\ncontextID:",colors.reset, setContext,"\n") : console.log(colors.green, "\n", colors.reset); // Log the setContext for debugging
    console.log("*---------------------*")
    const finalRequest = createApiRequest(userPrompt, messagesString, isNew, isShort, contextData, setContext);
    const completion = await openai.chat.completions.create(finalRequest);
    const responseId = completion.id.substring(0, 8);

    await saveResponses(completion, userPrompt, responseId, contextHistoryLength, depth);
    console.log( "current contextId", colors.blue, responseId, colors.reset);
    console.log(logDivider);

    //TODO harded code price function should be dynamic for differnt models.
    const INPUT_TOKEN_PRICE = 200/1000000;
    const OUTPUT_TOKEN_PRICE = 1000/1000000;
    const totalPrice = (completion.usage.prompt_tokens * INPUT_TOKEN_PRICE) + (completion.usage.completion_tokens * OUTPUT_TOKEN_PRICE);
    console.log(colors.green, "Tokens used", colors.yellow, "prompt:", colors.reset, completion.usage.prompt_tokens, colors.yellow, "completion:", colors.reset, completion.usage.completion_tokens, colors.reset);
    console.log(colors.green, "Aprox price of prompt", colors.yellow, totalPrice, colors.reset, "cents ");
    //write settings to ../.grokRuntime
    await fs.writeFile(".grokRuntime", `depthState=${depth}\nnewState=""\nsetContextState=${responseId}`);
    return responseId;

}

main().catch(console.error);


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