import admin from "firebase-admin";
import functions from "firebase-functions";

/** if not in test mode the db is set to a real instance
 *
 * the setter is used to inject a test database. I'll use this in test files only
 *
 * the getter is used everywhere. it returns the db instance being used
 */


let db: admin.firestore.Firestore;

const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;

// if node env is NOT test set database to firebase config
if (process.env.NODE_ENV !== "test") {
  // tutorial's way of doing it
  // admin.initializeApp(functions.config().firebase);
  
  // my way of initializing
  admin.initializeApp({
    // checks env.GOOGLE_APPLICATION_CREDENTIALS. Then checks if another service is already configured
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://buyusedshopify.firebaseio.com'
  });
  
  db = admin.firestore();
}

export const setDatabase = injectedDatabase => {
  db = injectedDatabase
};

export const getDatabase = () => db;

