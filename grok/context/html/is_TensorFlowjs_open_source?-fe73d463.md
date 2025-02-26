Yes, TensorFlow.js is open source. It is developed and maintained by Google and the TensorFlow community, and its source code is available on GitHub under the Apache License 2.0.

Here's a brief overview of how you can use TensorFlow.js in your projects:

```javascript
// Import TensorFlow.js
import * as tf from '@tensorflow/tfjs';

// Create a simple model
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// Compile the model
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Train the model
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);
await model.fit(xs, ys, {epochs: 10});

// Use the model to make a prediction
const prediction = model.predict(tf.tensor2d([5], [1, 1]));
console.log('Prediction:', prediction.dataSync()[0]);
```

This example demonstrates how to create, train, and use a simple linear regression model with TensorFlow.js.

