## Image Enhancement with TinyGrad

TinyGrad can be used for various image enhancement techniques. Here's an example of how to implement histogram equalization:

```python
import tinygrad as tg
import numpy as np
from PIL import Image

def histogram_equalization(image):
    # Convert image to grayscale
    gray = tg.tensor(image).mean(dim=2)
    
    # Calculate histogram
    hist, _ = np.histogram(gray.numpy().flatten(), 256, [0, 256])
    
    # Calculate cumulative distribution function
    cdf = hist.cumsum()
    cdf_normalized = cdf * hist.max() / cdf.max()
    
    # Apply histogram equalization
    img_equalized = cdf_normalized[gray.numpy().astype(np.uint8)]
    
    # Convert back to uint8
    img_equalized = (img_equalized * 255 / cdf_normalized.max()).astype(np.uint8)
    
    return Image.fromarray(img_equalized)

# Example usage
image = Image.open('path_to_image.jpg').convert('RGB')
enhanced_image = histogram_equalization(image)
enhanced_image.save('enhanced_image.jpg')
```

And here's how you can implement adaptive thresholding:

```python
import tinygrad as tg
import numpy as np
from PIL import Image

def adaptive_thresholding(image, block_size=35, c=10):
    # Convert image to grayscale
    gray = tg.tensor(image).mean(dim=2)
    gray_np = gray.numpy().astype(np.uint8)
    
    # Calculate the integral image
    s = gray_np.shape
    ii = np.zeros(s)
    ii[0, 0] = gray_np[0, 0]
    for i in range(1, s[0]):
        ii[i, 0] = ii[i-1, 0] + gray_np[i, 0]
    for j in range(1, s[1]):
        ii[0, j] = ii[0, j-1] + gray_np[0, j]
    for i in range(1, s[0]):
        for j in range(1, s[1]):
            ii[i, j] = ii[i-1, j] + ii[i, j-1] - ii[i-1, j-1] + gray_np[i, j]
    
    # Calculate the mean for each pixel
    half = block_size // 2
    thresh = np.zeros(s)
    for i in range(s[0]):
        for j in range(s[1]):
            y0, y1 = max(0, i-half), min(s[0], i+half+1)
            x0, x1 = max(0, j-half), min(s[1], j+half+1)
            count = (y1-y0) * (x1-x0)
            if count == 0:
                sum_ = 0
            else:
                sum_ = ii[y1-1, x1-1]
                if y0 > 0:
                    sum_ -= ii[y0-1, x1-1]
                if x0 > 0:
                    sum_ -= ii[y1-1, x0-1]
                if y0 > 0 and x0 > 0:
                    sum_ += ii[y0-1, x0-1]
            thresh[i, j] = sum_ / count
    
    # Apply thresholding
    binary = gray_np > (thresh - c)
    return Image.fromarray((binary * 255).astype(np.uint8))

# Example usage
image = Image.open('path_to_image.jpg').convert('RGB')
thresholded_image = adaptive_thresholding(image)
thresholded_image.save('thresholded_image.jpg')
```

