import express from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const app = express();
const port = 3002;



// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    // Serve the HTML file from server_resources directory
    res.sendFile(path.join(__dirname, 'server_resources', 'HomePage.html'));
});

app.get('/prompt',  (req, res) => {
    // Parse query parameters
    const { prompt, treeMode } = req.query;

    if (!prompt) {
        return res.status(400).send('No prompt parameter provided: add ?prompt=PromptString');
    }

    try {
        let additonalArgs = "";
        let treeMode = req.query.treeMode;
        if (treeMode == "true") {
            additonalArgs = " --treeMode";
        } else {
            additonalArgs = "";
        }

        // Execute the JavaScript code
        const result = execSync(`node ./grok/grok.js  --new  ${additonalArgs} PROMPT "${prompt}"`, { encoding: 'utf-8' });

        let history =  fs.readFileSync("./grok/context/context.history", 'utf8', (err, data) => {
            
            return data;
        });
    
        history = JSON.parse(history);
       // console.log("history length", history.length);
       //console.log("history", history[history.length-1]);
       let responseId = history[history.length-1].id;
       console.log("responseId created and being returned:", responseId);
  
        // Define the path to the HTML file
        const outputPath = path.join(__dirname, "./grok/context/history/responses/"+responseId+"/html/"+responseId+".html");
    
      
        // Send the HTML content to be displayed in the browser
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(outputPath, (err) => {
            if (err) {
                res.status(500).send('Error sending file');
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
