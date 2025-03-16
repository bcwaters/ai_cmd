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
    if (context) {
        console.log("context", context);
    }
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

        // Read and parse history file with error handling
        let history;
        try {
            const historyPath = "./grok/context/context.history";
            
            // Check if history file exists
            if (!fs.existsSync(historyPath)) {
                return res.status(500).send("History file not found");
            }
            
            const historyData = fs.readFileSync(historyPath, 'utf8');
            history = JSON.parse(historyData);
            
            // Validate history structure
            if (!Array.isArray(history) || history.length === 0) {
                return res.status(500).send("Invalid history data structure");
            }
        } catch (historyError) {
            console.error("Error reading or parsing history:", historyError);
            return res.status(500).send(`Error accessing history: ${historyError.message}`);
        }
       
        let responseId = history[history.length-1].id;
        console.log("responseId created and being returned:", responseId);
  
        // Define the path to the HTML file
        let outputPath = path.join(__dirname, "./grok/context/history/responses/"+responseId+"/html/"+responseId+".html");
        if (treeMode == "true") {
            outputPath = path.join(__dirname, "./grok/context/history/responses/"+responseId+"/tree/index.html");
        }
    
        // Check if the output file exists before sending
        if (!fs.existsSync(outputPath)) {
            return res.status(404).send(`Response file not found at ${outputPath}`);
        }
      
        // Send the HTML content to be displayed in the browser
        res.setHeader('Content-Type', 'text/html');
        res.status(200).sendFile(outputPath, (err) => {
            if (err) {
                console.error(`Error sending file ${outputPath}:`, err);
                res.status(500).send('Error sending file: ' + err.message);
            }
        });
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
