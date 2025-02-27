"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ContractManager_instances, _ContractManager_contractNetworks, _ContractManager_isL1SafeSingleton, _ContractManager_safeContract, _ContractManager_multiSendContract, _ContractManager_multiSendCallOnlyContract, _ContractManager_initializeContractManager;
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../contracts/config");
const safeDeploymentContracts_1 = require("../contracts/safeDeploymentContracts");
const types_1 = require("../utils/types");
const utils_1 = require("../contracts/utils");
class ContractManager {
    constructor() {
        _ContractManager_instances.add(this);
        _ContractManager_contractNetworks.set(this, void 0);
        _ContractManager_isL1SafeSingleton.set(this, void 0);
        _ContractManager_safeContract.set(this, void 0);
        _ContractManager_multiSendContract.set(this, void 0);
        _ContractManager_multiSendCallOnlyContract.set(this, void 0);
    }
    static async init(config, safeProvider) {
        const contractManager = new ContractManager();
        await __classPrivateFieldGet(contractManager, _ContractManager_instances, "m", _ContractManager_initializeContractManager).call(contractManager, config, safeProvider);
        return contractManager;
    }
    get contractNetworks() {
        return __classPrivateFieldGet(this, _ContractManager_contractNetworks, "f");
    }
    get isL1SafeSingleton() {
        return __classPrivateFieldGet(this, _ContractManager_isL1SafeSingleton, "f");
    }
    get safeContract() {
        return __classPrivateFieldGet(this, _ContractManager_safeContract, "f");
    }
    get multiSendContract() {
        return __classPrivateFieldGet(this, _ContractManager_multiSendContract, "f");
    }
    get multiSendCallOnlyContract() {
        return __classPrivateFieldGet(this, _ContractManager_multiSendCallOnlyContract, "f");
    }
}
_ContractManager_contractNetworks = new WeakMap(), _ContractManager_isL1SafeSingleton = new WeakMap(), _ContractManager_safeContract = new WeakMap(), _ContractManager_multiSendContract = new WeakMap(), _ContractManager_multiSendCallOnlyContract = new WeakMap(), _ContractManager_instances = new WeakSet(), _ContractManager_initializeContractManager = async function _ContractManager_initializeContractManager(config, safeProvider) {
    const { isL1SafeSingleton, contractNetworks, predictedSafe, safeAddress } = config;
    const chainId = await safeProvider.getChainId();
    const customContracts = contractNetworks?.[chainId.toString()];
    __classPrivateFieldSet(this, _ContractManager_contractNetworks, contractNetworks, "f");
    __classPrivateFieldSet(this, _ContractManager_isL1SafeSingleton, isL1SafeSingleton, "f");
    let safeVersion;
    if ((0, types_1.isSafeConfigWithPredictedSafe)(config)) {
        safeVersion = predictedSafe?.safeDeploymentConfig?.safeVersion ?? config_1.DEFAULT_SAFE_VERSION;
    }
    else {
        try {
            // We try to fetch the version of the Safe from the blockchain
            safeVersion = await (0, utils_1.getSafeContractVersion)(safeProvider, safeAddress);
        }
        catch (e) {
            // if contract is not deployed we use the default version
            safeVersion = config_1.DEFAULT_SAFE_VERSION;
        }
        __classPrivateFieldSet(this, _ContractManager_safeContract, await (0, safeDeploymentContracts_1.getSafeContract)({
            safeProvider,
            safeVersion,
            isL1SafeSingleton,
            customSafeAddress: safeAddress,
            customContracts
        }), "f");
    }
    __classPrivateFieldSet(this, _ContractManager_multiSendContract, await (0, safeDeploymentContracts_1.getMultiSendContract)({
        safeProvider,
        safeVersion,
        customContracts
    }), "f");
    __classPrivateFieldSet(this, _ContractManager_multiSendCallOnlyContract, await (0, safeDeploymentContracts_1.getMultiSendCallOnlyContract)({
        safeProvider,
        safeVersion,
        customContracts
    }), "f");
};
exports.default = ContractManager;
//# sourceMappingURL=contractManager.js.map