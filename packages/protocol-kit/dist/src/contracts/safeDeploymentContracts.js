"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeContract = getSafeContract;
exports.getSafeProxyFactoryContract = getSafeProxyFactoryContract;
exports.getCompatibilityFallbackHandlerContract = getCompatibilityFallbackHandlerContract;
exports.getMultiSendContract = getMultiSendContract;
exports.getMultiSendCallOnlyContract = getMultiSendCallOnlyContract;
exports.getSignMessageLibContract = getSignMessageLibContract;
exports.getCreateCallContract = getCreateCallContract;
exports.getSimulateTxAccessorContract = getSimulateTxAccessorContract;
exports.getSafeWebAuthnSignerFactoryContract = getSafeWebAuthnSignerFactoryContract;
exports.getSafeWebAuthnSharedSignerContract = getSafeWebAuthnSharedSignerContract;
const contractInstances_1 = require("../contracts/contractInstances");
async function getSafeContract({ safeProvider, safeVersion, customSafeAddress, isL1SafeSingleton, customContracts, deploymentType }) {
    const safeContract = await (0, contractInstances_1.getSafeContractInstance)(safeVersion, safeProvider, customSafeAddress ?? customContracts?.safeSingletonAddress, customContracts?.safeSingletonAbi, isL1SafeSingleton, deploymentType);
    const isContractDeployed = await safeProvider.isContractDeployed(safeContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SafeProxy contract is not deployed on the current network');
    }
    return safeContract;
}
async function getSafeProxyFactoryContract({ safeProvider, safeVersion, customContracts, deploymentType }) {
    const safeProxyFactoryContract = await (0, contractInstances_1.getSafeProxyFactoryContractInstance)(safeVersion, safeProvider, customContracts?.safeProxyFactoryAddress, customContracts?.safeProxyFactoryAbi, deploymentType);
    const isContractDeployed = await safeProvider.isContractDeployed(safeProxyFactoryContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SafeProxyFactory contract is not deployed on the current network');
    }
    return safeProxyFactoryContract;
}
async function getCompatibilityFallbackHandlerContract({ safeProvider, safeVersion, customContracts, deploymentType }) {
    const fallbackHandlerContract = await (0, contractInstances_1.getCompatibilityFallbackHandlerContractInstance)(safeVersion, safeProvider, customContracts?.fallbackHandlerAddress, customContracts?.fallbackHandlerAbi, deploymentType);
    const isContractDeployed = await safeProvider.isContractDeployed(fallbackHandlerContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('CompatibilityFallbackHandler contract is not deployed on the current network');
    }
    return fallbackHandlerContract;
}
async function getMultiSendContract({ safeProvider, safeVersion, customContracts }) {
    const multiSendContract = await (0, contractInstances_1.getMultiSendContractInstance)(safeVersion, safeProvider, customContracts?.multiSendAddress, customContracts?.multiSendAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(multiSendContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('MultiSend contract is not deployed on the current network');
    }
    return multiSendContract;
}
async function getMultiSendCallOnlyContract({ safeProvider, safeVersion, customContracts }) {
    const multiSendCallOnlyContract = await (0, contractInstances_1.getMultiSendCallOnlyContractInstance)(safeVersion, safeProvider, customContracts?.multiSendCallOnlyAddress, customContracts?.multiSendCallOnlyAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(multiSendCallOnlyContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('MultiSendCallOnly contract is not deployed on the current network');
    }
    return multiSendCallOnlyContract;
}
async function getSignMessageLibContract({ safeProvider, safeVersion, customContracts }) {
    const signMessageLibContract = await (0, contractInstances_1.getSignMessageLibContractInstance)(safeVersion, safeProvider, customContracts?.signMessageLibAddress, customContracts?.signMessageLibAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(signMessageLibContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SignMessageLib contract is not deployed on the current network');
    }
    return signMessageLibContract;
}
async function getCreateCallContract({ safeProvider, safeVersion, customContracts }) {
    const createCallContract = await (0, contractInstances_1.getCreateCallContractInstance)(safeVersion, safeProvider, customContracts?.createCallAddress, customContracts?.createCallAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(createCallContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('CreateCall contract is not deployed on the current network');
    }
    return createCallContract;
}
async function getSimulateTxAccessorContract({ safeProvider, safeVersion, customContracts }) {
    const simulateTxAccessorContract = await (0, contractInstances_1.getSimulateTxAccessorContractInstance)(safeVersion, safeProvider, customContracts?.simulateTxAccessorAddress, customContracts?.simulateTxAccessorAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(simulateTxAccessorContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('SimulateTxAccessor contract is not deployed on the current network');
    }
    return simulateTxAccessorContract;
}
async function getSafeWebAuthnSignerFactoryContract({ safeProvider, safeVersion, customContracts }) {
    const safeWebAuthnSignerFactoryContract = await (0, contractInstances_1.getSafeWebAuthnSignerFactoryContractInstance)(safeVersion, safeProvider, customContracts?.safeWebAuthnSignerFactoryAddress, customContracts?.safeWebAuthnSignerFactoryAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(safeWebAuthnSignerFactoryContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('safeWebAuthnSignerFactory contract is not deployed on the current network');
    }
    return safeWebAuthnSignerFactoryContract;
}
async function getSafeWebAuthnSharedSignerContract({ safeProvider, safeVersion, customContracts }) {
    const safeWebAuthnSharedSignerContract = await (0, contractInstances_1.getSafeWebAuthnSharedSignerContractInstance)(safeVersion, safeProvider, customContracts?.safeWebAuthnSharedSignerAddress, customContracts?.safeWebAuthnSharedSignerAbi);
    const isContractDeployed = await safeProvider.isContractDeployed(safeWebAuthnSharedSignerContract.getAddress());
    if (!isContractDeployed) {
        throw new Error('safeWebAuthnSharedSigner contract is not deployed on the current network');
    }
    return safeWebAuthnSharedSignerContract;
}
//# sourceMappingURL=safeDeploymentContracts.js.map