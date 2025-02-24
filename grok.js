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
    let userPrompt = "Default prompt if none provided";
    let isShort = false;
    let isNew = false;

    if (args.includes("--short")) {
        isShort = true;
        const promptIndex = args.indexOf("--short") + 1;
        if (promptIndex < args.length) {
            userPrompt = args.slice(promptIndex).join(" ");
        }
    } else if (args.includes("--new")) {
        isNew = true;
        const promptIndex = args.indexOf("--new") + 1;
        if (promptIndex < args.length) {
            userPrompt = args.slice(promptIndex).join(" ");
        }
    } else if (args.length > 0) {
        userPrompt = args.join(" ");
    }

    return { userPrompt, isShort, isNew };
}

// Read and parse the context file
async function getConversationContext() {
    try {
        const context = await fs.readFile('./grok/context/currentChat/currentChat.json', "utf8");
        const parsedContext = JSON.parse(context);
        const messages = parsedContext.choices[0].message;
        return JSON.stringify(messages.content) || "";
    } catch (error) {
        console.error("Error reading or processing the context file:", error);
        return "";
    }
}

// Create the request object for the API
function createApiRequest(userPrompt, messagesString, isNew, isShort, contextData) {
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
                        text: "This is the context of the conversation so far: " + (isNew ? "No prior context" : messagesString + contextData)
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
async function saveResponses(completion, userPrompt) {
    console.log("saving responses called");

    const responseId = completion.id.substring(0, 4);
    const fullResponseId = completion.id.substring(0, 8);
    const content = completion.choices[0].message.content.replace(/\\n/g, '\n');
    const [markdownContent, jsonContent] = content.split("@EOF@");
    //console.log("markdownContent", markdownContent);
    //console.log("jsonContent", jsonContent);

    await saveHtmlResponse(userPrompt, responseId, markdownContent);
    await saveMarkdownResponse(userPrompt, responseId, markdownContent);
    await saveContextFiles(fullResponseId, jsonContent, completion, markdownContent);
    
    // Open currentChat.html in the default browser
    const openCommand = os.platform() === 'win32' ? 'start' : 'open';
    exec(`${openCommand} ./grok/context/currentChat/currentChat.html`, (err) => {
        if (err) {
            console.error("Error opening the HTML file:", err);
        }
    });
}

async function saveHtmlResponse(userPrompt, responseId, markdownContent) {
    // Save HTML response
    let indexHtml = await fs.readFile('./template.html', "utf8");
    const sanitizedMarkdownContent = markdownContent
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '\\"')   // Escape double quotes
        .replace(/'/g, "\\'")   // Escape single quotes
        .replace(/\n/g, '\\n'); // Escape newlines

    indexHtml = indexHtml.replace("REPLACEME", sanitizedMarkdownContent);
    await fs.writeFile(
        `./grok/responses/${userPrompt.replaceAll(" ", "_")}-${responseId}.html`,
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
    // Save markdown response
    await fs.writeFile(
        `./grok/responses/${userPrompt.replaceAll(" ", "_")}-${responseId}.md`,
        markdownContent,
        "utf8"
    );
}

async function saveContextFiles(fullResponseId, jsonContent, completion, markdownContent) {
    // Save context files
    await moveContextFile(fullResponseId);

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
}

async function appendToContext(newContent, MAX_CONTEXT_LENGTH) {
    let contextData = await fs.readFile("./grok/context/context.data", "utf8");
    console.log("\n\nnewContent", newContent);
    let newContextDataKeywords = newContent.split(",");
    newContextDataKeywords.forEach(element => {
        contextData = contextData.replace(element, "");
    });
    contextData = contextData.replaceAll(",","");
    contextData =  newContent + contextData;
    contextData = contextData.replaceAll("KEYWORDS", "");
 
    contextData = contextData.substring(0, MAX_CONTEXT_LENGTH);
    contextData = contextData.replaceAll(/\\n/g, '').replaceAll(/\\/g, '').replaceAll(/"/g, '').replaceAll(/'/g, "").replaceAll(/\n/g, '').replaceAll(/` `/g, '');
    console.log("new contextData", contextData);
    await fs.writeFile("./grok/context/context.data", contextData);

}

async function moveContextFile(id) {
    await fs.copyFile(
        './grok/context/currentChat/currentChat.json',
        `./grok/context/history/${id}.json`
    );
}

async function main() {
    const { userPrompt, isShort, isNew } = parseCommandLineArgs();
    const messagesString = await getConversationContext();
    const contextData = await fs.readFile("./grok/context/context.data", "utf8");

   
    
    console.log("\n\nuserPrompt:", userPrompt);

    const finalRequest = createApiRequest(userPrompt, messagesString, isNew, isShort, contextData);
    const completion = await openai.chat.completions.create(finalRequest);
    


    await saveResponses(completion, userPrompt);
}

main().catch(console.error);