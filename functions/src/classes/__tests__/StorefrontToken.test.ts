import StorefrontToken, {GetStorefrontAccessTokens, Scope, StorefrontTokenObject} from "../StorefrontToken";

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


describe("getOrCreate", () => {
  test.skip("list has matching token and returns it", () => {

  });
  
  test.skip("list has no matching token. creates and returns new token", () => {
  
  });
  
  test.skip("list is empty. creates and returns a new token", () => {
  
  });
});


const staticTokenData = {
  id: 38268,
  access_token: '2dftywu247',
  access_scope: Scope.unauthReadProductListings,
  created_at: "2019-10-16T16:17:53-04:00",
  title: "BuyUsed: Read Products"
};

const dummyScopes = ['write_products', 'authenticated_read_products', 'administrator'];

const buildTokenList = (matchingToken: boolean): StorefrontTokenObject[] => {
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
  
  if (matchingToken) {
    tokenList.splice(Math.random() * listLength, 0, staticTokenData);
  }
  
  return tokenList;
};