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
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Prompt Interface</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            textarea {
                width: 100%;
                height: 150px;
                margin-bottom: 10px;
                padding: 8px;
            }
            button {
                padding: 8px 16px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <h1>Enter Your Prompt</h1>
        <form action="/prompt" method="get">
            <textarea name="prompt" placeholder="Tell me about 3 applications of DAG for machine learning"></textarea>
            <button type="submit">Submit</button>
        </form>
        <p> The response will take a minute or so.  I have it set to do a branch request which sends your request, branches out on each subject in the response, and then returns a consolidated html.<br></br>
        Try a prompt like: "What are the benefits of static html pages"<br></br>
        or "What are some data structures in JS"<br></br>
        or "tell me about applied linear algebra in machine learning"<br></br>
        </p>

        <h2> this is way better in terminal mode, clone it and use it. </h2>
    </body>
    </html>
    `;
    res.send(html);
});

app.get('/prompt', (req, res) => {
    // Parse query parameters
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).send('No prompt parameter provided: add ?prompt=PromptString');
    }

    try {
        // Execute the JavaScript code
        const result = execSync(`node ./grok/grok.js --treeMode --new "${prompt}"`, { encoding: 'utf-8' });
  
        // Define the path to the HTML file
        const outputPath = path.join(__dirname, "./grok/context/currentChat/currentChat.html");
      
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
