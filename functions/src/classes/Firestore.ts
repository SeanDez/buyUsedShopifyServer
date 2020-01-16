import {firestore} from "firebase";
import {DocumentTarget, RuleTypes, WhereDefinition, GlobalRuleSchema, InventoryOverrideRuleSchema, ProductSpecificRuleSchema, BlacklistedProductSchema} from "../../../shared";


const admin = require('firebase-admin');
const functions = require('firebase-functions');



// uses firebase functions to initialize
// GCP is the option used in index.ts
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();



export default class Firestore {
  protected shopDomain: string;
  
  constructor(shopDomain: string) {
    this.shopDomain = shopDomain;
    
  }
  
  verifySchemaIsCorrect(type: RuleTypes, recordData: any) {
    let schemaMatches: boolean;
    
    switch (type) {
      case RuleTypes.global:
        schemaMatches = "globalPercent" in recordData;
        break;
      case RuleTypes.inventory:
        schemaMatches = "inventoryPercent" in recordData;
        break;
      case RuleTypes.product:
        schemaMatches = "buyBackPrice" in recordData;
        break;
      case RuleTypes.blacklist:
        schemaMatches = "productHandle" in recordData;
        break;
      default:
        schemaMatches = false;
    }
    
    if (Boolean(schemaMatches)) {
      return true;
    }
    
    throw Error("recordData's shape is wrong against its schema");
  }
  
  getCollectionName(ruleType: RuleTypes) {
    switch (ruleType) {
      case RuleTypes.global:
        return  "globalRule";
      case RuleTypes.inventory:
        return "inventoryCutoffRule";
      case RuleTypes.product:
        return  "productFixedPriceRules";
      case RuleTypes.blacklist:
        return "blackListRules";
    }
  }
  
  async addDocument(collectionName: string, documentData: object): Promise<any|void> {
    try {
      const newlyAddedDocument = await db
        .collection(collectionName)
        .add(documentData);
    
      return await newlyAddedDocument.get();
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  }
  
  // --------------- Public Methods
  
  public async saveRule(type: RuleTypes, documentData: object) {
    this.verifySchemaIsCorrect(type, documentData);
    const collectionName = this.getCollectionName(type);
    
    return await this.addDocument(collectionName, documentData);
  }
  
  
  // firestore.WhereFilterOp
  public async getSome(collection: string, whereClauses: WhereDefinition[]): Promise<object|void> {
    const baseQuery: any = db
      .collection(collection)
      .where("storeId", "==", this.shopDomain);
  
    // arg 1 is a callback with the aggregator, then the current value from the array
    const stitchedQuery = whereClauses
      .reduce((accumulatedQuery, {column, operator, value}) => {
        return accumulatedQuery.where(column, operator, value);
      }, baseQuery);
    
    try {
      const response = await stitchedQuery.get();
      const records = response.docs.map((documentSnapshot: any) => documentSnapshot.data());
      return records;
    }
    catch (e) {
      console.log(e, `=====e=====`);
    }
  }
  
  
  public async getAllRules(): Promise<object> {
    const globalRules: any = [];
    const exceptions: any = [];
    const fixedProductPrices: any = [];
    
    // todo convert all this to promise syntax. Don't want to block at each step
    
    // define each promise
    
    // setup the promise.all to receive inputs, then return/resolve the object with all outputs
    Promise
      .all([1, 2, 3])
      .then((combinedData: any) => {
        return {
          globalRules : combinedData[0]
          , exceptions : combinedData[1]
          , fixedProductPrices : combinedData[2]
        }
      });
    
    try {
      const response: firestore.QuerySnapshot = await db
        .collection("globalRules")
        .get();
      
      // .docs is needed to access it as an array
      const globalRules = response.docs.map((record: any) => record.data());
      
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
    
    return {
      globalRules, exceptions, fixedProductPrices
    }
  }
  
  
  /** data: UpdateData
   An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
   */
  public async update(target: DocumentTarget, updateFieldsValues: object): Promise<boolean> {
    try {
      const response: Response = await db
        .collection(target.collection)
        .doc(target.document)
        .update(updateFieldsValues);
      
      return Promise.resolve(true);
    }
    catch (e) {
      console.log(e, `=====error=====`);
      
      // same as "throw false"
      return new Promise(((resolve, reject) => reject(false)));
    }
  }
  
  
  public async deleteRecord(target: DocumentTarget): Promise<boolean> {
    try {
      const write: Promise<boolean> = await db
        .collection(target.collection)
        .doc(target.document)
        .delete();
      
      return Boolean(write);
    }
    catch (e) {
      console.log(e, `=====error=====`);
      return false;
    }
  }
}