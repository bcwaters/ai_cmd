import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { main } from './grok/grok.js';

// Get current file's directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = 3002;

app.use(express.static('server_resources'));

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

app.get('/xterm', (req, res) => {
    res.sendFile(path.join(__dirname, 'server_resources', 'XTerm.html'), (err) => {
        if (err) {
            console.error('Error sending XTerm:', err);
            res.status(500).send('Error loading XTerm');
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

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Spawn grok.sh
  const grokProcess = spawn('bash', ['grok.sh'], {
    cwd: process.cwd(),
    env: { ...process.env, TERM: 'xterm-256color' },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  console.log('Grok process spawned with PID:', grokProcess.pid);
  
  // Handle process output
  grokProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Grok stdout:', output);
    
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(output);
        console.log('Sent stdout to client:', output.length, 'chars');
      } catch (error) {
        console.error('Error sending stdout:', error);
      }
    }
  });

  grokProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.log('Grok stderr:', output);
    
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(output);
        console.log('Sent stderr to client:', output.length, 'chars');
      } catch (error) {
        console.error('Error sending stderr:', error);
      }
    }
  });

  // Handle client input - This is where we write all input to the process
  ws.on('message', (data) => {
    console.log('Received from client:', data.toString());
    
    try {
      if (grokProcess.stdin.writable) {
        // Just write the data as-is - it should already have a newline
        grokProcess.stdin.write(data.toString());
        console.log('Successfully wrote to stdin');
      } else {
        console.log('grok process stdin not writable');
      }
    } catch (error) {
      console.error('Error writing to stdin:', error);
    }
  });

  grokProcess.on('error', (error) => {
    console.error('Grok process error:', error);
  });

  grokProcess.on('exit', (code, signal) => {
    console.log(`Grok process exited with code ${code} and signal ${signal}`);
    if (ws.readyState === ws.OPEN) {
      ws.close();
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    try {
      grokProcess.kill();
    } catch (error) {
      console.error('Error killing process:', error);
    }
  });
});

// Global error handler for uncaught Express errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
