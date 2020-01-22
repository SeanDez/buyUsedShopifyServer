import "isomorphic-fetch";

const buildPricingPlanQuery = (redirectUrl: string) => `mutation {
  appSubscribeCreate(
    name : "Plan 1"
    returnUrl : "${redirectUrl}"
    test : true
    lineItems : [
      {
        plan : {
          appUsagePricingDetails : {
            cappedAmount : {
              amount : 10
              , currencyCode : USD
            }
            terms : "Up to 50 products"
          }
        }
      }
      {
        plan : {
          appRecurringPricingDetails : {
            price : {
              amount : 10
              , currencyCode : USD
            }
            terms : "some recurring terms"
          }
        }
      }
    ]
  )
  {
    userErrors {
      field
      message
    }
    confirmationUrl
    appSubscription {
      id
    }
  }
}`;


export const requestSubscriptionUrl = async (ctx: any, accessToken: string, shopDomain: string) =>  {
  const requestUrl = `https://${shopDomain}/admin/api/2019-10/graphql.json`;
  
  const response = await fetch(requestUrl, {
    method : 'post'
    , headers : {
      'content-type' : "application/json"
      , 'x-shopify-access-token' : accessToken
    },
    body : JSON.stringify({query: buildPricingPlanQuery(`https://${shopDomain}`)})
  });
  
  const responseBody = await response.json();
  const confirmationUrl = responseBody
    .data
    .appSubscriptionCreate
    .confirmationUrl;
  
  return confirmationUrl;
};