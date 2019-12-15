import StorefrontToken, {GetStorefrontAccessTokens, Scope, StorefrontTokenObject} from "../StorefrontToken";
import fetchMock from "fetch-mock";


/* * * * * * * * * * * * * * * * * * * * *
                Setup
* * * * * * * * * * * * * * * * * * * * */

beforeEach(() => {
  fetchMock.reset();
});

class StorefrontTokenTester extends StorefrontToken {
  constructor(storeDomain: string, generalToken: string) {
    super(storeDomain, generalToken);
  }
  
  public title = "BuyUsed: Read Products";
  
  public async getAllStorefrontTokens(): Promise<StorefrontTokenObject[]> {
    return super.getAllStorefrontTokens();
  }
  
  public async createNew(): Promise<StorefrontTokenObject> {
    return super.createNew();
  }
  
  public async getOrCreate(): Promise<StorefrontTokenObject> {
    return super.getOrCreate();
  }
  
}

/* * * * * * * * * * * * * * * * * * * * *
                Test Suite
* * * * * * * * * * * * * * * * * * * * */

describe("getOrCreate", () => {
  test("list has matching token and returns it", async () => {
  const getStorefrontAccessTokensDataHasMatch = buildTokenList(true);
  const storefrontTokenTester = new StorefrontTokenTester("", "");
  
  // mock the exact fetch response (NOT the return!)
  fetchMock.getOnce("*", getStorefrontAccessTokensDataHasMatch);
  const token = await storefrontTokenTester.getOrCreate();
  
  expect(token).toStrictEqual(matchingToken);
  });
  
  
  test("list has no matching token. creates and returns new token", async () => {
    const getStorefrontAccessTokensDataNoMatch = buildTokenList(false);
    const storefrontTokenTester = new StorefrontTokenTester("", "");
    
    // get list, but no match. then post/create a dummy token
    fetchMock.getOnce("*", getStorefrontAccessTokensDataNoMatch);
    fetchMock.postOnce("*", {storefront_access_token : matchingToken});
    
    const createdToken = await storefrontTokenTester.getOrCreate();
    expect(createdToken).toStrictEqual(matchingToken);
  });
  
  
  test("list is empty. creates and returns a new token", async () => {
    const storefrontTokenTester = new StorefrontTokenTester("", "");
    
    fetchMock.getOnce("*", {storefront_access_tokens: []});
    fetchMock.postOnce("*", {storefront_access_token : matchingToken});
  
    const createdToken = await storefrontTokenTester.getOrCreate();
    expect(createdToken).toStrictEqual(matchingToken);
  });
});


const matchingToken: StorefrontTokenObject = {
  id: 38268,
  access_token: '2dftywu247',
  access_scope: Scope.unauthReadProductListings,
  created_at: "2019-10-16T16:17:53-04:00",
  title: "BuyUsed: Read Products"
};

const dummyScopes = ['write_products', 'authenticated_read_products', 'administrator'];

const buildTokenList = (hasMatch: boolean): GetStorefrontAccessTokens => {
  const tokenList: StorefrontTokenObject[] = [];
  const listLength = Math.random() * 20;
  
  for (let i = 0; i < listLength; i++) {
    tokenList.push({
      id : Math.random() * 10000
      , access_token : `${Math.random() * 10000}`
      , access_scope : dummyScopes[Math.ceil(Math.random() * dummyScopes.length)]
      , created_at : new Date().toDateString()
      , title : "Dummy Title"
      , admin_graphql_api_id : 'dummy id string'
    })
  }
  
  if (hasMatch) {
    tokenList.splice(Math.random() * listLength, 0, matchingToken);
  }
  
  return { storefront_access_tokens : tokenList};
};