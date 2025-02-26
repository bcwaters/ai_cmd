Here's a succinct example of extending the `marked` library and creating a minified package:

### Extending `marked`

```javascript
const marked = require('marked');
const ClipboardJS = require('clipboard');

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
    const button = `<button class="copy-code" data-clipboard-text="${code}">Copy</button>`;
    return `<pre><code class="language-${language}">${code}</code>${button}</pre>`;
};

marked.setOptions({ renderer });

document.addEventListener('DOMContentLoaded', () => {
    new ClipboardJS('.copy-code').on('success', e => {
        console.log('Code copied!');
        e.clearSelection();
    });
});

module.exports = marked;
```

### Minifying with Webpack

**webpack.config.js:**

```javascript
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'marked-extended.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'markedExtended',
        libraryTarget: 'umd'
    },
    optimization: {
        minimizer: [new TerserPlugin()],
    },
};
```

**Usage:**

```html
<script src="dist/marked-extended.min.js"></script>
<script>
    const html = markedExtended('# Heading

```javascript
console.log("Hello, World!");
```');
    document.body.innerHTML = html;
</script>
```

This example demonstrates the core steps to extend `marked` and create a minified package using Webpack.

