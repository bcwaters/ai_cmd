To find a suitable Highlight.js package for use as a browser script, you can follow these steps:

1. **Visit the Highlight.js Website:**
   Go to the official Highlight.js website at [https://highlightjs.org/](https://highlightjs.org/). This site provides all the necessary resources for downloading and using Highlight.js.

2. **Download the Package:**
   On the Highlight.js website, you can download the latest version of the library. There are several options available:
   - **Full Version:** This includes all language support and is suitable if you need to highlight code in multiple languages.
   - **Common Version:** This includes support for the most common languages and is a good choice if you want a smaller file size but still need broad language support.
   - **Custom Build:** You can create a custom build with only the languages you need, which is ideal for minimizing the file size.

   For a browser script, you can download the `.js` file directly. For example, you might download `highlight.min.js` or a custom build like `highlight.pack.js`.

3. **Include in Your HTML:**
   Once you have downloaded the appropriate `.js` file, you can include it in your HTML file using a `<script>` tag. Here's an example:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Highlight.js Example</title>
       <script src="path/to/highlight.min.js"></script>
       <link rel="stylesheet" href="path/to/styles/default.css">
   </head>
   <body>
       <pre><code class="language-javascript">
           function helloWorld() {
               console.log("Hello, World!");
           }
       </code></pre>
       <script>hljs.highlightAll();</script>
   </body>
   </html>
   ```

   Make sure to replace `path/to/highlight.min.js` and `path/to/styles/default.css` with the actual paths to your Highlight.js script and stylesheet.

4. **Initialize Highlight.js:**
   After including the script, you need to initialize Highlight.js to highlight your code blocks. The simplest way is to call `hljs.highlightAll()` after the DOM is ready, as shown in the example above.

5. **Customization:**
   Highlight.js offers various themes and styles. You can choose one that matches your site's design. Download the corresponding CSS file and include it in your HTML as shown in the example.

By following these steps, you should be able to successfully integrate Highlight.js into your web page and start highlighting your code blocks.

