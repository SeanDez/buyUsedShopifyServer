import ScriptTag, {DisplayScope, ScriptTagObject} from "../ScriptTag";
import path from "path";
import fetchMock from "fetch-mock";

require("node-fetch");

/* * * * * * * * * * * * * * * * * * * * *
             File Scoped Setup
* * * * * * * * * * * * * * * * * * * * */


class ScriptTagTester extends ScriptTag {
  public localFileName;
  
  constructor(storeDomain, generalToken, filePath) {
    super(storeDomain, generalToken, filePath);
  }
  
  public getFileName(filePathOrUrl: string): string {
    return super.getFileName(filePathOrUrl);
  }
  
  public async fetchAllScriptTags(): Promise<ScriptTagObject[]> {
    return super.fetchAllScriptTags();
  }
  
  public async exists(): Promise<boolean> {
    return super.exists();
  }
  
  
  public async createNew(): Promise<boolean> {
    return super.createNew();
  }
  
}

const dummyScriptTagsWithTarget: ScriptTagObject[] = [
  {
    "id": "82973",
    "src": "https://firebaseDomain.com/somescript.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.all
  }, {
    "id": "829737",
    "src": "https://firebaseDomain.com/somescript2.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.onlineStore
  }, {
    "id": "829736",
    "src": "https://firebaseDomain.com/somescript3.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.orderStatus
  }, {
    "id": "829733",
    "src": "https://firebaseDomain.com/scriptTag.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.onlineStore
  }
];

const dummyScriptTagsMissingTarget: ScriptTagObject[] = [
  {
    "id": "82973",
    "src": "https://firebaseDomain.com/somescript.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.all
  }, {
    "id": "829737",
    "src": "https://firebaseDomain.com/somescript2.js",
    "event": "onload",
    "created_at": "createdDateVal",
    "updated_at": 'updatedDateVal',
    "display_scope": DisplayScope.onlineStore
  }
];


/* * * * * * * * * * * * * * * * * * * * *
               Before & After
* * * * * * * * * * * * * * * * * * * * */

beforeEach(() => {
  
});

afterEach(() => {
  // bad naming. This means clear all mocks
  jest.restoreAllMocks();
});


/* * * * * * * * * * * * * * * * * * * * *
                  Tests
* * * * * * * * * * * * * * * * * * * * */

describe('constructor', () => {
  test("localFileName: stub test", () => {
    // modifies the class itself through the prototype
    jest
      .spyOn(ScriptTagTester.prototype, "getFileName")
      .mockImplementation(() => "scriptTag.js");
    
    
    const scriptTagTester: ScriptTagTester = new ScriptTagTester("subdomain.shopify.com", 'generalTokenValue', "../path/to/file.js");
    
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
  test('localFileName: using path.join()', () => {
    const scriptTagTester = new ScriptTagTester('x', 'x', path.join(__dirname, '8.js'));
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
  });

  test("exists() is true", async() => {
    jest.spyOn(ScriptTagTester.prototype, "fetchAllScriptTags")
      .mockResolvedValueOnce(dummyScriptTagsWithTarget);
    
    const scriptTagTester = new ScriptTagTester("","", "https://firebaseDomain.com/scriptTag.js");

    expect(await scriptTagTester.exists()).toEqual(true);
  });

  test("exists() throws Error for no matching constructor filename", async() => {
    jest.spyOn(ScriptTagTester.prototype, "fetchAllScriptTags")
      .mockResolvedValueOnce(dummyScriptTagsWithTarget);
    
    // todo this line has the error
    const scriptTagTester = new ScriptTagTester("","", "https://firebaseDomain.com/scriptTag.js");

    // await expect(Promise.reject(new Error("Failed")))
    //   .rejects
    //   .toThrow();
  });
  
  // todo repair this test so that Jest sees it returns false, not {}
  test("exists() returns false for no matching scriptTag from fake fetch", async() => {
    jest.spyOn(ScriptTagTester.prototype, "fetchAllScriptTags")
      .mockResolvedValueOnce(dummyScriptTagsMissingTarget);
    const scriptTagTester = new ScriptTagTester("","", "https://firebaseDomain.com/scriptTag.js");

    await expect(scriptTagTester.exists()).resolves.toStrictEqual(false);
  });
  
  
  test("internalFetch()", async () => {
    fetchMock.mock("*", {fetchMockKey: "fetchMockVal"});
    const scriptTagTester = new ScriptTagTester("", "", "x.js");
    // await expect(scriptTagTester.internalFetch()).resolves.toEqual({key1 : "val1"});
    
    const result = await scriptTagTester.internalFetch();
    const json = await result.json();
    console.log(json, `=====json=====`);
    expect(json).toEqual({fetchMockKey : 'fetchMockVal'});
  });
  
  
  test("createNew: creates new scriptTag", async () => {
    // fetchMock.mockResponse(JSON.stringify(1));
    // const data = await fetchMock("x");
  
    const fetch = jest.fn().mockImplementation(async () => Promise.resolve(1));
    await expect (fetch()).resolves.toStrictEqual(1);
    
    // await expect(data.json()).resolves.toStrictEqual(2);
  });
  
  
  test.skip("verifyOrCreateNew", async () => {
    const scriptTagTester = new ScriptTagTester("storeDomain.com", "tokenValue", path.join(__dirname, "/fileName.js"));
    
  })
  
});







