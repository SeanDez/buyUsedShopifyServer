import express, {Request, Response} from "express";

import OAuth from "../classes/OAuth";
import AppBridge from "../classes/AppBridge";

import {ShopifyAuthCodeCredentials} from "../interfaces";
import {getRedirectUri, fetchShopData, fetchAccessToken, generateEncryptedHash, buildInstallUrl, buildAccessTokenRequestUrl, buildShopDataRequestUrl} from "../utilities/oauthHelpers";
import keys from "../keys";
import util from "util";
import cookie from "cookie";
import queryString from "querystring";

const nonce = require("nonce")();
const router = express.Router();

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = keys;


router.get('/', (req: Request, res: Response): void => {
 console.log(`=====get request on: /=====`);
 res.send(`Express App Running - ${new Date()}`)
});


/** build the OAuth Server URL for granting an Auth Code. Redirect the browser there
 * also set a nonce for comparison later
 */
// router.get("/authorizationRequestor/", async(req: Request, res: Response): Promise<Response|void> => {
//  console.log(`=====/authorizationRequestor/ 2.5 begin=====`);
//
//  const appBridge = new AppBridge(req, res, keys);
//  console.log(`=====line 33 initialAuth.ts=====`);
//
//  redirects to scope grant page
 // await appBridge.setCookieThenRequestScopeGrants();
 // console.log(`=====line 37 initialAuth.ts=====`);
 
 // old code, delete when referencing not needed
 // const oAuth = new OAuth(req, res, keys);
 //
 // // this will do a res.redirect
 // await oAuth.requestScopeGrants();
 //
 // const shopParam = req.query.shop;
 // if (!shopParam) return res.status(400).send("No shop param specified");
 //
 // const state = nonce();
 // const installShopUrl = buildInstallUrl(shopParam, state, getRedirectUri());
 //
 // // set generated nonce to a cookie keyed to "state". (Will be used for verification)
 // res.cookie("state", state);
 //
 // // redirect browser to the scopes page for front channel permission granting
 // console.log(`=====/auth...requestor end=====`);
 // res.redirect(installShopUrl);
// });


// router.get("/accessTokenRequestor/", async (req: Request, res: Response): Promise<Response|void> => {
//  console.log(req, `=====accessTokenRequestor req / begin=====`);
//
//  const appBridge = new AppBridge(req, res, keys);
//
//  const app = appBridge.oAuthThenReturnGeneralToken();
//
//  try {
//   const appState = await app.getState();
//   console.log(util.inspect(appState, {colors: true, depth : 10}), `=====appState=====`);
//  }
//  catch (e) {
//   console.log(util.inspect(e, {colors: true, depth : 10}), `=====error during app state fetching=====`);
//  }
//
//
//  // const {shop, code, state} = req.query;
//  //
//  // // parse the cookie string into an array. if state cookie is "", err
//  // const stateCookie = cookie.parse(req.headers.cookie as string || "").state;
//  // if (!stateCookie) return res.status(400).send("No state cookie");
//  //
//  // if (state !== stateCookie) return res.status(403).send('Cookie failed verification');
//  //
//  // const {hmac, ...params} = req.query;
//  // const queryParams = queryString.stringify(params);
//  // const hash = generateEncryptedHash(queryParams);
//  // if (hash !== hmac) return res.status(400).send("HMAC validation failed");
//  //
//  // try {
//  //  const authorizedCredentials: ShopifyAuthCodeCredentials = {
//  //   client_id : SHOPIFY_API_KEY
//  //   , client_secret : SHOPIFY_API_SECRET
//  //   , code
//  //  };
//  //  const tokenResponse = await fetchAccessToken(shop, authorizedCredentials);
//  //  const {access_token} = tokenResponse;
//  //
//  //  const shopData = await fetchShopData(shop, access_token);
//  //
//  //  // todo set this part up to load the hosted index.html file with my React app
//  //  console.log(res, `=====accessTokenRequestor res / end=====`);
//  //  console.log(util.inspect(res, {colors: true, depth : 2}), `=====res=====`);
//  //  res.send(shopData.shop)
//  // }
//  // catch (e) {
//  //  console.log(util.inspect(e, {colors: true, depth : 2}), `=====Error during fetch Access Token=====`);
//  //  res.status(400).send("Error during fetchAccessToken")
//  // }
// });

export default router;