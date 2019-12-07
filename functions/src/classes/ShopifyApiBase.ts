
abstract class ShopifyApiBase {
  protected storeDomain: string;
  protected generalToken: string;
  
  constructor(storeDomain: string, generalToken: string) {
    this.storeDomain = storeDomain;
    this.generalToken = generalToken;
  }
  
}

export default ShopifyApiBase;