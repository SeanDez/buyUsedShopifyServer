declare module 'nonce' {
 export default function nonce(length?: number): string
}

declare module "keys" {
 interface KeysInterface {
  SHOPIFY_API_KEY : string
  , SHOPIFY_API_SECRET : string
  , SCOPES : string
  , CLIENT_APP_URL : string
 }
 
 export default KeysInterface;
}

