

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


////// Buyback //////

type CustomerDetails = {
  firstName: string
  , lastName: string
}

type PayoutDetails = {
  method: PayoutTypes
  , account?: string
  , address?: string
  , city?: string
  , stateProvince?: string
  , postCode?: string
  , country?: string
}

type ProductDetails = {
  handle: string
  , name: string
  , price: number
  , quantity: number
}

export type BuybackRecord = {
  buybackId: string
  , status: BuybackStatus
  , customer: CustomerDetails
  , payout: PayoutDetails
  , productList: ProductDetails[]
  , notes?: string
}
