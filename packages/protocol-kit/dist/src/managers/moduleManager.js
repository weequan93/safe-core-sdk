"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ModuleManager_safeProvider, _ModuleManager_safeContract;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
class ModuleManager {
    constructor(safeProvider, safeContract) {
        _ModuleManager_safeProvider.set(this, void 0);
        _ModuleManager_safeContract.set(this, void 0);
        __classPrivateFieldSet(this, _ModuleManager_safeProvider, safeProvider, "f");
        __classPrivateFieldSet(this, _ModuleManager_safeContract, safeContract, "f");
    }
    validateModuleAddress(moduleAddress) {
        const isValidAddress = __classPrivateFieldGet(this, _ModuleManager_safeProvider, "f").isAddress(moduleAddress);
        if (!isValidAddress || (0, utils_1.isRestrictedAddress)(moduleAddress)) {
            throw new Error('Invalid module address provided');
        }
    }
    validateModuleIsNotEnabled(moduleAddress, modules) {
        const moduleIndex = modules.findIndex((module) => (0, utils_1.sameString)(module, moduleAddress));
        const isEnabled = moduleIndex >= 0;
        if (isEnabled) {
            throw new Error('Module provided is already enabled');
        }
    }
    validateModuleIsEnabled(moduleAddress, modules) {
        const moduleIndex = modules.findIndex((module) => (0, utils_1.sameString)(module, moduleAddress));
        const isEnabled = moduleIndex >= 0;
        if (!isEnabled) {
            throw new Error('Module provided is not enabled yet');
        }
        return moduleIndex;
    }
    async getModules() {
        if (!__classPrivateFieldGet(this, _ModuleManager_safeContract, "f")) {
            throw new Error('Safe is not deployed');
        }
        const [modules] = await __classPrivateFieldGet(this, _ModuleManager_safeContract, "f").getModules();
        return [...modules];
    }
    async getModulesPaginated(start, pageSize) {
        if (!__classPrivateFieldGet(this, _ModuleManager_safeContract, "f")) {
            throw new Error('Safe is not deployed');
        }
        const [modules, next] = await __classPrivateFieldGet(this, _ModuleManager_safeContract, "f").getModulesPaginated([start, BigInt(pageSize)]);
        return { modules: modules, next };
    }
    async isModuleEnabled(moduleAddress) {
        if (!__classPrivateFieldGet(this, _ModuleManager_safeContract, "f")) {
            throw new Error('Safe is not deployed');
        }
        const [isModuleEnabled] = await __classPrivateFieldGet(this, _ModuleManager_safeContract, "f").isModuleEnabled([moduleAddress]);
        return isModuleEnabled;
    }
    async encodeEnableModuleData(moduleAddress) {
        if (!__classPrivateFieldGet(this, _ModuleManager_safeContract, "f")) {
            throw new Error('Safe is not deployed');
        }
        this.validateModuleAddress(moduleAddress);
        const modules = await this.getModules();
        this.validateModuleIsNotEnabled(moduleAddress, modules);
        return __classPrivateFieldGet(this, _ModuleManager_safeContract, "f").encode('enableModule', [moduleAddress]);
    }
    async encodeDisableModuleData(moduleAddress) {
        if (!__classPrivateFieldGet(this, _ModuleManager_safeContract, "f")) {
            throw new Error('Safe is not deployed');
        }
        this.validateModuleAddress(moduleAddress);
        const modules = await this.getModules();
        const moduleIndex = this.validateModuleIsEnabled(moduleAddress, modules);
        const prevModuleAddress = moduleIndex === 0 ? constants_1.SENTINEL_ADDRESS : modules[moduleIndex - 1];
        return __classPrivateFieldGet(this, _ModuleManager_safeContract, "f").encode('disableModule', [prevModuleAddress, moduleAddress]);
    }
}
_ModuleManager_safeProvider = new WeakMap(), _ModuleManager_safeContract = new WeakMap();
exports.default = ModuleManager;
//# sourceMappingURL=moduleManager.js.map