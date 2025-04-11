// save as generate_sprite.js
import OpenAI from 'openai';
import fs from 'fs';
import https from 'https';
import path from 'path';

// Replace with your actual API key
const API_KEY = "xai-69rV9iaIpiEcwpzmTDCLRxcwQw5jjAzPAHPsT7T0bJ1cYlWez7XbuvoxguksCnB2zpLipQD6vqmjfwlw";

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://api.x.ai/v1",
});

async function generateSpriteSheet() {
  try {
    console.log("Sending request to XAI API...");
    
    const response = await openai.images.generate({
      model: "grok-2-image",
      prompt: "A 16 panel sprite sheet. top row is walking up, 2nd right is walking right, 3rd row is walking left, bottom row is walking down. The character has short red hair with a dinosaur hat. Do this in a pixelated style. 16 panels only. NES style.  The background is transparent. Make it pixelated.  All panels are equally spaced apart. 4 panel per row.",
      response_format: "url",
      n: 2,
    });
    
    // Save the full response to a file
    const responseFile = "sprite_sheet_response.json";
    fs.writeFileSync(responseFile, JSON.stringify(response, null, 2));
    console.log(`API response saved to ${responseFile}`);
    
    // Display URLs
    console.log("Generated image URLs:");
    response.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.url}`);
    });
    
    // Download the images
    await downloadImages(response.data);
    
  } catch (error) {
    console.error("Error generating images:", error);
    if (error.response) {
      console.error("API error details:", error.response.data);
    }
  }
}

async function downloadImages(data) {
  // Create directory if it doesn't exist
  const outputDir = "sprite_images";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  console.log("Downloading images...");
  
  // Download each image
  const downloadPromises = data.map((item, index) => {
    return new Promise((resolve, reject) => {
      const fileName = path.join(outputDir, `sprite_sheet_${index + 1}.png`);
      const file = fs.createWriteStream(fileName);
      
      https.get(item.url, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${fileName}`);
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(fileName); // Delete the file if download failed
        console.error(`Error downloading image ${index + 1}:`, err.message);
        reject(err);
      });
    });
  });
  
  await Promise.all(downloadPromises);
  console.log("All images downloaded successfully!");
}

// Run the function
generateSpriteSheet();