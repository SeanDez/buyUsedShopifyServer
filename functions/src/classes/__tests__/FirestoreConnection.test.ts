import * as firebaseTesting from "@firebase/testing";
import {Logger} from "@firebase/logger";
import {RecordTypes, BuybackRecord, PayoutTypes, BlacklistedProductSchema, ProductSpecificRuleSchema, InventoryOverrideRuleSchema, WhereDefinition, BuybackStatus, DocumentTarget, GlobalRuleSchema} from "../../../../shared";

import FirestoreConnection from "../FirestoreConnection";
import {getDatabase, setDatabase} from "../../../../shared/database";
import {requestSubscriptionUrl} from "../../graphql";


/* * * * * * * * * * * * * * * * * * * * *
                  Setup
* * * * * * * * * * * * * * * * * * * * */

// setup firebase logging
const logClient = new Logger("@firebase/testing");
logClient.log("FirestoreConnection.test.ts");

// --------------- Helpers

const createTestDatabase = (credentials): any => {
  return firebaseTesting
    .initializeTestApp({
      projectId: 'testproject',
      auth: credentials
    })
    .firestore();
};

const nullAllApps = firebaseTesting
  .apps().map(app => app.delete());

// --------------- One Time,

// acts as unAuth user

// const noAuthTestDatabase = createTestDatabase(null);

const db = new FirestoreConnection('testshopdomain', createTestDatabase(null));


// --------------- Before / After

beforeEach(() => {
});


afterEach(async () => {
  try {
    await Promise.all(nullAllApps);
    await firebaseTesting.clearFirestoreData({
      projectId : "testproject"
    })
  }
  catch (e) {
    console.log(e, `=====error=====`);
  }
});


/* * * * * * * * * * * * * * * * * * * * *
                  Tests
* * * * * * * * * * * * * * * * * * * * */


test("creates new record", async () => {
  try {
    const addedDocument = await db
      .createNew(RecordTypes.globalRule, {
        storeId : "dummystoreid"
        , globalPercent : 40
      });
    
    expect(addedDocument).toEqual({
      storeId : "dummystoreid"
      , globalPercent : 40
      , badProp : 0
    });
  }
  catch (e) {
    console.log(e, `=====error test("creates new record"=====`);
  }
}, 100000);

test.skip('', () => null);















