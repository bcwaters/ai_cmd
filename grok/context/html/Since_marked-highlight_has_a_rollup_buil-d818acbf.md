Yes, you can update the Rollup configuration to generate a minified version of your code. To achieve this, you'll need to use a Rollup plugin specifically designed for minification, such as `rollup-plugin-terser`.

Here's how you can modify your `rollup.config.js` to include minification:

```javascript
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    terser()
  ]
};
```

In this configuration, the `terser` plugin is added to the `plugins` array. When you run `rollup -c`, Rollup will bundle your code and minify it using Terser.

If you want to keep both a non-minified and a minified version of your bundle, you can specify multiple outputs in your configuration:

```javascript
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'bundle.js',
      format: 'cjs'
    },
    {
      file: 'bundle.min.js',
      format: 'cjs',
      plugins: [terser()]
    }
  ]
};
```

In this case, running `rollup -c` will create both `bundle.js` (non-minified) and `bundle.min.js` (minified).

Remember to install the `rollup-plugin-terser` package if you haven't already:

```bash
npm install rollup-plugin-terser --save-dev
```

With these changes, you can generate a minified version of your code using Rollup.

