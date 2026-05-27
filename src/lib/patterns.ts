export interface PatternInfo {
  description: string;
  howToIdentify: string[];
}

export const PATTERN_DESCRIPTIONS: Record<string, PatternInfo> = {
  'Two Pointers': {
    description: 'Use two pointers iterating from opposite ends or at different speeds to solve array/string problems in O(N) time without extra space.',
    howToIdentify: [
      'The input is an array or string.',
      'You need to find a set of elements (pairs, triplets) that satisfy a condition.',
      'The array is sorted (or can be sorted).',
    ]
  },
  'Sliding Window': {
    description: 'Maintain a window of elements (a subarray or substring) that expands and contracts to find optimal subarrays (longest, shortest, or target sum) in O(N) time.',
    howToIdentify: [
      'The problem involves a contiguous subarray or substring.',
      'You need to find a maximum, minimum, longest, shortest, or a specific target value.',
      'The window size can be fixed or dynamically changing.',
    ]
  },
  'Binary Search': {
    description: 'Repeatedly divide the search interval in half to find a target value in a sorted array or search space in O(log N) time.',
    howToIdentify: [
      'The input is sorted.',
      'You need to find a specific value or the first/last occurrence of a condition.',
      'The problem asks for an optimal value in a monotonic search space (e.g., minimum capacity, maximum distance).',
    ]
  },
  'Dynamic Programming': {
    description: 'Break down a complex problem into simpler overlapping subproblems, storing their results to avoid redundant computations.',
    howToIdentify: [
      'The problem asks for an optimal solution (max, min, longest, shortest).',
      'The problem asks for the total number of ways to do something.',
      'Decisions made at one step affect future steps (overlapping subproblems and optimal substructure).',
    ]
  },
  'Backtracking': {
    description: 'Incrementally build candidates to the solutions, and abandon a candidate ("backtrack") as soon as it determines that the candidate cannot possibly be a valid solution.',
    howToIdentify: [
      'You need to find all possible combinations, permutations, or subsets.',
      'The problem requires exploring all paths in a decision tree.',
      'Constraints are small enough to allow exponential or factorial time complexities.',
    ]
  },
  'Graphs': {
    description: 'Represent data as nodes and edges to model relationships. Use Traversal algorithms like BFS (for shortest paths on unweighted graphs) or DFS (for deep exploration or connected components).',
    howToIdentify: [
      'The problem involves nodes connected by edges (e.g., cities and roads, network of friends).',
      'You need to find the shortest path, detect cycles, or find connected components.',
      'The problem involves a 2D matrix where adjacent cells can be visited (implicit graph).',
    ]
  },
  'Trees': {
    description: 'A hierarchical data structure. Problems are often solved recursively using Pre-order, In-order, or Post-order traversals (DFS), or level-by-level traversals (BFS).',
    howToIdentify: [
      'The input is a binary tree, N-ary tree, or a BST.',
      'You need to process nodes hierarchically.',
      'The problem requires finding paths, depth, ancestors, or specific node relationships.',
    ]
  },
  'Linked List': {
    description: 'A sequence of nodes where each node points to the next. Common techniques include Two Pointers (fast & slow), reversing pointers, and dummy nodes.',
    howToIdentify: [
      'The input is a Singly or Doubly Linked List.',
      'You need to manipulate node connections in-place without using extra space.',
      'You need to find cycles, midpoints, or merge lists.',
    ]
  },
  'Stack': {
    description: 'A Last-In-First-Out (LIFO) data structure. Useful for tracking state, nested structures, or finding nearest smaller/greater elements (Monotonic Stack).',
    howToIdentify: [
      'You need to process elements in a Last-In-First-Out manner.',
      'The problem involves parsing strings with nested structures (e.g., parentheses).',
      'You need to find the next greater or smaller element in an array efficiently.',
    ]
  },
  'Queue': {
    description: 'A First-In-First-Out (FIFO) data structure. Essential for Breadth-First Search (BFS) and managing ordered streams of data.',
    howToIdentify: [
      'You need to process elements in the order they arrived.',
      'The problem involves traversing a graph or tree level by level.',
      'You need to find the shortest path in an unweighted graph.',
    ]
  },
  'Heap / Priority Queue': {
    description: 'A data structure that allows efficient retrieval of the maximum or minimum element. Useful for maintaining a running top K elements.',
    howToIdentify: [
      'The problem asks for the top K, Kth largest/smallest, or frequent elements.',
      'You need to repeatedly find and process the maximum or minimum element dynamically.',
      'The problem involves scheduling or merging sorted streams.',
    ]
  },
  'Greedy': {
    description: 'Make the locally optimal choice at each step with the hope of finding a global optimum. Often requires sorting or a priority queue.',
    howToIdentify: [
      'You need to maximize or minimize a value (like DP).',
      'Local optimal choices confidently lead to a global optimal solution.',
      'Counter-examples to the greedy choice are difficult to find.',
    ]
  },
  'Trie': {
    description: 'A tree-like data structure used to store a dynamic set or associative array where the keys are usually strings. Excellent for prefix matching.',
    howToIdentify: [
      'The problem involves storing and searching a large set of strings.',
      'You need to efficiently find prefixes or implement autocomplete.',
      'The problem involves word games or dictionary matching.',
    ]
  },
  'Hash Table': {
    description: 'Store key-value pairs for O(1) average time complexity lookups. Ideal for counting frequencies or finding complementary values.',
    howToIdentify: [
      'You need to look up elements or their indices in constant time.',
      'The problem involves counting frequencies or identifying duplicates.',
      'You need to map relationships between pairs of items.',
    ]
  }
};
