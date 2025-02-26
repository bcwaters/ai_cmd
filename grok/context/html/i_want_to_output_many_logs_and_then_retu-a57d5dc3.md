# Using `return` in JavaScript for Logging and Output

In JavaScript, when you're running a script in an environment like Node.js or Deno, the `return` statement in the main function of a script doesn't directly affect the output to `stdout`. Instead, `console.log` is used for outputting logs, and the `return` value of the main script isn't captured or displayed by default in the terminal.

To achieve your goal of outputting many logs and then processing a single word at the end, you can structure your JavaScript code as follows:

```javascript
// logAndReturn.js

function main() {
    // Output many logs
    console.log("First log message");
    console.log("Second log message");
    console.log("Third log message");

    // Return a single word
    return "result";
}

// Call the main function
const result = main();

// Log the returned value to stdout
console.log(result);
```

When you run this script using Node.js or Deno, the output in the terminal will include all the log messages followed by the returned word:

```bash
$ node logAndReturn.js
First log message
Second log message
Third log message
result
```

This approach allows you to log multiple messages and then output a single word at the end, which can be processed further if needed.

