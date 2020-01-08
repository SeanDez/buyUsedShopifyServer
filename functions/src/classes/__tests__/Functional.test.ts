import puppeteer from "puppeteer";
const env = require('yenv');



describe("[functional] live tests", () => {
     beforeAll(async () => {

     });
    
    test('should be titled "Google"', async () => {
      
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      
      // find login page in browser
      // await page.goto('https://google.com');
      
      // log into shopify
      await page.goto("https://partners.shopify.com/1185756/apps/3207477/test", {waitUntil : "load"});
      console.log(page.url, `=====arrived at shopify login screen=====`);
      
      // fill and submit form
      // email screen
      const emailInput = await page.focus("#account_email");
      await emailInput.type(env.shopify_partner_email);
      
      try {
        const emailForm = await page.$("form[novalidate=novalidate]");
        await emailForm.evaluate(form => form.submit());
        console.log(`=====login form email page submitted=====`);
      } catch (e) { console.log(e, `=====failed to submit form=====`); }
  
      // password screen
      await page.waitForNavigation({waitUntil: 'load'});
      console.log(page.url(), `=====navigated to this page=====`);
      
      
  
      // grant scopes
      
      
      // confirm redirect is valid
      
      
      
      await browser.close();
    }, 60000);

  
  // OAuth connects to the API and passes verification
  // prints log statement to the terminal
  test('receives general token, passing all OAuth steps', () => {
    /** test passes if a general token value is detected and of proper length. it is assumed to be valid on that criteria
     */
    // send request to OAuth server. receive back token
    
    
    
  });
  
  // A dummy script tag is posted to the back end
  
  
  // A dummy script tag is retrieved and matched
  
  
  // [cleanup] the dummy script tag is deleted
  
  
  // A storefront token is created and/or
  
  
  
  
  
  
  
  
  test("", () => {
    expect(true).toEqual(true);
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
});