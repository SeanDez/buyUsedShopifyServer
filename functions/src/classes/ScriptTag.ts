import "isomorphic-fetch";
import ShopifyApiBase from "./ShopifyApiBase";
import {securityRules} from "firebase-admin";


// --------------- Interfaces

export enum DisplayScope { all = "all", orderStatus = "order-status", onlineStore = "online-store" }

export interface ScriptTagObject {
  "id": string,
  "src": string,
  "event": "onload",
  "created_at": string,
  "updated_at": string,
  "display_scope": DisplayScope
}

interface GetAllScriptTags {
  script_tags : ScriptTagObject[]
}


// --------------- Class

class ScriptTag extends ShopifyApiBase {
  protected filePath: string;
  protected localFileName: string;
  
  
  constructor(storeDomain: string, generalToken: string, filePath: string) {
    // calls parent constructor
    // passes down local inputs one level into the parent constructor
    super(storeDomain, generalToken);
    this.filePath = filePath;
    this.localFileName = this.getFileName(this.filePath);
  }
  
  // --------------- Child Methods
  
  protected async fetchAllScriptTags(): Promise<ScriptTagObject[]> {
    try {
      const response = await fetch(`https://${this.storeDomain}/admin/api/2019-10/script_tags.json`, {
        method : "get"
        , headers : {
          "content-type" : 'application/json'
          , "X-Shopify-Auth-Token" : this.generalToken // confirm this is the right header key
        }
      });
      
      const allScriptTags: GetAllScriptTags = await response.json();
      return allScriptTags.script_tags;
    }
    catch (e) {
      console.log(e, `=====error=====`);
      throw Error(e);
    }
  }
  
  protected getFileName(filePathOrUrl: string): string {
    const fileNameMatch: string[]|null = filePathOrUrl.match(/\/?(\w+.js)$/);
    if (Boolean(fileNameMatch)) {
      // capture group is always assigned to [1], even when full match === capture group
      return fileNameMatch![1];
    }
    else { throw Error("Filename not found"); }
  }

  // todo simplify this a ton to exact match my hosted, unchanging sc url
  protected async exists(): Promise<boolean> {
    const scriptTags: ScriptTagObject[] = await this.fetchAllScriptTags();
    
    const scriptTagFileNames: string[] = scriptTags.map((scriptTagRecord: ScriptTagObject) => {
      const tagFileName: string = this.getFileName(scriptTagRecord.src);
      return tagFileName;
    });

    // if has an index, return true, else false
    return Boolean(scriptTagFileNames.indexOf(this.localFileName) > -1);
  }
  
  public async internalFetch(): Promise<Response> {
    const response = await fetch('http://test.com/');
    return response;
  }
  
  protected async createNew(): Promise<boolean> {
    // post script tag to the api. on success return true, else throw error
    const response = await fetch(`https://${this.storeDomain}/admin/api/2019-10/script_tags.json`, {
      method : 'post'
      , headers : {
        'content-type' : 'application/json'
        , "X-Shopify-Auth-Token" : this.generalToken
      }
      , body : JSON.stringify({
        script_tag : {
          event : "onload"
          , src : "https://firebaseHostingPlaceholder.com/consoleLog.js"
        }
      })
    });
    
    const convertedResponse: { script_tag : ScriptTagObject} = await response.json();
    
    // test the id since that is required
    return Boolean(convertedResponse.script_tag.id);
  }
  
  // --------------- Public Methods
  
  public async verifyOrCreateNew() {
    if (await this.exists()) { return true }
    const tagPosted: boolean = await this.createNew();
    if (Boolean(tagPosted)) { return true; }
    throw Error(`ScriptTag ${this.filePath} not verified or posted`)
  }
  
}


export default ScriptTag;