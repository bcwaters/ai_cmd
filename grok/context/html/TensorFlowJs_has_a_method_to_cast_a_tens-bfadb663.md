# TensorFlow.js: Casting to uint8

In TensorFlow.js, the method used to cast a tensor to `uint8` is `tf.cast()`. This method can receive tensors of various data types and convert them to `uint8`. Here are the types that can be cast to `uint8`:

- **bool**: A boolean tensor can be cast to `uint8`. `true` will be converted to `1`, and `false` to `0`.
- **int32**: A 32-bit integer tensor can be cast to `uint8`. Values outside the range of 0 to 255 will be clipped to fit within this range.
- **float32**: A 32-bit floating-point tensor can be cast to `uint8`. Floating-point values will be rounded to the nearest integer and then clipped to the range of 0 to 255.

Here is an example of how you can use `tf.cast()` to convert a tensor to `uint8`:

```javascript
const tf = require('@tensorflow/tfjs');

// Create a float32 tensor
const floatTensor = tf.tensor([1.2, 2.7, 3.8]);

// Cast the tensor to uint8
const uint8Tensor = tf.cast(floatTensor, 'uint8');

// Print the result
uint8Tensor.print();
```

This code will output:

```
Tensor
    [[1, 3, 4],]
```

In this example, the values 1.2, 2.7, and 3.8 are rounded to the nearest integers and then cast to `uint8`.

Would you like to know more about other casting operations in TensorFlow.js or see more examples?

