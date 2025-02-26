To get the image dimensions using Pillow, you can use the `size` attribute of the `Image` object. Here's how you can do it:

```python
from PIL import Image

# Open the image
image = Image.open(image_path)

# Get the dimensions of the image
width, height = image.size

print(f"Image width: {width}")
print(f"Image height: {height}")
```

This code snippet shows how to retrieve the width and height of an image using the Pillow library.

