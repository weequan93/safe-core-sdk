"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeContractInstance = getSafeContractInstance;
exports.getCompatibilityFallbackHandlerContractInstance = getCompatibilityFallbackHandlerContractInstance;
exports.getMultiSendContractInstance = getMultiSendContractInstance;
exports.getMultiSendCallOnlyContractInstance = getMultiSendCallOnlyContractInstance;
exports.getSafeProxyFactoryContractInstance = getSafeProxyFactoryContractInstance;
exports.getSignMessageLibContractInstance = getSignMessageLibContractInstance;
exports.getCreateCallContractInstance = getCreateCallContractInstance;
exports.getSimulateTxAccessorContractInstance = getSimulateTxAccessorContractInstance;
exports.getSafeWebAuthnSignerFactoryContractInstance = getSafeWebAuthnSignerFactoryContractInstance;
exports.getSafeWebAuthnSharedSignerContractInstance = getSafeWebAuthnSharedSignerContractInstance;
const CreateCallContract_v1_3_0_1 = __importDefault(require("./CreateCall/v1.3.0/CreateCallContract_v1_3_0"));
const CreateCallContract_v1_4_1_1 = __importDefault(require("./CreateCall/v1.4.1/CreateCallContract_v1_4_1"));
const MultiSendContract_v1_1_1_1 = __importDefault(require("./MultiSend/v1.1.1/MultiSendContract_v1_1_1"));
const MultiSendContract_v1_3_0_1 = __importDefault(require("./MultiSend/v1.3.0/MultiSendContract_v1_3_0"));
const MultiSendContract_v1_4_1_1 = __importDefault(require("./MultiSend/v1.4.1/MultiSendContract_v1_4_1"));
const MultiSendCallOnlyContract_v1_3_0_1 = __importDefault(require("./MultiSend/v1.3.0/MultiSendCallOnlyContract_v1_3_0"));
const MultiSendCallOnlyContract_v1_4_1_1 = __importDefault(require("./MultiSend/v1.4.1/MultiSendCallOnlyContract_v1_4_1"));
const SignMessageLibContract_v1_3_0_1 = __importDefault(require("./SignMessageLib/v1.3.0/SignMessageLibContract_v1_3_0"));
const SignMessageLibContract_v1_4_1_1 = __importDefault(require("./SignMessageLib/v1.4.1/SignMessageLibContract_v1_4_1"));
const SafeContract_v1_0_0_1 = __importDefault(require("./Safe/v1.0.0/SafeContract_v1_0_0"));
const SafeContract_v1_1_1_1 = __importDefault(require("./Safe/v1.1.1/SafeContract_v1_1_1"));
const SafeContract_v1_2_0_1 = __importDefault(require("./Safe/v1.2.0/SafeContract_v1_2_0"));
const SafeContract_v1_3_0_1 = __importDefault(require("./Safe/v1.3.0/SafeContract_v1_3_0"));
const SafeContract_v1_4_1_1 = __importDefault(require("./Safe/v1.4.1/SafeContract_v1_4_1"));
const SafeProxyFactoryContract_v1_0_0_1 = __importDefault(require("./SafeProxyFactory/v1.0.0/SafeProxyFactoryContract_v1_0_0"));
const SafeProxyFactoryContract_v1_1_1_1 = __importDefault(require("./SafeProxyFactory/v1.1.1/SafeProxyFactoryContract_v1_1_1"));
const SafeProxyFactoryContract_v1_3_0_1 = __importDefault(require("./SafeProxyFactory/v1.3.0/SafeProxyFactoryContract_v1_3_0"));
const SafeProxyFactoryContract_v1_4_1_1 = __importDefault(require("./SafeProxyFactory/v1.4.1/SafeProxyFactoryContract_v1_4_1"));
const SimulateTxAccessorContract_v1_3_0_1 = __importDefault(require("./SimulateTxAccessor/v1.3.0/SimulateTxAccessorContract_v1_3_0"));
const SimulateTxAccessorContract_v1_4_1_1 = __importDefault(require("./SimulateTxAccessor/v1.4.1/SimulateTxAccessorContract_v1_4_1"));
const CompatibilityFallbackHandlerContract_v1_3_0_1 = __importDefault(require("./CompatibilityFallbackHandler/v1.3.0/CompatibilityFallbackHandlerContract_v1_3_0"));
const CompatibilityFallbackHandlerContract_v1_4_1_1 = __importDefault(require("./CompatibilityFallbackHandler/v1.4.1/CompatibilityFallbackHandlerContract_v1_4_1"));
const SafeWebAuthnSignerFactoryContract_v0_2_1_1 = __importDefault(require("./SafeWebAuthnSignerFactory/v0.2.1/SafeWebAuthnSignerFactoryContract_v0_2_1"));
const SafeWebAuthnSharedSignerContract_v0_2_1_1 = __importDefault(require("./SafeWebAuthnSharedSigner/v0.2.1/SafeWebAuthnSharedSignerContract_v0_2_1"));
async function getSafeContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, isL1SafeSingleton, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let safeContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            safeContractInstance = new SafeContract_v1_4_1_1.default(chainId, safeProvider, isL1SafeSingleton, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
            safeContractInstance = new SafeContract_v1_3_0_1.default(chainId, safeProvider, isL1SafeSingleton, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.2.0':
            safeContractInstance = new SafeContract_v1_2_0_1.default(chainId, safeProvider, isL1SafeSingleton, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.1.1':
            safeContractInstance = new SafeContract_v1_1_1_1.default(chainId, safeProvider, isL1SafeSingleton, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.0.0':
            safeContractInstance = new SafeContract_v1_0_0_1.default(chainId, safeProvider, isL1SafeSingleton, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await safeContractInstance.init();
    return safeContractInstance;
}
async function getCompatibilityFallbackHandlerContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let compatibilityFallbackHandlerInstance;
    switch (safeVersion) {
        case '1.4.1':
            compatibilityFallbackHandlerInstance = new CompatibilityFallbackHandlerContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
        case '1.2.0':
        case '1.1.1':
            compatibilityFallbackHandlerInstance = new CompatibilityFallbackHandlerContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await compatibilityFallbackHandlerInstance.init();
    return compatibilityFallbackHandlerInstance;
}
async function getMultiSendContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let multiSendContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            multiSendContractInstance = new MultiSendContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
            multiSendContractInstance = new MultiSendContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.2.0':
        case '1.1.1':
        case '1.0.0':
            multiSendContractInstance = new MultiSendContract_v1_1_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await multiSendContractInstance.init();
    return multiSendContractInstance;
}
async function getMultiSendCallOnlyContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let multiSendCallOnlyContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            multiSendCallOnlyContractInstance = new MultiSendCallOnlyContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
        case '1.2.0':
        case '1.1.1':
        case '1.0.0':
            multiSendCallOnlyContractInstance = new MultiSendCallOnlyContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await multiSendCallOnlyContractInstance.init();
    return multiSendCallOnlyContractInstance;
}
async function getSafeProxyFactoryContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let safeProxyFactoryContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            safeProxyFactoryContractInstance = new SafeProxyFactoryContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
            safeProxyFactoryContractInstance = new SafeProxyFactoryContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.2.0':
        case '1.1.1':
            safeProxyFactoryContractInstance = new SafeProxyFactoryContract_v1_1_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.0.0':
            safeProxyFactoryContractInstance = new SafeProxyFactoryContract_v1_0_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await safeProxyFactoryContractInstance.init();
    return safeProxyFactoryContractInstance;
}
async function getSignMessageLibContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let signMessageLibContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            signMessageLibContractInstance = new SignMessageLibContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
            signMessageLibContractInstance = new SignMessageLibContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await signMessageLibContractInstance.init();
    return signMessageLibContractInstance;
}
async function getCreateCallContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let createCallContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            createCallContractInstance = new CreateCallContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
        case '1.2.0':
        case '1.1.1':
        case '1.0.0':
            createCallContractInstance = new CreateCallContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await createCallContractInstance.init();
    return createCallContractInstance;
}
async function getSimulateTxAccessorContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    let simulateTxAccessorContractInstance;
    switch (safeVersion) {
        case '1.4.1':
            simulateTxAccessorContractInstance = new SimulateTxAccessorContract_v1_4_1_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        case '1.3.0':
            simulateTxAccessorContractInstance = new SimulateTxAccessorContract_v1_3_0_1.default(chainId, safeProvider, contractAddress, customContractAbi, deploymentType);
            break;
        default:
            throw new Error('Invalid Safe version');
    }
    await simulateTxAccessorContractInstance.init();
    return simulateTxAccessorContractInstance;
}
async function getSafeWebAuthnSignerFactoryContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    switch (safeVersion) {
        case '1.4.1':
        case '1.3.0':
            const safeWebAuthnSignerFactoryContractInstance = new SafeWebAuthnSignerFactoryContract_v0_2_1_1.default(chainId, safeProvider, safeVersion, contractAddress, customContractAbi, deploymentType);
            await safeWebAuthnSignerFactoryContractInstance.init();
            return safeWebAuthnSignerFactoryContractInstance;
        default:
            throw new Error('Invalid Safe version');
    }
}
async function getSafeWebAuthnSharedSignerContractInstance(safeVersion, safeProvider, contractAddress, customContractAbi, deploymentType) {
    const chainId = await safeProvider.getChainId();
    switch (safeVersion) {
        case '1.4.1':
        case '1.3.0':
            const safeWebAuthnSharedSignerContractInstance = new SafeWebAuthnSharedSignerContract_v0_2_1_1.default(chainId, safeProvider, safeVersion, contractAddress, customContractAbi, deploymentType);
            await safeWebAuthnSharedSignerContractInstance.init();
            return safeWebAuthnSharedSignerContractInstance;
        default:
            throw new Error('Invalid Safe version');
    }
}
//# sourceMappingURL=contractInstances.js.map