import StorefrontToken, {GetStorefrontAccessTokens, Scope, StorefrontTokenObject} from "../StorefrontToken";
import fetchMock from "fetch-mock";


/* * * * * * * * * * * * * * * * * * * * *
                Setup
* * * * * * * * * * * * * * * * * * * * */

beforeEach(() => {
  fetchMock.reset();
});

class StorefrontTokenTester extends StorefrontToken {
  public fetchGetOptions: {headers: object} = {
    headers : {
      'content-type' : 'application/json'
      , 'X-Shopify-Access-Token' : this.generalToken
    }
  };
  public fetchPostOptions = {
    headers : {
      'content-type' : 'application/json'
      , 'X-Shopify-Access-Token' : this.generalToken
    }
  };
  public domain = 'https://my.storeDomain.com/admin/api/2019-10/storefront_access_tokens.json';
  
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
    const storefrontTokenTester = new StorefrontTokenTester("my.storeDomain.com", "generalToken");
    
    // get list, but no match. then post/create a dummy token
    fetchMock
      .getOnce("https://my.storeDomain.com/admin/api/2019-10/storefront_access_tokens.json", getStorefrontAccessTokensDataNoMatch, storefrontTokenTester.fetchGetOptions)
      .postOnce("https://my.storeDomain.com/admin/api/2019-10/storefront_access_tokens.json", {storefront_access_token : matchingToken}, storefrontTokenTester.fetchPostOptions);
    
    const createdToken = await storefrontTokenTester.getOrCreate();
    expect(createdToken).toStrictEqual(matchingToken);
  });
  
  
  test("list is empty. creates and returns a new token", async () => {
    const storefrontTokenTester = new StorefrontTokenTester("my.storeDomain.com", "");
    
    fetchMock
      .getOnce("https://my.storeDomain.com/admin/api/2019-10/storefront_access_tokens.json", {storefront_access_tokens: []})
      .postOnce("*", {storefront_access_token : matchingToken});
  
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