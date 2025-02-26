Yes, you can use flood fill to fill the interior of objects in an image without preprocessing it, but the effectiveness depends on the image's characteristics. Here's how you can do it:

```python
from PIL import Image, ImageDraw

def flood_fill_interior(image_path, output_path):
    # Open the image
    image = Image.open(image_path).convert('L')  # Convert to grayscale
    draw = ImageDraw.Draw(image)

    # Get the image dimensions
    width, height = image.size

    # Start flood fill from the top-left corner (assuming it's background)
    draw.floodfill((0, 0), 255, thresh=50)

    # Invert the image to see filled interiors
    inverted_image = Image.eval(image, lambda x: 255 - x)

    # Save the result
    inverted_image.save(output_path)

# Example usage
flood_fill_interior('input_image.jpg', 'output_filled_image.jpg')
```

This script does the following:

1. Opens the image and converts it to grayscale.
2. Starts a flood fill from the top-left corner, assuming it's the background. The `thresh` parameter helps to fill only similar color regions.
3. Inverts the image to show the filled interiors.

The success of this method depends on:
- The contrast between the object interiors and the background.
- The complexity of the image (simple shapes work better).
- The starting point for flood fill (you might need to adjust if the top-left corner isn't background).

If you'd like to try this on your image, please upload it, and I can help you fine-tune the approach if needed.

