import "isomorphic-fetch";
import Koa from "koa";
import koaSession from "koa-session";
import {verifyRequest} from "@shopify/koa-shopify-auth";
import keys from "./keys";
import OAuth from "./classes/OAuth";
import shopifyGraphQLProxy, {ApiVersion} from "@shopify/koa-shopify-graphql-proxy";
const cors = require("cors");

const Router = require("koa-router");
const router = new Router();

const firebaseFunctions = require('firebase-functions');


/** ////// Client Application Back End for Shopify App: "Buy Used" //////
 *
 * Deploy to production by navigating to /functions directory and running
 * "firebase deploy --only functions"
 *
 * Deploy to localhost:5000 with "firebase serve --only functions"
 * Run "ngrok http 5000" as well.
 * Shopify won't respond to non https client apps
 */

////// Setup //////
const koa = new Koa();

const {GOOGLE_APPLICATION_CREDENTIALS} = process.env;

// for koa-session
koa.keys = [keys.SHOPIFY_API_SECRET];


////// Middleware (on all routes) //////

// allow cross-origin requests
// koa.use(cors({origin : true}));

koa.use(koaSession(koa));

const oAuth = new OAuth(keys);

// sets up /auth and /auth/callback
koa.use((ctx: any, next: any) => {
 oAuth.createShopifyAuthRoutes();
 next();
});

koa.use(shopifyGraphQLProxy({version : ApiVersion.October19}));

// any requests below the next line are verified
// koa.use(verifyRequest({
//  authRoute : "/buyusedshopify/us-central1/buyUsedServer/auth"
//   })
// );
koa.use(verifyRequest());


////// Routing //////

// express.use(initialAuthRouter);
router.get("/", (ctx: any, next: any) => {
 ctx.response.body = 'placeholder';
 next();
});

koa.use(router.routes());

////// Other Middleware //////


////// Exporting to Firebase Functions //////
exports.buyUsedServer = firebaseFunctions.https.onRequest(koa.callback());
