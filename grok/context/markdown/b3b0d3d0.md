# TensorFlow.js Flood Fill for Detecting Trapped Transparent Regions

This project demonstrates how to use TensorFlow.js to implement a flood fill algorithm for detecting and filling "trapped" transparent regions in images. The approach involves loading an image, preprocessing it, applying a flood fill algorithm, and then saving the result.

## Project Setup

### Prerequisites
- Node.js installed on your machine. Download from [Node.js official website](https://nodejs.org/en/download/).

### Project Initialization
1. Create a new directory for the project:
   ```bash
   mkdir tensorflow-js-floodfill
   cd tensorflow-js-floodfill
   ```
2. Initialize the project:
   ```bash
   npm init -y
   ```

### Dependencies
Install the required npm packages:
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-node sharp
```

## Implementation

Below is the full implementation in `index.js` for this project, with each major step encapsulated in a helper function for clarity:

```javascript
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const sharp = require('sharp');

// Helper function to load and preprocess the image
function loadAndPreprocessImage(imagePath) {
  return new Promise((resolve, reject) => {
    sharp(imagePath)
      .raw()
      .toBuffer((err, data, info) => {
        if (err) reject(err);
        const imageTensor = tf.tensor3d(data, [info.height, info.width, info.channels]);
        const normalizedImage = imageTensor.toFloat().div(tf.scalar(255));
        resolve({ normalizedImage, info });
      });
  });
}

// Helper function to implement flood fill
function floodFill(image, startX, startY, fillColor) {
  return tf.tidy(() => {
    const result = tf.zerosLike(image);
    const queue = [[startX, startY]];
    const targetColor = image.gather([startY]).gather([startX]).dataSync();
    const visited = tf.zeros([image.shape[0], image.shape[1]], 'bool');

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (x < 0 || x >= image.shape[1] || y < 0 || y >= image.shape[0] || visited.gather([y]).gather([x]).dataSync()[0]) {
        continue;
      }

      const currentColor = image.gather([y]).gather([x]).dataSync();
      if (currentColor.every((val, idx) => Math.abs(val - targetColor[idx]) < 0.01)) {
        result.gather([y]).gather([x]).assign(tf.tensor(fillColor));
        visited.gather([y]).gather([x]).assign(tf.scalar(true));

        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
    return result;
  });
}

// Helper function to detect trapped regions by painting the corners
function createMask(height, width) {
  const mask = tf.zeros([height, width, 1]);
  mask.slice([0, 0, 0], [1, width, 1]).fill(1); // Top-left corner
  mask.slice([0, width - 1, 0], [1, 1, 1]).fill(1); // Top-right corner
  mask.slice([height - 1, 0, 0], [1, width, 1]).fill(1); // Bottom-left corner
  mask.slice([height - 1, width - 1, 0], [1, 1, 1]).fill(1); // Bottom-right corner
  return mask;
}

// Helper function to apply flood fill starting from the corners
function fillTrappedRegions(normalizedImage) {
  const [height, width, channels] = normalizedImage.shape;
  const red = [1, 0, 0];
  let result = normalizedImage;

  result = floodFill(result, 0, 0, red); // Flood fill from top-left
  result = floodFill(result, width - 1, 0, red); // Flood fill from top-right
  result = floodFill(result, 0, height - 1, red); // Flood fill from bottom-left
  result = floodFill(result, width - 1, height - 1, red); // Flood fill from bottom-right

  return result;
}

// Helper function to combine the filled image with the original image using the mask
function combineImages(normalizedImage, filledImage, mask) {
  const [height, width, channels] = normalizedImage.shape;
  const maskExpanded = mask.expandDims(-1).tile([1, 1, channels]);
  return normalizedImage.mul(maskExpanded).add(filledImage.mul(maskExpanded.not()));
}

// Helper function to save the result as an image
function saveImage(imageTensor, info, outputPath) {
  return new Promise((resolve, reject) => {
    const resultBuffer = imageTensor.mul(255).cast('int32').data();
    sharp(resultBuffer, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
      .toFile(outputPath, (err, info) => {
        if (err) reject(err);
        resolve('Result saved as ' + outputPath);
      });
  });
}

// Main function to orchestrate the image processing
async function processImage(imagePath, outputPath) {
  try {
    const { normalizedImage, info } = await loadAndPreprocessImage(imagePath);
    const mask = createMask(info.height, info.width);
    const filledImage = fillTrappedRegions(normalizedImage);
    const finalImage = combineImages(normalizedImage, filledImage, mask);
    
    const result = await saveImage(finalImage, info, outputPath);
    console.log(result);

    // Clean up
    normalizedImage.dispose();
    mask.dispose();
    filledImage.dispose();
    finalImage.dispose();
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Run the main function
processImage('yourImage.png', 'result.png');
```

## Usage
To run the script, execute:
```bash
node index.js
```

Ensure `yourImage.png` is in the same directory as `index.js`. The script will output a new image named `result.png` with the trapped transparent regions filled.

## Notes
- The flood fill algorithm starts from the corners of the image to detect trapped regions.
- The color used to fill the trapped regions is red ([1, 0, 0]) in this example, but you can modify this to any color you prefer.
- Performance optimization might be needed for larger images or more complex scenarios.

This README provides a comprehensive guide to setting up and running the TensorFlow.js flood fill project for detecting and filling trapped transparent regions in images.

