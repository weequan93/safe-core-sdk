"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameString = sameString;
exports.isZeroAddress = isZeroAddress;
exports.isSentinelAddress = isSentinelAddress;
exports.isRestrictedAddress = isRestrictedAddress;
const constants_1 = require("./constants");
function sameString(str1, str2) {
    return !!str1 && !!str2 && str1.toLowerCase() === str2.toLowerCase();
}
function isZeroAddress(address) {
    return sameString(address, constants_1.ZERO_ADDRESS);
}
function isSentinelAddress(address) {
    return sameString(address, constants_1.SENTINEL_ADDRESS);
}
function isRestrictedAddress(address) {
    return isZeroAddress(address) || isSentinelAddress(address);
}
//# sourceMappingURL=address.js.map