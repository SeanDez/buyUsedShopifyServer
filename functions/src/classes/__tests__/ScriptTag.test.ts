import ScriptTag from "../ScriptTag";

class ScriptTagTester extends ScriptTag {}

beforeEach(() => {
});

afterEach(() => {
  // bad naming. This means clear all mocks
  jest.restoreAllMocks();
});

describe('constructor', () => {
  test("localFileName: stub test", () => {
    // modifies the class itself through the prototype
    jest
      .spyOn(ScriptTagTester.prototype, "getFileName")
      .mockImplementation(() => "scriptTag.js");
    
    
    const scriptTagTester: ScriptTagTester = new ScriptTagTester("subdomain.shopify.com", 'generalTokenValue', "../path/to/file.js");
    
    
    // expect(scriptTag.getFileName('x')).toEqual('scriptTag.js');
    expect(scriptTagTester.localFileName).toEqual('scriptTag.js');
    
  });
  
  test('localFileName: mockReturnValueOnce', () => {
    jest.spyOn(ScriptTagTester.prototype, "getFileName")
      .mockReturnValueOnce("29vk.js");
    const scriptTagTester = new ScriptTagTester('x', 'x', '8.js');
    expect(scriptTagTester.localFileName).toEqual('29vk.js');
  });
  
  test('localFileName: single number filename input with no preceding folder slashes', () => {
    const scriptTagTester = new ScriptTagTester('x', 'x', '8.js');
    expect(scriptTagTester.localFileName).toEqual('8.js');
  });
  
  test('localFileName blank', () => {
    jest.spyOn(ScriptTagTester.prototype, "getFileName")
      .mockImplementationOnce(() => "dummy constructor call");
    const scriptTagTester = new ScriptTagTester("", "", "");
    
    // invocation must be done inside a callback to catch the throw
    expect(() => {
      scriptTagTester.getFileName("")
    }).toThrow();
  })
});







