### What is Rollup?

Rollup is a module bundler for JavaScript, primarily used to bundle ES6 modules into a single file that can be used in browsers or other environments that do not support ES6 modules natively. It is not a code compiler, but rather a tool that helps in organizing and optimizing your JavaScript code for deployment.

### Key Features of Rollup

- **Tree Shaking:** Rollup can perform tree shaking, which means it can remove unused code from your final bundle, resulting in smaller file sizes.
- **ES6 Module Support:** It is designed to work with ES6 module syntax, making it easier to write modular code.
- **Plugins:** Rollup has a rich ecosystem of plugins that can be used to extend its functionality, such as minification, transpilation, and more.

### The `-c` Flag in Rollup

The `-c` flag in Rollup is used to specify a configuration file. When you run `rollup -c`, Rollup will look for a file named `rollup.config.js` in the current directory and use the configuration defined in that file to bundle your code.

Here is an example of a basic `rollup.config.js`:

```javascript
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
};
```

In this configuration, Rollup will take `src/main.js` as the entry point and create a CommonJS bundle named `bundle.js`.

### Usage Example

To use Rollup with the `-c` flag, you would run:

```bash
rollup -c
```

This command will bundle your code according to the configuration specified in `rollup.config.js`.

If you need further assistance or have more questions about Rollup, feel free to ask!

