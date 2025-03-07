To execute a script at the `onload` event in HTML, you have a few options depending on your specific needs and preferences. Below are the methods explained in detail:

### Using the `onload` Attribute in the `body` Tag

You can directly add an `onload` attribute to the `<body>` tag. This method is straightforward but less commonly used in modern web development due to separation of concerns.

```html
<body onload="yourFunction()">
    <!-- Your HTML content here -->
    <script>
        function yourFunction() {
            // Code to be executed on load
            console.log("Page loaded!");
        }
    </script>
</body>
```

### Using the `window.onload` Event

A more modern approach is to use the `window.onload` event, which allows you to separate your JavaScript from your HTML. This method is preferred for maintaining clean and modular code.

```html
<body>
    <!-- Your HTML content here -->
    <script>
        window.onload = function() {
            // Code to be executed on load
            console.log("Page loaded!");
        };
    </script>
</body>
```

### Using `DOMContentLoaded` Event

For more control over when the script runs, you can use the `DOMContentLoaded` event. This event fires when the initial HTML document has been completely loaded and parsed, without waiting for images, stylesheets, or subframes to finish loading.

```html
<body>
    <!-- Your HTML content here -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Code to be executed when the DOM is fully loaded
            console.log("DOM fully loaded and parsed");
        });
    </script>
</body>
```

### Using External JavaScript File

For larger projects, it's often better to keep your JavaScript in an external file. You can still use any of the above methods, but the script tag would reference an external file.

```html
<body>
    <!-- Your HTML content here -->
    <script src="your-script.js"></script>
</body>
```

In `your-script.js`:

```javascript
window.onload = function() {
    // Code to be executed on load
    console.log("Page loaded!");
};
```

### Recommendations

- **Separation of Concerns**: Use `window.onload` or `DOMContentLoaded` for better separation of HTML and JavaScript.
- **Modern Practices**: Prefer `DOMContentLoaded` if you need the script to run as soon as the DOM is ready, but before all resources are loaded.
- **External Files**: For larger projects, keep JavaScript in external files for better maintainability and organization.

Choose the method that best fits your project's needs and your development style.

