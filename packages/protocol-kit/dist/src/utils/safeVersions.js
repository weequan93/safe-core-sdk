"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSafeFeature = exports.SAFE_FEATURES = void 0;
exports.isSafeContractCompatibleWithRequiredTxGas = isSafeContractCompatibleWithRequiredTxGas;
exports.isSafeContractCompatibleWithSimulateAndRevert = isSafeContractCompatibleWithSimulateAndRevert;
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
var SAFE_FEATURES;
(function (SAFE_FEATURES) {
    SAFE_FEATURES["SAFE_TX_GAS_OPTIONAL"] = "SAFE_TX_GAS_OPTIONAL";
    SAFE_FEATURES["SAFE_TX_GUARDS"] = "SAFE_TX_GUARDS";
    SAFE_FEATURES["SAFE_FALLBACK_HANDLER"] = "SAFE_FALLBACK_HANDLER";
    SAFE_FEATURES["ETH_SIGN"] = "ETH_SIGN";
    SAFE_FEATURES["ACCOUNT_ABSTRACTION"] = "ACCOUNT_ABSTRACTION";
    SAFE_FEATURES["REQUIRED_TXGAS"] = "REQUIRED_TXGAS";
    SAFE_FEATURES["SIMULATE_AND_REVERT"] = "SIMULATE_AND_REVERT";
    SAFE_FEATURES["PASSKEY_SIGNER"] = "PASSKEY_SIGNER";
    SAFE_FEATURES["SAFE_L2_CONTRACTS"] = "SAFE_L2_CONTRACTS";
})(SAFE_FEATURES || (exports.SAFE_FEATURES = SAFE_FEATURES = {}));
const SAFE_FEATURES_BY_VERSION = {
    [SAFE_FEATURES.SAFE_TX_GAS_OPTIONAL]: '>=1.3.0',
    [SAFE_FEATURES.SAFE_TX_GUARDS]: '>=1.3.0',
    [SAFE_FEATURES.SAFE_FALLBACK_HANDLER]: '>=1.1.1',
    [SAFE_FEATURES.ETH_SIGN]: '>=1.1.0',
    [SAFE_FEATURES.ACCOUNT_ABSTRACTION]: '>=1.3.0',
    [SAFE_FEATURES.REQUIRED_TXGAS]: '<=1.2.0',
    [SAFE_FEATURES.SIMULATE_AND_REVERT]: '>=1.3.0',
    [SAFE_FEATURES.PASSKEY_SIGNER]: '>=1.3.0',
    [SAFE_FEATURES.SAFE_L2_CONTRACTS]: '>=1.3.0'
};
const hasSafeFeature = (feature, version) => {
    if (!(feature in SAFE_FEATURES_BY_VERSION)) {
        return false;
    }
    return (0, satisfies_1.default)(version, SAFE_FEATURES_BY_VERSION[feature]);
};
exports.hasSafeFeature = hasSafeFeature;
async function isSafeContractCompatibleWithRequiredTxGas(safeContract) {
    const safeVersion = safeContract.safeVersion;
    if (!(0, exports.hasSafeFeature)(SAFE_FEATURES.REQUIRED_TXGAS, safeVersion)) {
        throw new Error('Current version of the Safe does not support the requiredTxGas functionality');
    }
    return safeContract;
}
async function isSafeContractCompatibleWithSimulateAndRevert(safeContract) {
    const safeVersion = safeContract.safeVersion;
    if (!(0, exports.hasSafeFeature)(SAFE_FEATURES.SIMULATE_AND_REVERT, safeVersion)) {
        throw new Error('Current version of the Safe does not support the simulateAndRevert functionality');
    }
    return safeContract;
}
//# sourceMappingURL=safeVersions.js.map