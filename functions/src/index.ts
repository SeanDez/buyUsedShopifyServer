// import "@babel/polyfill";
import "isomorphic-fetch";
import functions from 'firebase-functions';
import firebaseLib from "firebase/app";
import "firebase/firestore";
// import "firebase/functions";
import createApp from "@shopify/app-bridge";


const firebase = firebaseLib.initializeApp('');


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// import * as handlers from "./handlers/index";

// conditionally require yenv if process.env not populated
let env, yenv;
if (typeof process !== "undefined" &&
 typeof process.env !== "undefined") {
 yenv = require('yenv');
 env = yenv("../.env.yaml"); // defaults to .env.yaml
}
const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES} = env;

const port = 8081;


////// Shop Origin //////
/*
*  To get the shop parameter, parse it out of the confirmation redirect URL during the installation confirmation step of the authorization process.
 
 Store it for the duration of the user session. It’s best to use the session mechanism of your preferred framework. Otherwise, you can store the parameter in an HTTP-only cookie.
* */

// todo setup a proper Shop Origin retrieval later
const app = createApp({
 apiKey: SHOPIFY_API_KEY,
 shopOrigin: "seandezoysa.myshopify.com",
});

app // ERROR: ~/src/index.ts:48:1 - Promises must be handled appropriately
 .getState()
 .then(data => {
 console.info(data, ` data`)

});

