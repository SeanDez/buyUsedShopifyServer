module.exports = {
  "roots": [
    "functions/src"
    // , "hosting/src"
  ],
  // testMatch: [
  //   // any number of directories before/after __tests__
  //   // any number of characters, dot, 1 of the following
  //   // this isn't regex though (no outer //)
  //   "**/__tests__/**/*.+(ts|tsx|js)",
  //   "**/?(*.)+(spec|test).+(ts|tsx|js)"
  // ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};