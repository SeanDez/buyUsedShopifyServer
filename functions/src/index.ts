////// Initial Setup //////
import {redirect} from "@shopify/app-bridge/client/redirect";

import Express, {Request, Response} from "express";
import crypto from 'crypto';
import cookie from 'cookie';
import nonce from 'nonce';
import queryString from 'querystring';
import firebaseAdmin from "firebase-admin";
// import firebaseFunctions from 'firebase-functions';
const firebaseFunctions = require('firebase-functions');

const express = Express();

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, SERVER_APP_URL, GOOGLE_APPLICATION_CREDENTIALS } = process.env;


////// Initialize Firebase //////
firebaseAdmin.initializeApp({
 // checks env.GOOGLE_APPLICATION_CREDENTIALS. Then checks if another service is already configured
 credential: firebaseAdmin.credential.applicationDefault(),
 databaseURL: 'https://buyusedshopify.firebaseio.com'
});


express.get('/', (req: Request, res: Response): void => {
 res.send('Express App Running')
});

/* * * * * * * * * * * * * * * * * * * * *
             Utility Functions
* * * * * * * * * * * * * * * * * * * * */

const buildRedirectUri = () => `${SERVER_APP_URL}/accessTokenRequestor`;
const buildInstallUrl = (shop: string, state: string, redirectUri: string) => `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&state=${state}&redirect_uri=${redirectUri}`;
const buildAccessTokenRequestUrl = (shop: string) => `https://${shop}/admin/oauth/access_token`;
const buildShopDataRequestUrl = (shop: string) => `https://${shop}/admin/shop.json`;
const generateEncryptedHash = (params: string) => {
 if (typeof  SHOPIFY_API_SECRET === "string") {
  return crypto.createHmac("sha256", SHOPIFY_API_SECRET).update(params).digest('hex');
 } else {
  throw Error("during generateEncryptedHash() SHOPIFY_API_SECRET was not a string")
 }
};

const fetchAccessToken = async (shop: string, requestBody: object) => {
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
   console.log(e, `=====error=====`);
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
  console.log(e, `=====error=====`);
 }
};


/* * * * * * * * * * * * * * * * * * * * *
              Route Handlers
* * * * * * * * * * * * * * * * * * * * */

express.get("/resourceServer/authorizationRequestor", (req: Request, res: Response): Response|void => {
 const shopParam = req.query.shop;
 if (!shopParam) return res.status(400).send("No shop param specified");
 
 const state = nonce();
 const installShopUrl = buildInstallUrl(shopParam, state, buildRedirectUri());
 
 // set state to a cookie keyed to "state"
 res.cookie("state", state);
 
 // this is how you redirect to a iframed shopify app url
 res.redirect(installShopUrl);
});


express.get("/shopify/accessTokenRequestor", async (req: Request, res: Response): Promise<Response|void> => {
 const {shop, code, state} = req.query;
 
 // parse the cookie string into an array. if state cookie is "", err
 const stateCookie = cookie.parse(req.headers.cookie as string || "").state;
 if (!stateCookie) return res.status(400).send("No state cookie");
 
 if (state !== stateCookie) return res.status(403).send('Cookie failed verification');
 
 const {hmac, ...params} = req.query;
 const queryParams = queryString.stringify(params);
 const hash = generateEncryptedHash(queryParams);
 if (hash !== hmac) return res.status(400).send("HMAC validation failed");
 
 try {
  const shopCredentials = {
   client_id : SHOPIFY_API_KEY
   , client_secret : SHOPIFY_API_SECRET
   , code
  };
  const tokenResponse = await  fetchAccessToken(shop, shopCredentials);
  const {access_token} = tokenResponse;
  const shopData = await fetchShopData(shop, access_token);
  res.send(shopData.shop)
 }
 catch (e) {
  console.log(e, `=====error during fetchAccessToken=====`);
  res.status(400).send("error during fetchAccessToken")
 }
});


// export the function to firebase functions
// Run "firebase deploy --only functions:func1, functions:func2,hosting"
exports.buyUsedServer = firebaseFunctions.https.onRequest(express);
