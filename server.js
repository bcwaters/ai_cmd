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
    // Parse query parameters
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).send('No prompt parameter provided: add ?prompt=PromptString');
    }

    try {
        // Execute the JavaScript code
        const result = execSync(`node ./grok/grok.js "${prompt}"`, { encoding: 'utf-8' });
  
        // Write the result to a file
        const outputPath = path.join(__dirname, 'chatResult.html');
        fs.copyFileSync(path.join("./grok/context/currentChat/currentChat.html"), outputPath);
        fs.writeFileSync(outputPath, result);

        // Send the HTML content to be displayed in the browser
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(outputPath, (err) => {
            if (err) {
                res.status(500).send('Error sending file');
            }
            // Remove the file after it's sent
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        res.status(500).send(`Error executing code: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
