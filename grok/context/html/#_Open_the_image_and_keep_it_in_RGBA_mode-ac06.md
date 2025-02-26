To open an image and keep it in RGBA mode, you can use the following code snippet:

```python
from PIL import Image

# Open the image file
image = Image.open('path_to_your_image.png')

# Ensure the image is in RGBA mode
if image.mode != 'RGBA':
    image = image.convert('RGBA')

# Now 'image' is in RGBA mode and ready for further processing
```

This code opens an image file, checks if it's already in RGBA mode, and if not, converts it to RGBA mode. This ensures that the image has an alpha channel, which is necessary for operations involving transparency.

