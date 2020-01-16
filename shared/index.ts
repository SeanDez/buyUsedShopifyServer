

export interface WhereDefinition {
  column: string
  , operator: string
  , value: string
}

export interface DocumentTarget {
  collection : string
  , document : string
}

export enum RuleTypes {
  global = "globalRule",
  inventory = "inventoryCutoffRule",
  product = "productFixedPriceRules",
  blacklist = "blackListRules"
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

