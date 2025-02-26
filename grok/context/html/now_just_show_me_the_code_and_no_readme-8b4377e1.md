```python
import tinygrad.tensor as ts
import numpy as np
import matplotlib.pyplot as plt

def sobel_edge_detection_tinygrad(image):
    if len(image.shape) == 3:
        image = np.mean(image, axis=2).astype(np.float32)
    
    img_tensor = ts.Tensor(image)
    
    sobel_x = ts.Tensor(np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]).astype(np.float32))
    sobel_y = ts.Tensor(np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]).astype(np.float32))
    
    gx = ts.abs(img_tensor.conv2d(sobel_x))
    gy = ts.abs(img_tensor.conv2d(sobel_y))
    
    g = ts.sqrt(gx**2 + gy**2)
    
    g_np = g.numpy()
    
    g_normalized = (g_np / np.max(g_np) * 255).astype(np.uint8)
    
    threshold = 100
    edges = (g_normalized > threshold).astype(np.uint8) * 255
    
    return edges

# Example usage
image = plt.imread('path_to_image.jpg')
edges = sobel_edge_detection_tinygrad(image)
plt.imshow(edges, cmap='gray')
plt.show()
```
