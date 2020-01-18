import {firestore} from "firebase";
import {DocumentTarget, RecordTypes, WhereDefinition, GlobalRuleSchema, InventoryOverrideRuleSchema, ProductSpecificRuleSchema, BlacklistedProductSchema, BuybackRecord} from "../../../shared";


export default class Firestore {
  protected shopDomain: string;
  protected database: any;
  
  constructor(shopDomain: string, database: any) {
    this.shopDomain = shopDomain;
    this.database = database;
  }
  
  /** Matches the stated type against recordData shape
   */
  verifySchemaIsCorrect(type: RecordTypes, recordData: any) {
    let schemaMatches: boolean;
    
    switch (type) {
      case RecordTypes.globalRule:
        schemaMatches = "globalPercent" in recordData;
        break;
      case RecordTypes.inventoryCutoffRule:
        schemaMatches = "inventoryPercent" in recordData;
        break;
      case RecordTypes.productFixedPriceRule:
        schemaMatches = "buyBackPrice" in recordData;
        break;
      case RecordTypes.blackListRule:
        schemaMatches = "productHandle" in recordData;
        break;
      case RecordTypes.buybackRecord:
        schemaMatches = "productList" in recordData;
        break;
      default:
        schemaMatches = false;
    }
    
    if (Boolean(schemaMatches)) {
      return true;
    }
    
    throw Error("recordData's shape is wrong against its schema");
  }
  
  getCollectionName(recordTypes: RecordTypes): string {
    switch (recordTypes) {
      case RecordTypes.globalRule:
        return  "globalRule";
      case RecordTypes.inventoryCutoffRule:
        return "inventoryCutoffRule";
      case RecordTypes.productFixedPriceRule:
        return  "productFixedPriceRules";
      case RecordTypes.blackListRule:
        return "blackListRules";
      case RecordTypes.buybackRecord:
        return "buyBackRecords";
      default:
        break;
    }
  
    throw Error("something went wrong inside getCollectionName()");
  }
  
  async addDocument(collectionName: string, documentData: object): Promise<any|void> {
    try {
      const newlyAddedDocument = await this.database
        .collection(collectionName)
        .add(documentData);
    
      return await newlyAddedDocument.get();
    }
    catch (e) {
      console.log(e, `=====error=====`);
    }
  }
  
  // --------------- Public Methods
  
  public async createNew(type: RecordTypes, documentData: object) {
    this.verifySchemaIsCorrect(type, documentData);
    const collectionName = this.getCollectionName(type);
    
    return await this.addDocument(collectionName, documentData);
  }
  
  
  public async getSome(collection: string, whereClauses: WhereDefinition[], limit: number, orderBy: string, offset: number): Promise<object|void> {
    const baseQuery: any = this.database
      .collection(collection)
      .where("storeId", "==", this.shopDomain);
  
    // arg 1 is a callback with the aggregator, then the current value from the array
    const addedWheres = whereClauses
      .reduce((accumulatedQuery, {column, operator, value}) => {
        return accumulatedQuery.where(column, operator, value);
      }, baseQuery);
    
    const addedLimitOrderOffset = addedWheres
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);
    
    try {
      const snapshot = await addedLimitOrderOffset.get();
      const records = snapshot.docs.map((documentSnapshot: any) => documentSnapshot.data());
      return records;
    }
    catch (e) {
      console.log(e, `=====e=====`);
    }
  }
  
  
  /** data: UpdateData
   An object containing the fields and values with which to update the document. Fields can contain dots to reference nested fields within the document.
   */
  public async update(target: DocumentTarget, updateFieldsValues: object): Promise<boolean> {
    try {
      await this.database
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
  
  
  public async delete(target: DocumentTarget): Promise<boolean> {
    try {
      const write: Promise<boolean> = await this.database
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