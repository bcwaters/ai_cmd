In TypeDoc, you can use TSDoc annotations to document your TypeScript code. Here are some commonly used annotations that TypeDoc recognizes and processes:

### Available TSDoc Annotations

- **@param** - Documents a parameter of a function or method.
  ```typescript
  /**
   * @param name The name of the user.
   */
  function greet(name: string): void;
  ```

- **@returns** - Documents the return value of a function or method.
  ```typescript
  /**
   * @returns The greeting message.
   */
  function greet(name: string): string;
  ```

- **@type** - Specifies the type of a variable, parameter, or property.
  ```typescript
  /**
   * @type {string}
   */
  let message: string;
  ```

- **@default** - Specifies the default value of a parameter or property.
  ```typescript
  /**
   * @default 'Hello'
   */
  function greet(name: string = 'Hello'): string;
  ```

- **@example** - Provides an example of how to use the documented item.
  ```typescript
  /**
   * @example
   * ```typescript
   * greet('Alice'); // Output: Hello, Alice!
   * ```
   */
  function greet(name: string): string;
  ```

- **@deprecated** - Marks an item as deprecated, indicating it should no longer be used.
  ```typescript
  /**
   * @deprecated Use `newGreet` instead.
   */
  function greet(name: string): string;
  ```

- **@see** - Provides a link to related documentation or external resources.
  ```typescript
  /**
   * @see {@link newGreet}
   */
  function greet(name: string): string;
  ```

- **@link** - Creates a link to another part of the documentation or external resources.
  ```typescript
  /**
   * For more information, see {@link newGreet}.
   */
  function greet(name: string): string;
  ```

- **@throws** - Documents the exceptions that a function or method might throw.
  ```typescript
  /**
   * @throws {Error} If the name is empty.
   */
  function greet(name: string): string;
  ```

- **@remarks** - Provides additional remarks or notes about the documented item.
  ```typescript
  /**
   * @remarks
   * This function can be used to greet users in a friendly manner.
   */
  function greet(name: string): string;
  ```

- **@public** - Indicates that the item should be included in the public API documentation.
  ```typescript
  /**
   * @public
   */
  function greet(name: string): string;
  ```

- **@private** - Indicates that the item should not be included in the public API documentation.
  ```typescript
  /**
   * @private
   */
  function greet(name: string): string;
  ```

- **@protected** - Indicates that the item should be included in the documentation but is intended for use within the class or its subclasses.
  ```typescript
  /**
   * @protected
   */
  function greet(name: string): string;
  ```

These annotations help in generating comprehensive and structured documentation using TypeDoc. You can use them within TSDoc comments to document your TypeScript code effectively.

---

