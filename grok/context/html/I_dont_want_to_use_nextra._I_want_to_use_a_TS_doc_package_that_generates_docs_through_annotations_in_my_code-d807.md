If you're looking for a TypeScript documentation package that generates documentation through annotations in your code, you might consider using TypeDoc. TypeDoc is a documentation generator specifically designed for TypeScript projects. It reads TypeScript code and generates API documentation based on the comments and annotations in your code.

Here's how you can set up and use TypeDoc:

### Step 1: Installing TypeDoc

First, you need to install TypeDoc in your project. You can do this using npm:

```bash
npm install --save-dev typedoc
```

### Step 2: Configuring TypeDoc

TypeDoc can be configured using a `typedoc.json` file. Here's a basic configuration:

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "name": "My Project",
  "readme": "none"
}
```

### Step 3: Adding Annotations to Your Code

TypeDoc uses JSDoc-style comments to generate documentation. Here's an example of how you might annotate your TypeScript code:

```typescript
/**
 * A simple greeter function
 * @param name The name of the person to greet
 * @returns A greeting message
 */
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Step 4: Generating Documentation

To generate the documentation, you can use the following command:

```bash
npx typedoc
```

This will read your TypeScript files and generate HTML documentation in the `docs` directory specified in your `typedoc.json` configuration.

### Step 5: Viewing Your Documentation

After generating the documentation, you can view it by opening the `index.html` file in the `docs` directory in your web browser.

### Conclusion

TypeDoc is a powerful tool for generating documentation from TypeScript code annotations. It's easy to set up and use, and it provides a clean and professional-looking output for your project's API documentation.

