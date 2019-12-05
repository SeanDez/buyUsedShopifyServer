import express, {Request, Response} from "express";
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
router.get("/authorizationRequestor/", (req: Request, res: Response): Response|void => {
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


router.get("/accessTokenRequestor/", async (req: Request, res: Response): Promise<Response|void> => {
 console.log(req, `=====accessTokenRequestor req / begin=====`);
 const {shop, code, state} = req.query;
 console.log(util.inspect(req.query, {colors: true, depth : 2}), `=====req.query=====`);
 
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
  console.log(util.inspect(res, {colors: true, depth : 2}), `=====res=====`);
  res.send(shopData.shop)
 }
 catch (e) {
  console.log(util.inspect(e, {colors: true, depth : 2}), `=====Error during fetch Access Token=====`);
  res.status(400).send("Error during fetchAccessToken")
 }
});

export default router;