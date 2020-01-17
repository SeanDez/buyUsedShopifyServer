

export interface WhereDefinition {
  column: string
  , operator: string
  , value: string
}

export interface DocumentTarget {
  collection : string
  , document : string
}


export enum PayoutTypes {
  paypal = "Paypal"
  , check = "Check By Mail"
  , alipay = "Alipay"
  , google = 'Google Wallet'
}

export enum BuybackStatus {
  awaitingReceipt
  , issue
  , closed
}

export enum RecordTypes {
  globalRule
  , inventoryCutoffRule
  , productFixedPriceRule
  , blackListRule
  , buybackRecord
}


////// Schemas //////

/** No rule === assumed the setting is deselected
 */
export type GlobalRuleSchema = {
  storeId: string
  , globalPercent : number
}

export type InventoryOverrideRuleSchema = {
  storeId: string
  , inventoryThreshold : number
  , inventoryPercent : number
}

export type ProductSpecificRuleSchema = {
  storeId: string
  , productHandle: string
  , buyBackPrice: number
}

export type BlacklistedProductSchema = {
  storeId: string
  , productHandle: string
}


/** id is not given on creation, only retrieval
 */
export type BuybackRecord = {
  storeId: string
  , status: BuybackStatus
  , customer: {
    firstName: string
    , lastName: string
  }
  , payout: {
      method: PayoutTypes
    , account?: string
    , address?: string
    , city?: string
    , stateProvince?: string
    , postCode?: string
    , country?: string
  }
  , productList: {
      handle: string
    , name: string
    , price: number
    , quantity: number
  }[]
  , notes?: string
}
