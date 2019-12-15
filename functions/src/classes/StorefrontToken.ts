import "isomorphic-fetch";
import ShopifyApiBase from "./ShopifyApiBase";


export enum Scope {
  unauthReadProductListings = "unauthenticated_read_product_listings"
}

export interface StorefrontTokenObject {
  id: number,
  access_token: string,
  access_scope: string, // need to run .join() on it
  created_at: string,
  title: string,
  admin_graphql_api_id?: string
}

export interface GetStorefrontAccessTokens {
  storefront_access_tokens:
    StorefrontTokenObject[];
}


export default class StorefrontToken extends ShopifyApiBase {
  constructor(storeDomain: string, generalToken: string) {
    super(storeDomain, generalToken)
  }
  
  protected title: string = "BuyUsed: Read Products";
  
  
  protected async getAllStorefrontTokens(): Promise<StorefrontTokenObject[]> {
    try {
      const response = await fetch(`https://${this.storeDomain}/admin/api/2019-10/storefront_access_tokens.json`, {
        method : 'get'
        , headers : {
          "content-type" : "application/json"
          , "X-Shopify-Access-Token" : this.generalToken
        }
      });
      const json: GetStorefrontAccessTokens = await response.json();
      return json.storefront_access_tokens;
    }
    catch (e) {
      console.log(e, `=====error during getAllStorefrontTokens()=====`);
      throw Error(e);
    }
  }
  
  protected async createNew(): Promise<StorefrontTokenObject> {
    try {
      const response = await fetch(`https://${this.storeDomain}/admin/api/2019-10/storefront_access_tokens.json`, {
        method: 'post'
        , headers: {
          "content-type": "application/json"
          , "X-Shopify-Access-Token": this.generalToken
        }
        , body : JSON.stringify({
          storefront_access_token : {
            title : this.title
          }
        })
      });
      const json: {storefront_access_token : StorefrontTokenObject} = await response.json();
      return json.storefront_access_token;
    }
    catch (e) {
      console.log(e, `=====error during createNew()=====`);
      throw Error(e);
    }
  }
  
  // --------------- Public Methods
  
  /** Always does a get request. Consider app re-installs
   */
  public async getOrCreate(): Promise<StorefrontTokenObject> {
    const listOfTokens: StorefrontTokenObject[] = await this.getAllStorefrontTokens();
    
    if (Boolean(listOfTokens.length)) {
      // check for the right token
      const readProductsToken: StorefrontTokenObject|undefined = listOfTokens.find(token => {
        return token.access_scope === Scope.unauthReadProductListings
      });
      
      if (Boolean(readProductsToken)) {
        return readProductsToken!;
      }
    }
  
    // no token found. Create and return new token
    const newToken: StorefrontTokenObject = await this.createNew();
    return newToken;
  
  }
  
}