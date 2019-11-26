import "@babel/polyfill";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import Router from "koa-router";
import session from "koa-session";
const serve = require("koa-static");

import firebaseLib from "firebase/app";
import "firebase/firestore";
import "firebase/functions";



const firebase = firebaseLib.initializeApp('');


// import * as handlers from "./handlers/index";

// conditionally require yenv if process.env not populated
let env, yenv;
if (typeof process !== "undefined" &&
 typeof process.env !== "undefined") {
  yenv = require('yenv');
  env = yenv(); // defaults to .env.yaml
}


const port = 8081;


const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES} = env;

const koa = new Koa();
const router = new Router();
koa.use(session(koa));
koa.keys = [SHOPIFY_API_SECRET];


// serve anything in public folder
koa.use(serve("public"));


// authenticate shopify credentials. Then capture an access token and redirect to root
// root is whatever is at the root of path ./public/
koa.use(createShopifyAuth({
  apiKey : SHOPIFY_API_KEY
  , secret : SHOPIFY_API_SECRET
  , scopes : [SCOPES]
  , async afterAuth(ctx) {
    const {shop, accessToken} = ctx.session;
    ctx.cookies.set("shopOrigin", shop, { httpOnly : false});
    
    
    ctx.redirect("/");
  }
}));

// use graphQL middleware
koa.use(graphQLProxy({version : ApiVersion.October19}));


// check if the script tag is posted. Add if not there
// this is a middleware
// todo work in progress
const getAllScriptTags = async ctx => {
  try {
    const response = await fetch('admin/api/2019-10/script_tags.json', {
      method : "post"
    });
    const responseBody = await response.json();
    console.log(responseBody, `=====responseBody get all script tags=====`);
    
    ctx.res.statusCode = 200;
    ctx.respond("ctx respond triggered");
  }
  catch (e) {
    console.log(e, `=====e=====`);
    ctx.respond("error")
  }
};

// send an access token to any request
router.post("/unauth", async ctx => {
  // see what access tokens are available
  console.log(ctx.session.accessToken, `=====ctx.session.accessToken (general)=====`);
  ctx.body = ctx.session.accessToken;
  
  return;
  
  // post to storefrontaccesstoken api
  try {
    const response = await fetch("https://seandezoysa.myshopify.com/admin/api/2019-10/storefront_access_tokens.json", {
      method : "post"
    });
    const accessToken = await response.json();
    console.log(accessToken, `=====accessToken=====`);
    ctx.res.statusCode = 200;
    ctx.body = accessToken;
  }
  catch (e) {
    console.log(e, `=====error=====`);
  }
});


// run all remaining requests through verification middleware
router.get("*", verifyRequest(), async ctx => {
  
  console.log(ctx.session.accessToken, `=====accessToken inside router.get(*...=====`);
  
  ctx.respond = false;
  ctx.res.statusCode = 200;
});


koa.use(router.allowedMethods());
koa.use(router.routes());
koa.listen(port, () => console.log(`Koa server listening on port ${port}`));




export const helloWorld = (req, res) => {
  res.send('Hello, World');
};

