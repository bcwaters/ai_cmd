import express from 'express';
import fs from 'fs';
import path from 'path';
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

    // Serve the HTML file from server_resources directory
    res.sendFile(path.join(__dirname, 'server_resources', 'HomePage.html'), (err) => {
        if (err) {
            console.error('Error sending home page:', err);
            res.status(500).send('Error loading home page');
        }
    });
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
        let additonalArgs = "terminalMode";
        let treeMode = req.query.treeMode;
        if (treeMode == "true") {
            isTreeMode = "--treeMode";
        }
        
        let context = req.query.context;
        if (context) {
            isContext = "--context " + context;
        } else {
            isNew = "--new";
        }
        // Execute the JavaScript code with proper error handling
        let result;
        try {
            result = await main(isNew, isContext, additonalArgs, isTreeMode, "PROMPT", prompt);
            console.log("result", result);
        } catch (mainError) {
            console.error("Error executing main function:", mainError);
            return res.status(500).send(`Error processing prompt: ${mainError.message}`);
        }

        // Define the path to the HTML file
        let outputPath =  "/history/responses/"+result+"/html/"+result+".html";
        if (treeMode == "true") {
            outputPath = "/history/responses/"+result+"/tree/index.html";
        }
    
   
      
        // Set X-Accel-Redirect to the internal path that NGINX should serve
        res.set("X-Accel-Redirect", outputPath);
        res.set("Content-Type", "text/html");
        res.status(200).end();
        return;
    } catch (error) {
        console.error("Unhandled error in /prompt endpoint:", error);
        res.status(500).send(`Error processing request: ${error.message}`);
    }
});

// Add a new endpoint to serve files from the history directory
app.use('/history', express.static(path.join(__dirname, './grok/context/history')));

// Global error handler for uncaught Express errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
