import Express from "express";
import firebaseAdmin from "firebase-admin";
const firebaseFunctions = require('firebase-functions');
import initialAuthRouter from "./routers/initialAuth";

/** ////// Client Application Back End for Shopify App: "Buy Used" //////
 *
 * Deploy to production by navigating to /functions directory and running
 * "firebase deploy --only functions"
 *
 * Deploy to localhost:5000 with "firebase serve --only functions"
 * Run "ngrok http 5000" as well. Shopify won't respond to non https client apps
 */

////// Setup //////
const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;

firebaseAdmin.initializeApp({
 // checks env.GOOGLE_APPLICATION_CREDENTIALS. Then checks if another service is already configured
 credential: firebaseAdmin.credential.applicationDefault(),
 databaseURL: 'https://buyusedshopify.firebaseio.com'
});

const express = Express();


////// Router Middleware //////
express.use(initialAuthRouter);


////// Other Middleware //////


////// Exporting to Firebase Functions //////
exports.buyUsedServer = firebaseFunctions.https.onRequest(express);
