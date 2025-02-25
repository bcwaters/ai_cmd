import OpenAI from "openai";
import dotenv from "dotenv"
import fs from 'fs/promises'
import { exec } from 'child_process'
import os from 'os'
import { json } from "stream/consumers";

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
    let isShort = false;
    let isNew = false;
    let setContext = "";

    if (args.includes("--short")) {
        isShort = true;
        const promptIndex = args.indexOf("--short") + 1;
        if (promptIndex < args.length) {
            userPrompt = args.slice(promptIndex).join(" ");
        }
    } if (args.includes("--new")) {
        isNew = true;
        const promptIndex = args.indexOf("--new") + 1;
        if (promptIndex < args.length) {
            userPrompt = args.slice(promptIndex).join(" ");
        }
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

    return { userPrompt, isShort, isNew, setContext };
}

// Read and parse the context file
async function getConversationContext(setContext) {
    try {
       
        if (setContext == "") {
            const context = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
            const parsedContext = JSON.parse(context);
            const messages = parsedContext.choices[0].message;
            return JSON.stringify(messages.content) || "";
        } else {
      
            const context = await fs.readFile('./grok/context/history/' + setContext + '.json', "utf8");
            const parsedContext = JSON.parse(context);
            const messages = parsedContext.choices[0].message;
            return JSON.stringify(messages.content) || "";
        }
    } catch (error) {
        console.error("Error reading or processing the context file:", error);
        return "";
    }
}

// Create the request object for the API
function createApiRequest(userPrompt, messagesString, isNew, isShort, contextData, setContext) {
    return {
        model: "grok-2-latest",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: "You are a helpful assistant that wants to help me write code.  All answers should be in markdown format.  "
                    },
                    {
                        type: "text",
                        text: "Context of the conversation so far: " + (isNew ? "This is the beginning of the conversation. after answering the question suggest a few follow up questions." : messagesString + contextData)
                    },
                    {
                        type: "text",
                        text: "there will be a separate response indicated by @EOF@ so response.split(@EOF@)[1] should return the other resonse`"
                    },
                    {
                        type: "text",
                        text: "the seperate response will be  500 characters max and 400 character min. it will be a list of keywords which capture the key information provided. SEO style  READMEDOC@EOF@KEYWORDS}"
                    },
                    {
                        type: "text",
                        text: "Remember to include an @EOF@ in the response.  It should be after the readme section and before the keywords"
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userPrompt,
                    },
                ],
            },
        ],
    };
}

// Save response to files
async function saveResponses(completion, userPrompt, responseId) {
    //console.log("saving responses called");


    const fullResponseId = completion.id.substring(0, 8);
    responseId = fullResponseId;
    const content = completion.choices[0].message.content.replace(/\\n/g, '\n');
    const [markdownContent, jsonContent] = content.split("@EOF@");
    //console.log("markdownContent", markdownContent);
    //console.log("jsonContent", jsonContent);

    let priorContextId = await saveContextFiles(fullResponseId, jsonContent, completion, markdownContent);
    await saveHtmlResponse(userPrompt, fullResponseId, markdownContent, priorContextId);
    await saveMarkdownResponse(userPrompt, responseId, markdownContent);

  
    
    // Open currentChat.html in the default browser
    const openCommand = os.platform() === 'win32' ? 'start' : 'open';
    exec(`${openCommand} ./grok/context/currentChat/${fullResponseId}.html`, (err) => {
        if (err) {
            console.error("Error opening the HTML file:", err);
        }
    });
}

async function saveHtmlResponse(userPrompt, responseId, markdownContent, priorContextId) {
    //let pwd = process.cwd();
    //console.log("pwd", pwd);
    // Save HTML response
    let indexHtml = await fs.readFile('./template.html', "utf8");
    markdownContent =  markdownContent + "\ResponseID:" + responseId ;
    let sanitizedMarkdownContent = markdownContent
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '\\"')   // Escape double quotes
        .replace(/'/g, "\\'")   // Escape single quotes
        .replace(/\n/g, '\\n'); // Escape newlines


    indexHtml = indexHtml.replace("REPLACEME", sanitizedMarkdownContent);
    indexHtml = indexHtml.replaceAll("@PREVIOUS_ID@", priorContextId.substring(0, 8));
    indexHtml = indexHtml.replaceAll("@DIRECTORY@", ""); // absolute path to the directory not compatible with firefox
    indexHtml = indexHtml.replaceAll("@CURRENT_ID@", responseId);
    await fs.writeFile(
        `./grok/context/responses/${responseId}.html`,
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

    console.log("saved html response", indexHtml);

}

async function saveMarkdownResponse(userPrompt, responseId, markdownContent) {
    // Save markdown response
    await fs.writeFile(
        `./grok/context/responses/${userPrompt.replaceAll(" ", "_").replaceAll(":", "_").replaceAll("/", "_").replaceAll(".", "")}-${responseId}.md`,
        markdownContent,
        "utf8"
    );
}

async function saveContextFiles(fullResponseId, jsonContent, completion, markdownContent) {
    // Save context files
    let priorContextId = await moveContextFile();

    // Load the old summary.json into memory
    let oldSummaryContent = "";
    try {
        oldSummaryContent = await fs.readFile("./grok/context/currentChat/summary.json", "utf8");
     

    } catch (error) {
        console.error("Error reading the old summary.json:", error);
    }
  
    await appendToContext(jsonContent, 1000);
    await fs.writeFile("./grok/context/currentChat/summary.json", JSON.stringify(jsonContent));
    await fs.writeFile('./grok/context/currentChat/currentChat.json', JSON.stringify(completion));
    await fs.writeFile(
        `./grok/context/fullCompletion/${fullResponseId}.json`,
        markdownContent,
        "utf8"
    );
    return priorContextId;
}

async function appendToContext(newContent, MAX_CONTEXT_LENGTH) {
    let contextData = await fs.readFile("./grok/context/context.data", "utf8");
    //console.log("\n\nnewContent", newContent);
    let newContextDataKeywords = newContent.split(",");
    newContextDataKeywords.forEach(element => {
        contextData = contextData.replace(element, "");
    });
    contextData = contextData.replaceAll(",","");
    contextData =  newContent + contextData;
    contextData = contextData.replaceAll("KEYWORDS", "");
 
    contextData = contextData.substring(0, MAX_CONTEXT_LENGTH);
    contextData = contextData.replaceAll(/\\n/g, '').replaceAll(/\\/g, '').replaceAll(/"/g, '').replaceAll(/'/g, "").replaceAll(/\n/g, '').replaceAll(/` `/g, '');

    await fs.writeFile("./grok/context/context.data", contextData);

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
    const { userPrompt, isShort, isNew, setContext } = parseCommandLineArgs();
    const messagesString = await getConversationContext(setContext); // Ensure context is fetched based on setContext
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");

    console.log("\n\nuserPrompt:", userPrompt);
    setContext ? console.log("context:", setContext,"\n") : console.log("\n"); // Log the setContext for debugging

    const finalRequest = createApiRequest(userPrompt, messagesString, isNew, isShort, contextData, setContext);
    const completion = await openai.chat.completions.create(finalRequest);
    const responseId = completion.id.substring(0, 4);

    await saveResponses(completion, userPrompt, responseId);
}

main().catch(console.error);