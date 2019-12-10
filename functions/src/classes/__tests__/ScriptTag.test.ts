import ScriptTag from "../ScriptTag";

// beforeEach(() => {
//   jest.spyOn(ScriptTag.prototype, 'getFileName').mockImplementation(() => 'scriptTag.js');
// });
//
afterEach(() => {
  // bad naming. This means clear all mocks
  jest.restoreAllMocks();
});

describe('constructor', () => {
  test("localFileName: stub test", () => {
    // modifies the class itself through the prototype
    jest
      .spyOn(ScriptTag.prototype, "getFileName")
      .mockImplementation(() => "scriptTag.js");
    
    const scriptTag: ScriptTag = new ScriptTag("subdomain.shopify.com", 'generalTokenValue', "../path/to/file.js");
    
    
    // expect(scriptTag.getFileName('x')).toEqual('scriptTag.js');
    expect(scriptTag.localFileName).toEqual('scriptTag.js');
    
  });
  
  test('localFileName: mockReturnValueOnce', () => {
    jest.spyOn(ScriptTag.prototype, "getFileName")
      .mockReturnValueOnce("29vk.js");
    const scriptTag2 = new ScriptTag('x', 'x', '8.js');
    expect(scriptTag2.localFileName).toEqual('29vk.js');
  });
  
  test('localFileName: single number filename input with no preceding folder slashes', () => {
    const scriptTag2 = new ScriptTag('x', 'x', '8.js');
    expect(scriptTag2.localFileName).toEqual('8.js');
  });
  
  test('localFileName blank', () => {
    jest.spyOn(ScriptTag.prototype, "getFileName")
      .mockImplementationOnce(() => "dummy constructor call");
    const scriptTag = new ScriptTag("", "", "");
    expect(() => {
      scriptTag.getFileName("")
    }).toThrow();
  })
});







