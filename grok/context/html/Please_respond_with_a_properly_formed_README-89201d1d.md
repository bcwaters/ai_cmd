```markdown
# Download File with Custom Location and Filename

To specify a download location using plain JavaScript and HTML, create an HTML file with a download link and use JavaScript to dynamically set the download attribute. Here's a step-by-step guide:

1. **HTML Setup**: Create an HTML file with a link element that has an `id` for easy JavaScript manipulation.
2. **JavaScript Function**: Write a JavaScript function to set the `href` and `download` attributes of the link.
3. **Usage**: Call the function with the desired file URL and filename.

This approach allows you to control the download process and customize the filename of the downloaded file.

## Example

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download File</title>
</head>
<body>
    <a id="downloadLink" href="#" download>Download File</a>
    <script src="script.js"></script>
</body>
</html>
```

### JavaScript (script.js)

```javascript
// Function to set the download link
function setDownloadLink(url, filename) {
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = filename;
}

// Example usage
setDownloadLink('path/to/your/file.txt', 'custom_filename.txt');
```

In this example, the `setDownloadLink` function takes a URL and a filename. It then sets the `href` attribute of the link to the URL and the `download` attribute to the filename. This allows you to specify where the file will be downloaded from and what it will be named upon download.

To use this, you would replace `'path/to/your/file.txt'` with the actual path to the file you want to download, and `'custom_filename.txt'` with the desired filename for the downloaded file.

## Follow-up Questions

1. **How can I handle different file types in the download?**
2. **Is it possible to trigger the download automatically without user interaction?**
3. **How can I ensure the download link works across different browsers?**

