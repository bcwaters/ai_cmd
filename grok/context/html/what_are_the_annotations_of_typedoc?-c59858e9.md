TypeDoc supports various annotations through TSDoc comments, which are used to document TypeScript code. These annotations help in generating comprehensive documentation. Here are the key TSDoc annotations used in TypeDoc:

### Basic TSDoc Tags

- **`@param`**: Documents a parameter of a function or method.
  ```typescript
  /**
   * @param name - The name of the user.
   */
  function greet(name: string) {}
  ```

- **`@returns`**: Documents the return value of a function or method.
  ```typescript
  /**
   * @returns The greeting message.
   */
  function greet(name: string): string {}
  ```

- **`@throws`**: Documents an error that might be thrown by a function or method.
  ```typescript
  /**
   * @throws {Error} If the name is not provided.
   */
  function greet(name: string) {}
  ```

### Advanced TSDoc Tags

- **`@example`**: Provides an example of how to use the documented item.
  ```typescript
  /**
   * @example
   * ```ts
   * greet('Alice'); // Outputs: Hello, Alice!
   * ```
   */
  function greet(name: string) {}
  ```

- **`@remarks`**: Adds additional remarks or notes about the documented item.
  ```typescript
  /**
   * @remarks
   * This function can be used to greet any person by name.
   */
  function greet(name: string) {}
  ```

- **`@see`**: Provides a reference to related documentation or external resources.
  ```typescript
  /**
   * @see {@link https://example.com/greetings|More about greetings}
   */
  function greet(name: string) {}
  ```

### TypeDoc-Specific Tags

- **`@category`**: Groups related items into categories in the generated documentation.
  ```typescript
  /**
   * @category Utility Functions
   */
  function greet(name: string) {}
  ```

- **`@packageDocumentation`**: Indicates that the comment is for the entire package, not just a single item.
  ```typescript
  /**
   * @packageDocumentation
   * This package contains utility functions for greetings.
   */
  ```

- **`@module`**: Specifies the module name for the documented item.
  ```typescript
  /**
   * @module greetings
   */
  function greet(name: string) {}
  ```

### Other Useful Tags

- **`@deprecated`**: Marks an item as deprecated.
  ```typescript
  /**
   * @deprecated Use `newGreet` instead.
   */
  function greet(name: string) {}
  ```

- **`@internal`**: Marks an item as internal, which can be excluded from the public documentation.
  ```typescript
  /**
   * @internal
   */
  function internalFunction() {}
  ```

These annotations allow you to create detailed and structured documentation that TypeDoc can parse and display in an organized manner. By using these tags, you can enhance the readability and usability of your project's documentation.

---

