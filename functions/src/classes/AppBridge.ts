import {Request, Response} from "express";
import "isomorphic-fetch";
import util from "util";
import cookie from "cookie";
import queryString from "querystring";
import ShopifyApiBase from "./ShopifyApiBase";
import {ShopifyAuthCodeCredentials} from "../interfaces";
import crypto from "crypto";
import createApp from "@shopify/app-bridge";

const nonce = require("nonce")();

interface Keys {
  SHOPIFY_API_KEY: string,
  SHOPIFY_API_SECRET: string,
  SCOPES: string,
  CLIENT_APP_URL: string
}

export default class AppBridge {
  protected shopDomain: string;
  protected stateNonce: string;
  protected keys: Keys;
  protected req: Request;
  protected res: Response;
  
  constructor(req: Request, res: Response, keys: Keys) {
    this.shopDomain = req.query.shop;
    this.stateNonce = nonce();
    this.keys = keys;
    this.req = req;
    this.res = res;
  }
  
  
  protected respondWith400IfNoShop(): Response|void {
    if (Boolean(this.shopDomain) === false) {
      return this.res
        .status(400)
        .send("No shop parameter specified");
    }
  }
  
  
  protected setCookieToNonceValue(): Response {
    return this.res.cookie("buyUsedStateNonce", this.stateNonce);
  }
  
  
  protected buildInstallUrl() {
    return `https://${this.shopDomain}
    /admin/oauth/authorize?client_id=${this.keys.SHOPIFY_API_KEY}
    &scope=${this.keys.SCOPES}
    &state=${this.stateNonce}
    &redirect_uri=${this.keys.CLIENT_APP_URL}`;
  }
  
  
  protected verifyCookieAgainstRequest(): Response|void {
    const cookieStateNonce: string = cookie.parse(this.req.headers.cookie as string).buyUsedStateNonce;
    
    if(Boolean(cookieStateNonce) === false) {
      return this.res
        .status(403)
        .send("Failed request verification");
    }
  }
  
  
  protected generateEncryptedHash (params: string) {
    return crypto.createHmac("sha256", this.keys.SHOPIFY_API_SECRET).update(params).digest('hex');
  };
  
  protected verifyHmacAgainstHash(): Response|void {
    const {hmac, ...otherParams} = this.req.query;
    const queryParams: string = queryString.stringify(otherParams);
    
    const hash = this.generateEncryptedHash(queryParams);
    if (hash !== hmac) {
      return this.res
        .status(400)
        .send("HMAC validation failed")
    }
  }
  
  protected buildAccessTokenRequestUrl = () => `https://${this.shopDomain}/admin/oauth/access_token`;
  
  
  protected async requestAccessToken() {
    try {
      const response = await fetch('placeholder', {
        method : "post"
        , headers : {
          'content-type' : 'application/json'
        }
        , body : JSON.stringify('placeholder')
      });
      return await response.json();
    }
    catch (e) {
      console.log(util.inspect(e, {colors: true, depth : 10}), `=====error=====`);
    }
  }
  
  
  // --------------- Public Methods
  
  public async setCookieThenRequestScopeGrants(): Promise<void> {
    await this.respondWith400IfNoShop();
    this.setCookieToNonceValue();
    
    const installShopUrl = this.buildInstallUrl();
    console.log(installShopUrl, `=====installShopUrl=====`);
    
    this.res.redirect(installShopUrl);
  }
  
  /** can use await app.getState() to get details
   */
  public oAuthThenReturnGeneralToken() {
    const app = createApp({
      apiKey : this.keys.SHOPIFY_API_KEY
      , shopOrigin : this.shopDomain
    });
    
    return app;
  }
  
  /** This method's pattern relies on class properties until the key final step, securing the token. then it just returns it
   */
  public async getAccessToken() {
    this.verifyCookieAgainstRequest();
    this.verifyHmacAgainstHash();
    
    const generalToken = await this.requestAccessToken();
    
    return generalToken;
  }
  
}