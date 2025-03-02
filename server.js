const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3002;
const { execSync } = require('child_process');
app.get('/', (req, res) => {
    // Parse query parameters
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).send('No prompt parameter provided: add ?prompt=PromptString');
    }

    try {
        // Execute the JavaScript code
        const result = execSync(`node ./grok/grok.js "hi grok this is a test prompt"`, { encoding: 'utf-8' });
  


        // Write the result to a file
        const outputPath = path.join(__dirname, 'chatResult.html');
        fs.writeFileSync(outputPath, result);

        // Send the file back to the client
        res.download(outputPath, 'chatResult.html', (err) => {
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
