"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = __importDefault(require("firebase-admin"));
/** if not in test mode the db is set to a real instance
 *
 * the setter is used to inject a test database. I'll use this in test files only
 *
 * the getter is used everywhere. it returns the db instance being used
 */
var db;
var GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// if node env is NOT test set database to firebase config
if (process.env.NODE_ENV !== "test") {
    // tutorial's way of doing it
    // admin.initializeApp(functions.config().firebase);
    // my way of initializing
    firebase_admin_1.default.initializeApp({
        // checks env.GOOGLE_APPLICATION_CREDENTIALS. Then checks if another service is already configured
        credential: firebase_admin_1.default.credential.applicationDefault(),
        databaseURL: 'https://buyusedshopify.firebaseio.com'
    });
    db = firebase_admin_1.default.firestore();
}
exports.setDatabase = function (injectedDatabase) {
    db = injectedDatabase;
};
exports.getDatabase = function () { return db; };
//# sourceMappingURL=database.js.map