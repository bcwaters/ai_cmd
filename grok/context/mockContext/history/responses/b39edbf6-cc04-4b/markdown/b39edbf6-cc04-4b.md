# Express.js Coding Examples

Below are three coding examples that demonstrate the use of Express.js, a popular web application framework for Node.js.

### Example 1: Basic Server Setup

This example shows how to set up a basic Express server.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

### Example 2: Handling POST Requests

This example demonstrates how to handle POST requests and process form data.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const name = req.body.name;
  res.send(`Hello ${name}!`);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

### Example 3: Using Middleware

This example shows how to use middleware to log requests.

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

These examples provide a starting point for working with Express.js. You can expand on these to create more complex applications.

---

**Follow-up Questions:**
- Would you like to see examples of more advanced Express.js features?
- Are there specific functionalities in Express.js you're interested in learning more about?
- Do you need help integrating these examples into a larger project?

