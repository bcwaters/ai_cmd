# Data Structures in JavaScript

Here is a list of common data structures you can use in JavaScript:

1. **Arrays**
   - Ordered lists of values, indexed by integers starting at 0.
   - Example: `let fruits = ['apple', 'banana', 'orange'];`

2. **Objects**
   - Collections of key-value pairs, where keys are strings or symbols.
   - Example: `let person = {name: 'John', age: 30};`

3. **Sets**
   - Collections of unique values, without any particular order.
   - Example: `let uniqueNumbers = new Set([1, 2, 3, 3, 4]);`

4. **Maps**
   - Collections of key-value pairs where keys can be any value (including objects).
   - Example: `let userRoles = new Map([['user1', 'admin'], ['user2', 'user']]);`

5. **Stacks**
   - Last-In-First-Out (LIFO) data structure, often implemented using arrays.
   - Example: 
     ```javascript
     let stack = [];
     stack.push('item1');
     stack.push('item2');
     let lastItem = stack.pop();
     ```

6. **Queues**
   - First-In-First-Out (FIFO) data structure, can be implemented using arrays or a dedicated `Queue` class.
   - Example:
     ```javascript
     let queue = [];
     queue.push('item1');
     queue.push('item2');
     let firstItem = queue.shift();
     ```

7. **Linked Lists**
   - Linear data structures where elements are stored in nodes connected by pointers.
   - Example:
     ```javascript
     class Node {
       constructor(data) {
         this.data = data;
         this.next = null;
       }
     }
     let head = new Node(1);
     head.next = new Node(2);
     ```

8. **Trees**
   - Hierarchical data structures with a root node and subtrees of children nodes.
   - Example:
     ```javascript
     class TreeNode {
       constructor(value) {
         this.value = value;
         this.children = [];
       }
       addChild(child) {
         this.children.push(child);
       }
     }
     let root = new TreeNode('A');
     let childB = new TreeNode('B');
     root.addChild(childB);
     ```

9. **Graphs**
   - Non-linear data structures consisting of nodes and edges.
   - Example:
     ```javascript
     class Graph {
       constructor() {
         this.nodes = new Map();
       }
       addNode(node) {
         this.nodes.set(node, []);
       }
       addEdge(node1, node2) {
         this.nodes.get(node1).push(node2);
         this.nodes.get(node2).push(node1);
       }
     }
     let graph = new Graph();
     graph.addNode('A');
     graph.addNode('B');
     graph.addEdge('A', 'B');
     ```

10. **Heaps**
    - Specialized tree-based data structures that satisfy the heap property.
    - Example:
      ```javascript
      class MaxHeap {
        constructor() {
          this.heap = [];
        }
        insert(value) {
          this.heap.push(value);
          this.bubbleUp();
        }
        bubbleUp() {
          let index = this.heap.length - 1;
          while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex] >= this.heap[index]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
          }
        }
      }
      let maxHeap = new MaxHeap();
      maxHeap.insert(3);
      maxHeap.insert(1);
      maxHeap.insert(4);
      ```

These data structures form the foundation for many algorithms and applications in JavaScript programming.

