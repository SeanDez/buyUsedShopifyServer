"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayoutTypes;
(function (PayoutTypes) {
    PayoutTypes["paypal"] = "Paypal";
    PayoutTypes["check"] = "Check By Mail";
    PayoutTypes["alipay"] = "Alipay";
    PayoutTypes["google"] = "Google Wallet";
})(PayoutTypes = exports.PayoutTypes || (exports.PayoutTypes = {}));
var BuybackStatus;
(function (BuybackStatus) {
    BuybackStatus[BuybackStatus["awaitingReceipt"] = 0] = "awaitingReceipt";
    BuybackStatus[BuybackStatus["issue"] = 1] = "issue";
    BuybackStatus[BuybackStatus["closed"] = 2] = "closed";
})(BuybackStatus = exports.BuybackStatus || (exports.BuybackStatus = {}));
var RecordTypes;
(function (RecordTypes) {
    RecordTypes[RecordTypes["globalRule"] = 0] = "globalRule";
    RecordTypes[RecordTypes["inventoryCutoffRule"] = 1] = "inventoryCutoffRule";
    RecordTypes[RecordTypes["productFixedPriceRule"] = 2] = "productFixedPriceRule";
    RecordTypes[RecordTypes["blackListRule"] = 3] = "blackListRule";
    RecordTypes[RecordTypes["buybackRecord"] = 4] = "buybackRecord";
})(RecordTypes = exports.RecordTypes || (exports.RecordTypes = {}));
//# sourceMappingURL=index.js.map