"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeDeploymentsL1ChainIds = exports.safeDeploymentsVersions = exports.SAFE_BASE_VERSION = exports.DEFAULT_SAFE_VERSION = void 0;
exports.getContractDeployment = getContractDeployment;
exports.getContractInfo = getContractInfo;
const safe_deployments_1 = require("@safe-global/safe-deployments");
const safe_modules_deployments_1 = require("@safe-global/safe-modules-deployments");
exports.DEFAULT_SAFE_VERSION = '1.3.0';
exports.SAFE_BASE_VERSION = '1.0.0';
exports.safeDeploymentsVersions = {
    '1.4.1': {
        safeSingletonVersion: '1.4.1',
        safeSingletonL2Version: '1.4.1',
        safeProxyFactoryVersion: '1.4.1',
        compatibilityFallbackHandler: '1.4.1',
        multiSendVersion: '1.4.1',
        multiSendCallOnlyVersion: '1.4.1',
        signMessageLibVersion: '1.4.1',
        createCallVersion: '1.4.1',
        simulateTxAccessorVersion: '1.4.1',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.3.0': {
        safeSingletonVersion: '1.3.0',
        safeSingletonL2Version: '1.3.0',
        safeProxyFactoryVersion: '1.3.0',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.3.0',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        simulateTxAccessorVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: '0.2.1',
        safeWebAuthnSharedSignerVersion: '0.2.1'
    },
    '1.2.0': {
        safeSingletonVersion: '1.2.0',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.1.1',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: undefined,
        safeWebAuthnSharedSignerVersion: undefined
    },
    '1.1.1': {
        safeSingletonVersion: '1.1.1',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.1.1',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: undefined,
        safeWebAuthnSharedSignerVersion: undefined
    },
    '1.0.0': {
        safeSingletonVersion: '1.0.0',
        safeSingletonL2Version: undefined,
        safeProxyFactoryVersion: '1.0.0',
        compatibilityFallbackHandler: '1.3.0',
        multiSendVersion: '1.1.1',
        multiSendCallOnlyVersion: '1.3.0',
        signMessageLibVersion: '1.3.0',
        createCallVersion: '1.3.0',
        safeWebAuthnSignerFactoryVersion: undefined,
        safeWebAuthnSharedSignerVersion: undefined
    }
};
exports.safeDeploymentsL1ChainIds = [
    1n // Ethereum Mainnet
];
const contractFunctions = {
    safeSingletonVersion: safe_deployments_1.getSafeSingletonDeployments,
    safeSingletonL2Version: safe_deployments_1.getSafeL2SingletonDeployments,
    safeProxyFactoryVersion: safe_deployments_1.getProxyFactoryDeployments,
    compatibilityFallbackHandler: safe_deployments_1.getCompatibilityFallbackHandlerDeployments,
    multiSendVersion: safe_deployments_1.getMultiSendDeployments,
    multiSendCallOnlyVersion: safe_deployments_1.getMultiSendCallOnlyDeployments,
    signMessageLibVersion: safe_deployments_1.getSignMessageLibDeployments,
    createCallVersion: safe_deployments_1.getCreateCallDeployments,
    simulateTxAccessorVersion: safe_deployments_1.getSimulateTxAccessorDeployments,
    safeWebAuthnSignerFactoryVersion: safe_modules_deployments_1.getSafeWebAuthnSignerFactoryDeployment,
    safeWebAuthnSharedSignerVersion: safe_modules_deployments_1.getSafeWebAuthnShareSignerDeployment
};
function getContractDeployment(safeVersion, chainId, contractName) {
    const contractVersion = exports.safeDeploymentsVersions[safeVersion][contractName];
    const filters = {
        version: contractVersion,
        network: chainId.toString(),
        released: true
    };
    const deployment = contractFunctions[contractName](filters);
    return deployment;
}
function getContractInfo(contractAddress) {
    for (const [safeVersion, contracts] of Object.entries(exports.safeDeploymentsVersions)) {
        for (const [contractName, contractVersion] of Object.entries(contracts)) {
            const filters = {
                version: contractVersion,
                released: true
            };
            const deployment = contractFunctions[contractName](filters);
            if (deployment && deployment.networkAddresses) {
                for (const [, addresses] of Object.entries(deployment.networkAddresses)) {
                    if ((Array.isArray(addresses) &&
                        addresses.find((a) => a.toLowerCase() === contractAddress.toLowerCase())) ||
                        (typeof addresses === 'string' &&
                            addresses.toLowerCase() === contractAddress.toLowerCase())) {
                        const types = Object.keys(deployment.deployments);
                        const type = types.find((t) => deployment.deployments[t]?.address.toLowerCase() === contractAddress.toLowerCase());
                        if (type) {
                            return {
                                version: safeVersion,
                                type,
                                contractName: contractName
                            };
                        }
                    }
                }
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=config.js.map