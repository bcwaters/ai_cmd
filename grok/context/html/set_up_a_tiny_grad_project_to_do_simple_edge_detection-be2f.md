To set up a tiny grad project for simple edge detection, we can expand on the initial setup by implementing a basic edge detection algorithm. Let's use the Canny edge detection method, which is widely used and effective for this purpose.

### Step 2: Implement Canny Edge Detection

After converting the image to grayscale, we can apply the Canny edge detection algorithm. Here's how you can do it:

```python
# Apply Canny edge detection
edges = cv2.Canny(gray_image, 100, 200)

# Display the original image and the edges
cv2.imshow('Original Image', image_array)
cv2.imshow('Edge Image', edges)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Optionally, save the edge image
cv2.imwrite('edge_image.jpg', edges)
```

In this step, we use the `cv2.Canny` function to detect edges. The parameters `100` and `200` are the lower and upper thresholds for edge detection, which you can adjust based on your image.

### Step 3: Background Removal (Optional)

If you want to remove the background after edge detection, you can use the edges to create a mask and apply it to the original image. Here's a simple way to do it:

```python
# Create a mask from the edges
mask = np.zeros(image_array.shape[:2], dtype="uint8")
cv2.drawContours(mask, cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], -1, 255, -1)

# Apply the mask to the original image
result = cv2.bitwise_and(image_array, image_array, mask=mask)

# Display the result
cv2.imshow('Background Removed', result)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Save the result
cv2.imwrite('background_removed.jpg', result)
```

This step creates a mask from the detected edges, applies it to the original image to remove the background, and displays the result.

### Full Code for Tiny Grad Project

Here's the complete code combining all steps:

```python
from PIL import Image
import cv2
import numpy as np

# Load the image
image_path = 'path_to_your_image.jpg'
image = Image.open(image_path)
image_array = np.array(image)

# Convert the image to grayscale for edge detection
gray_image = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)

# Apply Canny edge detection
edges = cv2.Canny(gray_image, 100, 200)

# Display the original image and the edges
cv2.imshow('Original Image', image_array)
cv2.imshow('Edge Image', edges)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Optionally, save the edge image
cv2.imwrite('edge_image.jpg', edges)

# Create a mask from the edges
mask = np.zeros(image_array.shape[:2], dtype="uint8")
cv2.drawContours(mask, cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], -1, 255, -1)

# Apply the mask to the original image
result = cv2.bitwise_and(image_array, image_array, mask=mask)

# Display the result
cv2.imshow('Background Removed', result)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Save the result
cv2.imwrite('background_removed.jpg', result)
```

This code provides a complete tiny grad project for simple edge detection and optional background removal using Python, PIL, and OpenCV.

