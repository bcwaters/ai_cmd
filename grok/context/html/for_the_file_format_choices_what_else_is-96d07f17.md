Besides `cjs` (CommonJS), Rollup supports several other output formats. Here are the main ones:

- **es**: ECMAScript module format, suitable for modern JavaScript environments that support ES modules.
- **esm**: Alias for `es`, explicitly indicating ECMAScript module format.
- **umd**: Universal Module Definition, can be used in both CommonJS and AMD environments, as well as in the browser as a global variable.
- **amd**: Asynchronous Module Definition, used for environments that support AMD, like RequireJS.
- **iife**: Immediately Invoked Function Expression, suitable for inclusion in a `<script>` tag in a browser.
- **system**: SystemJS module format, used with SystemJS loader.

Here's how you might configure Rollup to output in multiple formats:

```javascript
export default {
  input: 'src/main.js',
  output: [
    {
      file: 'bundle.cjs.js',
      format: 'cjs'
    },
    {
      file: 'bundle.esm.js',
      format: 'es'
    },
    {
      file: 'bundle.umd.js',
      format: 'umd',
      name: 'MyBundle'
    },
    {
      file: 'bundle.iife.js',
      format: 'iife',
      name: 'MyBundle'
    }
  ]
};
```

In this configuration, Rollup will generate four different bundle files, each in a different format. Note that for `umd` and `iife` formats, you need to specify a `name` for the global variable that will be used in non-module environments.

