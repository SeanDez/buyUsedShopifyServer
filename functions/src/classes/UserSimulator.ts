import puppeteer, {Browser, Page} from "puppeteer";
const env = require("yenv");

interface HeadlessBrowser {
  browser: Browser
  , page : Page
}


export default class UserSimulator {
  private browser: Browser|null = null;
  private page: Page|null = null;
  
  private constructor() {

  }
  
  private async openBrowserAndTab(headless: boolean = true): Promise<void> {
    const browser: Browser = await puppeteer.launch({headless});
    const page: Page = await browser.newPage();
    
    // done in every repo example, probably helps reduces issues
    await page.setViewport({ width: 1280, height: 800 });
    
    // setting it onto the instance state
    this.browser = browser;
    this.page = page;
  }
  
  
  private async logIn(): Promise<void> {
    await this.page!.goto("https://accounts.shopify.com/lookup");
    await this.page!.type("#account_email", env.shopify_partner_email);
    await this.page!.click(".captcha__submit");
    await this.page!.waitForSelector("#account_password");
    await this.page!.type("#account_password", env.shopify_partner_password);
    await this.page!.waitForSelector("NextTabPanel-1-partner-program");
    
    console.log(this.page!.url(), `=====LOGGED IN: this.page!.url()=====`);
    return;
  }
  
  private async install(): Promise<void> {
    // install page
    await this.page!.goto("https://partners.shopify.com/1185756/apps/3207477/test");
    await this.page!.waitForSelector("#StoresListItem");
    await this.page!.click("#StoresListItem");
    
    // scope acceptance
    await this.page!.waitForSelector("");
    console.log(this.page!.url(), `=====scope acceptance page=====`);
    await this.page!.click("");
    
    // this is where the first break will occur
    await this.page!.waitForSelector("");
    console.log(this.page!.url(), `=====install complete url=====`);
    return;
  }
  
  private async uninstallApp(): Promise<void> {
    await this.page!.goto("");
    
    await this.page!.waitForSelector("");
    await this.page!.click("");
  
    await this.page!.waitForSelector("");
    console.log(this.page!.url(), `=====uninstall completion page=====`);
    return;
  }
  
  private async logOut(): Promise<void> {
    await this.page!.goto("");
    await this.page!.click("");
    await this.page!.waitForSelector("");
    console.log(this.page!.url(), `=====logout page=====`);
    return;
  }
  
  
  // --------------- Public Methods
  
  public async logInAndInstallApp(headless: boolean = true) {
    await this.logIn();
    await this.install();
  }
  
  public async uninstallAppAndLogout() {
    await this.uninstallApp();
    await this.logOut();
    await this.browser!.close();
  }
  
  /** Use this static factory method to create a new instance with async properties instantiated
   */
  public static async createInstance() {
    const instance = new UserSimulator();
    
    // run async methods here to populate class properties
    await instance.openBrowserAndTab();
    
    return instance;
  }
  
}