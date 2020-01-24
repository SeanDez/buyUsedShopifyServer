import {DocumentTarget, RecordTypes, WhereDefinition, GlobalRuleSchema, InventoryOverrideRuleSchema, ProductSpecificRuleSchema, BlacklistedProductSchema, BuybackRecord} from "../../../shared";

// this is the line that generates the gold error
import admin, {firestore} from "firebase-admin";
import DocumentSnapshot = admin.firestore.DocumentSnapshot;




export default class FirestoreConnection {
  
  // --------------- Public Methods
  
  public async createNew(type: RecordTypes, documentData: object): Promise<boolean> {
    this.verifySchemaIsCorrect(type, documentData);
    const collectionName = this.getCollectionName(type);
    
    // can be void/empty
    try {
      return await this.addDocument(collectionName, documentData);
    }
    catch (e) {
      console.log(e, `=====error createNew()=====`);
      return false;
    }
  }
  
  
  public async getSome(collection: string, whereClauses: WhereDefinition[], limit: number, orderBy: string, offset: number): Promise<object|null> {
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
      return null;
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
  
  
  public async delete(target: DocumentTarget): Promise<boolean|null> {
    try {
      const write: firestore.WriteResult = await this.database
        .collection(target.collection)
        .doc(target.document)
        .delete();
      
      return Boolean(write);
    }
    catch (e) {
      console.log(e, `=====error=====`);
      return null;
    }
  }
  
  
  // --------------- Class Properties & Constructor
  
  protected shopDomain: string;
  protected database: firestore.Firestore;
  
  constructor(shopDomain: string, database: firestore.Firestore) {
    this.shopDomain = shopDomain;
    this.database = database;
  }
  
  
  // --------------- Protected / Private Methods
  
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
  
  protected async addDocument(collectionName: string, documentData: object): Promise<boolean> {
    try {
      const documentReference = await this.database
        .collection(collectionName)
        .add(documentData);
      
      const idLength: number = documentReference.id.length;
      
      return Boolean(idLength > 5);
    }
    catch (e) {
      console.log(e, `=====error addDocument()=====`);
      return false;
    }
  }
  
}