Here are two common equations used for stochastic evaluation in neural networks:

### 1. Stochastic Gradient Descent (SGD) Update Rule

The update rule for weights in a neural network using Stochastic Gradient Descent can be expressed as:

\[ w_{new} = w_{old} - \eta \cdot 
abla J(w_{old}) \]

Where:
- \( w_{new} \) is the updated weight.
- \( w_{old} \) is the current weight.
- \( \eta \) is the learning rate.
- \( 
abla J(w_{old}) \) is the gradient of the loss function with respect to the weight.

### 2. Mini-batch Gradient Descent

Mini-batch gradient descent is a variation of SGD where the gradient is computed on a small subset of the data. The update rule is similar but calculated over a mini-batch:

\[ w_{new} = w_{old} - \eta \cdot \frac{1}{m} \sum_{i=1}^{m} 
abla J(w_{old}, x_i, y_i) \]

Where:
- \( m \) is the size of the mini-batch.
- \( 
abla J(w_{old}, x_i, y_i) \) is the gradient of the loss function with respect to the weight, calculated for each example \( (x_i, y_i) \) in the mini-batch.

Would you like to know more about how these equations are applied in practice or about other stochastic methods in neural networks?

