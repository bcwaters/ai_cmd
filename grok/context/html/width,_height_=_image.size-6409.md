To get the dimensions of an image using the Pillow library, you can use the `size` attribute of the `Image` object as shown in the code snippet below:

```python
from PIL import Image

# Open the image
image = Image.open(image_path)

# Get the dimensions of the image
width, height = image.size

print(f"Image width: {width}")
print(f"Image height: {height}")
```

This method is straightforward and efficient for retrieving the width and height of an image.

