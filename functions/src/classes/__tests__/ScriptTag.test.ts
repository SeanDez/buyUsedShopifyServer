import ScriptTag from "../ScriptTag";

// beforeEach(() => {
//   jest.spyOn(ScriptTag.prototype, 'getFileName').mockImplementation(() => 'scriptTag.js');
// });
//
// afterEach(() => {
//   jest.restoreAllMocks();
// });


test("constructor()", () => {
  const scriptTag: ScriptTag = new ScriptTag("subdomain.shopify.com", 'generalTokenValue', "../path/to/file.js");
  const spy = jest
    .spyOn(scriptTag, "getFileName")
    .mockImplementation(() => "scriptTm.");
  
  expect(scriptTag.getFileName('x')).toEqual('scriptTag.js')
});