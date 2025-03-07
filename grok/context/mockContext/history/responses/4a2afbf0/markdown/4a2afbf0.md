To call a script using `window.onload` in HTML, you can use JavaScript to ensure that your script runs after the page has fully loaded. Here's how you can do it:

### Using Inline JavaScript

You can place the script directly within the HTML file, typically inside the `<head>` or `<body>` section, but it's recommended to place it just before the closing `</body>` tag for better performance.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <!-- Your content goes here -->

    <script>
        window.onload = function() {
            // Your code here
            console.log("The page has loaded!");
        };
    </script>
</body>
</html>
```

### Using an External JavaScript File

If you prefer to keep your JavaScript in a separate file, you can still use `window.onload` to run your script when the page loads. Here's how you can set it up:

#### HTML File

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <!-- Your content goes here -->

    <script src="your-script.js"></script>
</body>
</html>
```

#### JavaScript File (`your-script.js`)

```javascript
window.onload = function() {
    // Your code here
    console.log("The page has loaded!");
};
```

### Using `addEventListener`

A more modern approach is to use `addEventListener` which allows you to attach multiple event listeners to the `load` event without overwriting existing ones.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <!-- Your content goes here -->

    <script>
        window.addEventListener('load', function() {
            // Your code here
            console.log("The page has loaded!");
        });
    </script>
</body>
</html>
```

Or in an external JavaScript file:

```javascript
window.addEventListener('load', function() {
    // Your code here
    console.log("The page has loaded!");
});
```

Using `window.onload` or `addEventListener` with the `load` event ensures that your script runs only after all the page's resources, including images and stylesheets, have finished loading.

