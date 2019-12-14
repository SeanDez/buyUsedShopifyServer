

class StorefrontToken {
  protected storeDomain: string;
  protected generalToken: string;
  
  constructor(storeDomain: string, generalToken: string) {
    this.storeDomain = storeDomain;
    this.generalToken = generalToken;
  }
  
  
  // --------------- Public Methods
  
  /** Always does a get request. Consider app re-installs
   */
  public getOrCreate() {
  
  }
  
}