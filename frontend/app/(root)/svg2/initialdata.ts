import { Topic } from "@/types/types";

export const initialTopicsData: Topic = {

    name: "JavaScript Basics",
    content: "Introduction to JavaScript",
    children: [
        {
            name: "Variables and Data Types",
            content: "Understanding variables and data types in JavaScript",
            children: [
                {
                    name: "Primitive Types",
                    content: "Detailed explanation of primitive types",
                    children: [
                        {
                            name: "String",
                            content: "Explanation and examples of strings",
                            children: [],
                        },
                        {
                            name: "Number",
                            content: "Explanation and examples of numbers",
                            children: [],
                        },
                        {
                            name: "Boolean",
                            content: "Explanation and examples of booleans",
                            children: [],
                        },
                        {
                            name: "Undefined",
                            content: "Explanation and examples of undefined",
                            children: [],
                        },
                        {
                            name: "Null",
                            content: "Explanation and examples of null",
                            children: [],
                        },
                        {
                            name: "Symbol",
                            content: "Explanation and examples of symbols",
                            children: [],
                        },
                        {
                            name: "BigInt",
                            content: "Explanation and examples of BigInt",
                            children: [],
                        },
                    ],
                },
                {
                    name: "Reference Types",
                    content: "Detailed explanation of reference types",
                    children: [
                        {
                            name: "Objects",
                            content: "Explanation and examples of objects",
                            children: [],
                        },
                        {
                            name: "Arrays",
                            content: "Explanation and examples of arrays",
                            children: [],
                        },
                        {
                            name: "Functions",
                            content:
                                "Explanation and examples of functions as reference types",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            name: "Functions",
            content: "Introduction to functions in JavaScript",
            children: [
                {
                    name: "Function Declarations",
                    content: "Understanding function declarations",
                    children: [],
                },
                {
                    name: "Function Expressions",
                    content: "Understanding function expressions",
                    children: [],
                },
                {
                    name: "Arrow Functions",
                    content: "Understanding arrow functions",
                    children: [],
                },
                {
                    name: "Anonymous Functions",
                    content: "Understanding anonymous functions",
                    children: [],
                },
                {
                    name: "Callbacks",
                    content: "Understanding callbacks",
                    children: [],
                },
                {
                    name: "Higher-Order Functions",
                    content: "Understanding higher-order functions",
                    children: [],
                },
                {
                    name: "Closures",
                    content: "Understanding closures",
                    children: [],
                },
            ],
        },
        {
            name: "Control Flow",
            content: "Understanding control flow in JavaScript",
            children: [
                {
                    name: "Conditional Statements",
                    content:
                        "Explanation and examples of if, else, and switch statements",
                    children: [],
                },
                {
                    name: "Loops",
                    content:
                        "Explanation and examples of for, while, and do-while loops",
                    children: [],
                },
                {
                    name: "Break and Continue",
                    content:
                        "Explanation and examples of break and continue statements",
                    children: [],
                },
            ],
        },
        {
            name: "Objects and Prototypes",
            content: "Understanding objects and prototypes in JavaScript",
            children: [
                {
                    name: "Object Creation",
                    content: "Different ways to create objects",
                    children: [],
                },
                {
                    name: "Prototypes",
                    content: "Explanation of prototypes and prototype chain",
                    children: [],
                },
                {
                    name: "Inheritance",
                    content: "Understanding inheritance in JavaScript",
                    children: [],
                },
                {
                    name: "Classes",
                    content: "Introduction to ES6 classes",
                    children: [],
                },
            ],
        },
        {
            name: "Asynchronous JavaScript",
            content: "Understanding asynchronous programming in JavaScript",
            children: [
                {
                    name: "Callbacks",
                    content: "Explanation and examples of callbacks",
                    children: [],
                },
                {
                    name: "Promises",
                    content: "Explanation and examples of promises",
                    children: [],
                },
                {
                    name: "Async/Await",
                    content: "Explanation and examples of async/await",
                    children: [],
                },
                {
                    name: "Event Loop",
                    content: "Understanding the event loop",
                    children: [],
                },
            ],
        },
        {
            name: "DOM Manipulation",
            content: "Understanding how to manipulate the DOM",
            children: [
                {
                    name: "Selecting Elements",
                    content: "Different methods to select DOM elements",
                    children: [],
                },
                {
                    name: "Modifying Elements",
                    content: "How to modify DOM elements",
                    children: [],
                },
                {
                    name: "Event Handling",
                    content: "How to handle events in the DOM",
                    children: [],
                },
            ],
        },
        {
            name: "ES6+ Features",
            content: "Introduction to modern JavaScript features",
            children: [
                {
                    name: "Let and Const",
                    content: "Understanding let and const",
                    children: [],
                },
                {
                    name: "Template Literals",
                    content: "Understanding template literals",
                    children: [],
                },
                {
                    name: "Destructuring",
                    content: "Understanding destructuring assignments",
                    children: [],
                },
                {
                    name: "Modules",
                    content: "Understanding JavaScript modules",
                    children: [],
                },
                {
                    name: "Spread and Rest",
                    content: "Understanding spread and rest operators",
                    children: [],
                },
                {
                    name: "Default Parameters",
                    content: "Understanding default function parameters",
                    children: [],
                },
                {
                    name: "Classes",
                    content: "Understanding ES6 classes",
                    children: [],
                },
                {
                    name: "Promises",
                    content: "Understanding promises",
                    children: [],
                },
                {
                    name: "Async/Await",
                    content: "Understanding async/await",
                    children: [],
                },
            ],
        },
        {
            name: "Advanced Topics",
            content: "Diving deeper into JavaScript",
            children: [
                {
                    name: "Currying",
                    content: "Understanding currying",
                    children: [],
                },
                {
                    name: "Memoization",
                    content: "Understanding memoization",
                    children: [],
                },
                {
                    name: "Event Delegation",
                    content: "Understanding event delegation",
                    children: [],
                },
                {
                    name: "Modules and Bundling",
                    content: "Understanding modules and how to bundle them",
                    children: [],
                },
                {
                    name: "Web Workers",
                    content: "Understanding web workers",
                    children: [],
                },
                {
                    name: "Service Workers",
                    content: "Understanding service workers",
                    children: [],
                },
            ],
        },
    ],
};
