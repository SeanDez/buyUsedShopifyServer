import {redirect} from "@shopify/app-bridge/client/redirect";
import keys from "./keys";
import fetch from "isomorphic-fetch";
import util from "util";
import Express, {Request, Response} from "express";
import crypto from 'crypto';
import cookie from 'cookie';
import queryString from 'querystring';
import firebaseAdmin from "firebase-admin";
// import firebaseFunctions from 'firebase-functions';
const nonce = require('nonce')();
const firebaseFunctions = require('firebase-functions');


////// Initialize Firebase //////
firebaseAdmin.initializeApp({
 // checks env.GOOGLE_APPLICATION_CREDENTIALS. Then checks if another service is already configured
 credential: firebaseAdmin.credential.applicationDefault(),
 databaseURL: 'https://buyusedshopify.firebaseio.com'
});

////// Basic Setup //////
const express = Express();

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, CLIENT_APP_URL, SCOPES} = keys;
// const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, CLIENT_APP_URL, SCOPES} = {SHOPIFY_API_SECRET: "", SHOPIFY_API_KEY: "", CLIENT_APP_URL : "", SCOPES: ""};


const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;


/* * * * * * * * * * * * * * * * * * * * *
                Interfaces
* * * * * * * * * * * * * * * * * * * * */

interface ShopifyAuthCodeCredentials {
 client_id : string
 , client_secret : string
 , code : string
}


/* * * * * * * * * * * * * * * * * * * * *
             Utility Functions
* * * * * * * * * * * * * * * * * * * * */

const getRedirectUri = () => {
 console.log(CLIENT_APP_URL, `=====CLIENT_APP_URL=====`);
 
 if (Boolean(CLIENT_APP_URL)) { return `${CLIENT_APP_URL}`; }
 else {
  console.log(`=====Redirect URI is undefined=====`);
  throw Error("Redirect URI is undefined");
 }
};
const buildInstallUrl = (shop: string, state: string, redirectUri: string) => `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&state=${state}&redirect_uri=${CLIENT_APP_URL}`;
const buildAccessTokenRequestUrl = (shop: string) => `https://${shop}/admin/oauth/access_token`;
const buildShopDataRequestUrl = (shop: string) => `https://${shop}/admin/shop.json`;
const generateEncryptedHash = (params: string) => {
 if (typeof  SHOPIFY_API_SECRET === "string") {
  return crypto.createHmac("sha256", SHOPIFY_API_SECRET).update(params).digest('hex');
 } else {
  throw Error("during generateEncryptedHash() SHOPIFY_API_SECRET was not a string")
 }
};

const fetchAccessToken = async (shop: string, requestBody: ShopifyAuthCodeCredentials) => {
 try {
  const response = await fetch(buildAccessTokenRequestUrl(shop), {
   method : "post"
   , headers : {
    "Content-Type" : "application/json"
   }
   , body : JSON.stringify(requestBody)
  });
  return await response.json();
  
  }
  catch (e) {
   console.log(util.inspect(e, {colors: true, depth : 10}), `=====error=====`);
  }
};

const fetchShopData = async (shop: string, accessToken: string) => {
 try {
  const response = await fetch(buildShopDataRequestUrl(shop), {
   headers : {
    "Content-Type" : "application/json"
    , "X-Shopify-Access-Token" : accessToken
   }
  });
 return await response.json();
 }
 catch (e) {
  console.log(util.inspect(e, {colors: true, depth : 10}), `=====error=====`);
 }
};


/* * * * * * * * * * * * * * * * * * * * *
              Route Handlers
* * * * * * * * * * * * * * * * * * * * */


express.get('/', (req: Request, res: Response): void => {
 console.log(`=====get request on: /=====`);
 res.send(`Express App Running - ${new Date()}`)
});

/** build the OAuth Server URL for granting an Auth Code. Redirect the browser there
 * also set a nonce for comparison later
 */
express.get("/authorizationRequestor/", (req: Request, res: Response): Response|void => {
 console.log(`=====/authorizationRequestor/ 2.5 begin=====`);
 const shopParam = req.query.shop;
 if (!shopParam) return res.status(400).send("No shop param specified");
 
 const state = nonce();
 const installShopUrl = buildInstallUrl(shopParam, state, getRedirectUri());

 // set generated nonce to a cookie keyed to "state". (Will be used for verification)
 res.cookie("state", state);
 
 // redirect browser to the scopes page for front channel permission granting
 console.log(`=====/auth...requestor end=====`);
 res.redirect(installShopUrl);
});


express.get("/accessTokenRequestor/", async (req: Request, res: Response): Promise<Response|void> => {
 console.log(req, `=====accessTokenRequestor req / begin=====`);
 const {shop, code, state} = req.query;
 console.log(util.inspect(req.query, {colors: true, depth : 10}), `=====req.query=====`);
 
 // parse the cookie string into an array. if state cookie is "", err
 const stateCookie = cookie.parse(req.headers.cookie as string || "").state;
 if (!stateCookie) return res.status(400).send("No state cookie");
 
 if (state !== stateCookie) return res.status(403).send('Cookie failed verification');
 
 const {hmac, ...params} = req.query;
 const queryParams = queryString.stringify(params);
 const hash = generateEncryptedHash(queryParams);
 if (hash !== hmac) return res.status(400).send("HMAC validation failed");
 
 try {
  const authorizedCredentials: ShopifyAuthCodeCredentials = {
   client_id : SHOPIFY_API_KEY
   , client_secret : SHOPIFY_API_SECRET
   , code
  };
  const tokenResponse = await fetchAccessToken(shop, authorizedCredentials);
  const {access_token} = tokenResponse;
  
  const shopData = await fetchShopData(shop, access_token);
  
  // todo set this part up to load the hosted index.html file with my React app
  console.log(res, `=====accessTokenRequestor res / end=====`);
  console.log(util.inspect(res, {colors: true, depth : 10}), `=====res=====`);
  res.send(shopData.shop)
 }
 catch (e) {
  console.log(util.inspect(e, {colors: true, depth : 10}), `=====Error during fetch Access Token=====`);
  res.status(400).send("Error during fetchAccessToken")
 }
});


// export the function to firebase functions
// Run "firebase deploy --only functions:func1, functions:func2,hosting"
exports.buyUsedServer = firebaseFunctions.https.onRequest(express);
