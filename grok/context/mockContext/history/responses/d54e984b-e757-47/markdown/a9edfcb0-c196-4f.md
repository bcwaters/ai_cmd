### Maps in JavaScript

**Detailed Description**:
Maps in JavaScript are collections of keyed data items, similar to objects, but with several key differences that make them more versatile. Unlike objects, Maps can use any value as a key, including objects, functions, and any primitive value. This flexibility is one of the main advantages of using Maps over objects.

**Key Features**:
- **Any Type as Key**: You can use any JavaScript value as a key, including objects and functions. This is particularly useful when you need to map complex data structures to values.
- **Order Preservation**: Maps maintain the insertion order of the key-value pairs. This means that when you iterate over a Map, the entries will be returned in the order they were added.
- **Size Property**: Maps have a `size` property that gives you the number of key-value pairs in the Map, making it easier to track the Map's length without having to iterate over it.

**Usage**:
Maps are particularly useful in scenarios where you need to associate data with keys that can't be used as object properties or when the order of entries is important. They are also beneficial in situations where you frequently need to add or remove key-value pairs, as Maps offer methods like `set()`, `get()`, `delete()`, and `has()` that are optimized for these operations.

**Methods**:
- **`set(key, value)`**: Adds a new key-value pair to the Map or updates the value if the key already exists.
- **`get(key)`**: Retrieves the value associated with the specified key. Returns `undefined` if the key does not exist.
- **`delete(key)`**: Removes the key-value pair associated with the specified key. Returns `true` if the key was found and removed, otherwise `false`.
- **`has(key)`**: Checks if a key exists in the Map. Returns `true` if the key is found, otherwise `false`.
- **`clear()`**: Removes all key-value pairs from the Map.
- **`keys()`**: Returns a new Iterator object that contains the keys for each element in the Map.
- **`values()`**: Returns a new Iterator object that contains the values for each element in the Map.
- **`entries()`**: Returns a new Iterator object that contains an array of `[key, value]` for each element in the Map.
- **`forEach(callbackFn[, thisArg])`**: Calls a function for each key-value pair in the Map.

**Example**:
```javascript
let map = new Map();
map.set('name', 'John');
map.set('age', 30);
map.set({}, 'An object as a key');

console.log(map.get('name')); // Output: John
console.log(map.has('age')); // Output: true
console.log(map.size); // Output: 3

for (let [key, value] of map) {
    console.log(`${key} => ${value}`);
}
```

This example demonstrates how to create a Map, add different types of keys, check for the existence of a key, and iterate over the Map's entries.

Would you like to explore specific use cases or advanced techniques with Maps in JavaScript?

