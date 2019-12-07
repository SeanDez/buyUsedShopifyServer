import fetch from "isomorphic-fetch";
import ShopifyApiBase from "./ShopifyApiBase";
import {securityRules} from "firebase-admin";


// --------------- Interfaces

enum DisplayScope { all = "all", orderStatus = "order-status", onlineStore = "online-store" }

interface ScriptTagObject {
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
  
  
  constructor(storeDomain: string, generalToken: string, filePath: string) {
    // calls parent constructor
    // passes down local inputs one level into the parent constructor
    super(storeDomain, generalToken);
    this.filePath = filePath;
  }
  
  // --------------- Child Methods
  
  async fetchAllScriptTags(): Promise<ScriptTagObject[]> {
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
  
  protected getFilename(filePath: string): string {
    const fileNameMatches: string[]|null = filePath.match(/\/{1}(\w+.js)$/);
    if (Boolean(fileNameMatches)) {
      // capture group is always assigned to [1], even when full match === capture group
      return fileNameMatches![1];
    }
    else { throw Error("Local filename not found"); }
  }

  protected async exists(): Promise<boolean> {
    const scriptTags: ScriptTagObject[] = await this.fetchAllScriptTags();
    
    const scriptTagFileNames: string[] = scriptTags.map((scriptTagRecord: ScriptTagObject) => {
      const fileName: string = this.getFilename(scriptTagRecord.src);
      return fileName;
    });

    // match against local filename
    const localFileName: string = this.getFilename(this.filePath);
    if (scriptTagFileNames.indexOf(localFileName) > -1) { return true; }
    return false;
  }
  
  // --------------- Public Methods
  
  async verifyOrCreateNew() {
    if (this.exists()) { return true }
    // const tagPosted = this.createNew();
    // if (Boolean(tagPosted)) { return true; }
    return false;
  }
  
  
}


export default ScriptTag;