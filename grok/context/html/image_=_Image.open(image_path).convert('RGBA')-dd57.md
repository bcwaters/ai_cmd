To convert an image to RGBA mode directly upon opening, you can use the following code snippet:

```python
from PIL import Image

# Open the image file and convert it to RGBA mode
image = Image.open(image_path).convert('RGBA')

# Now 'image' is in RGBA mode and ready for further processing
```

This code opens an image file specified by `image_path` and immediately converts it to RGBA mode. This approach ensures that the image has an alpha channel from the start, which is useful for operations involving transparency.

