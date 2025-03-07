To execute a JavaScript function when an option is selected from a dropdown, you can use the `change` event listener. Here's how you can do it:

### HTML Code Example
```html
<select id="myDropdown">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
    <option value="option4">Option 4</option>
</select>
```

### JavaScript Code Example
```javascript
// Get the dropdown element
var dropdown = document.getElementById('myDropdown');

// Add an event listener for the 'change' event
dropdown.addEventListener('change', function() {
    // This function will be executed when an option is selected
    var selectedOption = this.value;
    executeFunction(selectedOption);
});

// Example function to be executed
function executeFunction(selectedOption) {
    console.log('Selected option: ' + selectedOption);
    // Add your logic here based on the selected option
}
```

In this example, when a user selects an option from the dropdown, the `change` event is triggered, which calls the event listener function. This function then calls `executeFunction` with the value of the selected option. You can modify `executeFunction` to perform any action you need based on the selected option.

Is there anything else you'd like to know about handling dropdown selections or any other aspect of web development?

