// src/data/mockData.js

export const officialContests = [
    {
      id: 'oc-1',
      title: 'Weekly DSA Challenge #24',
      type: 'Algorithms',
      difficulty: 'Medium',
      startTime: new Date(Date.now() + 86400000 * 2), // In 2 days
      duration: 90, // in minutes
      participants: 1247,
      registered: false,
    },
    {
      id: 'oc-2',
      title: 'SQL Showdown: Advanced Queries',
      type: 'SQL',
      difficulty: 'Hard',
      startTime: new Date(Date.now() + 86400000 * 5), // In 5 days
      duration: 60,
      participants: 452,
      registered: true,
    },
    {
      id: 'oc-3',
      title: 'System Design Sunday',
      type: 'System Design',
      difficulty: 'Hard',
      startTime: new Date(Date.now() + 86400000 * 7), // In 7 days
      duration: 120,
      participants: 891,
      registered: false,
    },
  ];
  
  export const privateContests = [
    {
      id: 'pc-xyz789',
      title: "Alice's Birthday Coding Bash",
      host: 'Alice',
      startTime: new Date(Date.now() + 3600000 * 3), // In 3 hours
      status: 'Upcoming',
    },
  ];
  
  // This would be your full problem library in a real app
  export const problemBank = [
    { id: 'prob_1', title: 'Two Sum', topic: 'Algorithms', difficulty: 'Easy' },
    { id: 'prob_2', title: 'Validate Binary Search Tree', topic: 'Data Structures', difficulty: 'Medium' },
    { id: 'prob_3', title: 'N-th Tribonacci Number', topic: 'Algorithms', difficulty: 'Easy' },
    { id: 'prob_4', title: 'Longest Palindromic Substring', topic: 'Algorithms', difficulty: 'Medium' },
    { id: 'prob_5', title: 'Department Highest Salary', topic: 'SQL', difficulty: 'Medium' },
    { id: 'prob_6', title: 'Second Highest Salary', topic: 'SQL', difficulty: 'Easy' },
    { id: 'prob_7', title: 'Design a URL Shortener', topic: 'System Design', difficulty: 'Hard' },
    { id: 'prob_8', title: 'Design a Rate Limiter', topic: 'System Design', difficulty: 'Hard' },
    { id: 'prob_9', title: 'React Tic-Tac-Toe', topic: 'Frontend', difficulty: 'Easy' },
  ];