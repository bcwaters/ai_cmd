import express from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { main } from './grok/grok.js';
const app = express();
const port = 3002;



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    // Get the context query parameter (if provided)
    const context = req.query.context;
    if (context) {
        console.log("context", context);
    }
    // Serve the HTML file from server_resources directory
    res.sendFile(path.join(__dirname, 'server_resources', 'HomePage.html'));
    

});

app.get('/prompt', async (req, res) => {
    // Parse query parameters
    const { prompt, treeMode } = req.query;

    if (!prompt) {
        return res.status(400).send('No prompt parameter provided: add ?prompt=PromptString');
    }

    try {
        let isNew = "";
        let isContext = "";
        let isTreeMode = "";
        let additonalArgs = "terminalMode ";
        let treeMode = req.query.treeMode;
        if (treeMode == "true") {
            isTreeMode = "--treeMode";
        } else {
       
        }
        let context = req.query.context;
        if (context) {
            isContext = "--context " + context;
        }else{
            isNew = "--new";
        }
        let additonalArgsArray = additonalArgs.split(" ");
        // Execute the JavaScript code
        //const result = execSync(`node ./grok/grok.js terminalMode ${additonalArgs} PROMPT "${prompt}"`, { encoding: 'utf-8' });
        const result =await main(isNew, isContext, isTreeMode,"PROMPT", prompt);
        console.log("result", result);
        let history =  fs.readFileSync("./grok/context/context.history", 'utf8', (err, data) => {
            
            return data;
        });
    
        history = JSON.parse(history);
       // console.log("history length", history.length);
       //console.log("history", history[history.length-1]);
       let responseId = history[history.length-1].id;
       console.log("responseId created and being returned:", responseId);
  
        // Define the path to the HTML file
        let outputPath = path.join(__dirname, "./grok/context/history/responses/"+responseId+"/html/"+responseId+".html");
        if (treeMode == "true") {
            outputPath = path.join(__dirname, "./grok/context/history/responses/"+responseId+"/tree/index.html");
        }
    
      
        // Send the HTML content to be displayed in the browser
        res.setHeader('Content-Type', 'text/html');
        res.status(200).sendFile(outputPath, (err) => {
            if (err) {
                res.status(500).send('Error sending file: ' + err.message);
            }
            // Note: Don't delete the file here if you need it for future requests
            // fs.unlinkSync(outputPath);
        });
    } catch (error) {
        res.status(500).send(`Error executing code: ${error.message}`);
    }
});

// Add a new endpoint to serve files from the history directory
app.use('/history', express.static(path.join(__dirname, './grok/context/history')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
