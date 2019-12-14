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
  fetchMock.reset();
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
});


test("exists() returns false for no matching scriptTag from fake fetch", async() => {
  jest.spyOn(ScriptTagTester.prototype, "fetchAllScriptTags")
    .mockResolvedValueOnce(dummyScriptTagsMissingTarget);
  const scriptTagTester = new ScriptTagTester("","", "https://firebaseDomain.com/scriptTag.js");
  
  await expect(scriptTagTester.exists()).resolves.toStrictEqual(false);
});


test("internalFetch() overwrites the default return value", async () => {
  fetchMock.getOnce("*", {fetchMockKey: "fetchMockVal"});
  const scriptTagTester = new ScriptTagTester("", "", "x.js");
  // await expect(scriptTagTester.internalFetch()).resolves.toEqual({key1 : "val1"});
  
  const result = await scriptTagTester.internalFetch();
  const json = await result.json();
  expect(json).toEqual({fetchMockKey : 'fetchMockVal'});
});


test("createNew: creates new scriptTag", async () => {
  // mock fetch to return a dummy object
  // this is more for testing mock-fetch than anything else. The next test will matter more though
  fetchMock.postOnce("*", {
    script_tag : {
      id : "001"
      , src : "https://sampleFirebaseUrl.com/scriptName.js"
      , event : "onload"
      , created_at : "sample created datetime string here"
      , updated_at : "sample updated datetime string here"
      , display_scope : DisplayScope.onlineStore
    }
  });
  
  const scriptTagTester = new ScriptTagTester("sub.mainDomain.com", "genToken", "/x.js");
  
  const tagIsPosted: boolean = await scriptTagTester.createNew();
  expect(tagIsPosted).toStrictEqual(true);
});


describe("verifyOrCreateNew()", () => {
  ////// Tests //////
  // verifies a current tag is already there
  // when tag is not found, it is created
  
  test("verifies a current tag is already there", async () => {
    // mock .exists() to return true
    // verify the outer method returns true
    jest.spyOn(ScriptTagTester.prototype, "exists")
      .mockResolvedValueOnce(true);
    const scriptTagTester = new ScriptTagTester("storeDomain.com", "tokenValue", path.join(__dirname, "/fileName.js"));
    
    const tagIsVerifiedToAlreadyExist = await scriptTagTester.verifyOrCreateNew();
    expect(tagIsVerifiedToAlreadyExist).toStrictEqual(true);
  });
  
  
  test("when tag is not found, it is created", async () => {
    // mock .exists() to return false
    // mock .createNew() to return true
    // check that
    jest.spyOn(ScriptTagTester.prototype, "exists")
      .mockResolvedValueOnce(false);
    jest.spyOn(ScriptTagTester.prototype, "createNew")
      .mockResolvedValueOnce(true);
    const scriptTagTester = new ScriptTagTester("storeDomain.com", "tokenValue", path.join(__dirname, "/fileName.js"));
    
    const oldTagNotThereNewTagIsCreated = await scriptTagTester.verifyOrCreateNew();
    expect(oldTagNotThereNewTagIsCreated).toStrictEqual(true);
  })
});




