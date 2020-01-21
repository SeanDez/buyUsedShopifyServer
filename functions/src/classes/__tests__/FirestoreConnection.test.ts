import * as firebaseTesting from "@firebase/testing";
import {RecordTypes, BuybackRecord, PayoutTypes, BlacklistedProductSchema, ProductSpecificRuleSchema, InventoryOverrideRuleSchema, WhereDefinition, BuybackStatus, DocumentTarget, GlobalRuleSchema} from "../../../../shared";

import FirestoreConnection from "../FirestoreConnection";
import {getDatabase, setDatabase} from "../../../../shared/database";

/* * * * * * * * * * * * * * * * * * * * *
                  Setup
* * * * * * * * * * * * * * * * * * * * */

// --------------- Helpers

const createTestDatabase = (credentials): any => {
  return firebaseTesting
    .initializeTestApp({
      projectId: 'testProject',
      auth: credentials
    })
    .firestore();
};

const nullAllApps = firebaseTesting
  .apps().map(app => app.delete());

// --------------- One Time,

// acts as unAuth user

// const noAuthTestDatabase = createTestDatabase(null);

const db = new FirestoreConnection('testShopDomain', createTestDatabase(null));


// --------------- Before / After

beforeEach(() => {
});


afterEach(async () => {
  await Promise.all(nullAllApps);
  await firebaseTesting.clearFirestoreData({
    projectId : "testProject"
  })
});


/* * * * * * * * * * * * * * * * * * * * *
                  Tests
* * * * * * * * * * * * * * * * * * * * */


test("creates new record", async () => {
  const addedDocument = await db
    .createNew(RecordTypes.globalRule, {
      storeId : "dummyStoreId"
      , globalPercent : 40
    });

  expect(addedDocument).toEqual({
    storeId : "dummyStoreId"
    , globalPercent : 40
    , badProp : 0
  });
}, 100000);

test.skip('', () => null);















