module.exports = {
  "roots": [
    "functions/src"
    // , "hosting/src"
  ]
  , preset: "jest-puppeteer"
  , transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
  , testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$'
  , moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};