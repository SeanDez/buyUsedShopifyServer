import admin from "firebase-admin";
import functions from "firebase-functions";

/** if not in test mode the db is set to a real instance
 *
 * the setter is used to inject a test database. I'll use this in test files only
 *
 * the getter is used everywhere. it returns the db instance being used
 */


let db: admin.firestore.Firestore;

// if node env is NOT test set database to firebase config
if (process.env.NODE_ENV !== "test") {
  // uses firebase functions to initialize
  // GCP is the option used in index.ts
  admin.initializeApp(functions.config().firebase);
  db = admin.firestore();
}

export const setDatabase = injectedDatabase => {
  db = injectedDatabase
};

export const getDatabase = () => db;

