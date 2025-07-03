// src/modules/sample1.example.ts
export const message = 'Hello from sample1 example module!';
export const value = 42;

export default function greet() {
  console.log('Sample1 module says hi via default export!');
}

console.log('sample1.example.ts has been evaluated');
