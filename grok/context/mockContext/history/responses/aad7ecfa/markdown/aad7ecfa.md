To create a regular expression that ensures a string starts with either a character or a number but not with a quote, we can use the following pattern:

```regex
^[a-zA-Z0-9]
```

Here's a breakdown of the pattern:

- `^` asserts the position at the start of the string.
- `[a-zA-Z0-9]` matches any character that is a letter (lowercase or uppercase) or a digit.

This pattern will match any string that starts with a letter or a number, effectively excluding strings that start with a quote or any other character.

Example usage in JavaScript:

```javascript
let regex = /^[a-zA-Z0-9]/;
let testStrings = [
    "Hello world",  // Matches
    "123 Main St",  // Matches
    "\"Quoted\"",   // Does not match
    "!Exclamation", // Does not match
];

testStrings.forEach(str => {
    console.log(`${str} - ${regex.test(str)}`);
});
```

Output:
```
Hello world - true
123 Main St - true
"Quoted" - false
!Exclamation - false
```

This regex pattern ensures that the string starts with either a character or a number, as requested.