import crypto from "crypto";
import fetch from "isomorphic-fetch";
import util from "util";
import keys from "../keys";
import {ShopifyAuthCodeCredentials} from "../interfaces";

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, CLIENT_APP_URL, SCOPES} = keys;


export const getRedirectUri = () => {
 console.log(CLIENT_APP_URL, `=====CLIENT_APP_URL=====`);
 
 if (Boolean(CLIENT_APP_URL)) { return `${CLIENT_APP_URL}`; }
 else {
  console.log(`=====Redirect URI is undefined=====`);
  throw Error("Redirect URI is undefined");
 }
};


export const buildInstallUrl = (shop: string, state: string, redirectUri: string) => `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SCOPES}&state=${state}&redirect_uri=${CLIENT_APP_URL}`;


export const buildAccessTokenRequestUrl = (shop: string) => `https://${shop}/admin/oauth/access_token`;


export const buildShopDataRequestUrl = (shop: string) => `https://${shop}/admin/shop.json`;


export const generateEncryptedHash = (params: string) => {
 if (typeof  SHOPIFY_API_SECRET === "string") {
  return crypto.createHmac("sha256", SHOPIFY_API_SECRET).update(params).digest('hex');
 } else {
  throw Error("during generateEncryptedHash() SHOPIFY_API_SECRET was not a string")
 }
};


export const fetchAccessToken = async (shop: string, requestBody: ShopifyAuthCodeCredentials) => {
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


export const fetchShopData = async (shop: string, accessToken: string) => {
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
