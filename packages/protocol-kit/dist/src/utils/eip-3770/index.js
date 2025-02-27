"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEip3770Address = parseEip3770Address;
exports.getEip3770NetworkPrefixFromChainId = getEip3770NetworkPrefixFromChainId;
exports.isValidEip3770NetworkPrefix = isValidEip3770NetworkPrefix;
exports.validateEip3770NetworkPrefix = validateEip3770NetworkPrefix;
exports.validateEthereumAddress = validateEthereumAddress;
exports.validateEip3770Address = validateEip3770Address;
const viem_1 = require("viem");
const config_1 = require("./config");
function parseEip3770Address(fullAddress) {
    const parts = fullAddress.split(':');
    const address = parts.length > 1 ? parts[1] : parts[0];
    const prefix = parts.length > 1 ? parts[0] : '';
    return { prefix, address };
}
function getEip3770NetworkPrefixFromChainId(chainId) {
    const network = config_1.networks.find((network) => chainId === network.chainId);
    if (!network) {
        throw new Error('No network prefix supported for the current chainId');
    }
    return network.shortName;
}
function isValidEip3770NetworkPrefix(prefix) {
    return config_1.networks.some(({ shortName }) => shortName === prefix);
}
function validateEip3770NetworkPrefix(prefix, currentChainId) {
    const isCurrentNetworkPrefix = prefix === getEip3770NetworkPrefixFromChainId(currentChainId);
    if (!isValidEip3770NetworkPrefix(prefix) || !isCurrentNetworkPrefix) {
        throw new Error('The network prefix must match the current network');
    }
}
function validateEthereumAddress(address) {
    if (!(0, viem_1.isAddress)(address)) {
        throw new Error(`Invalid Ethereum address ${address}`);
    }
}
function validateEip3770Address(fullAddress, currentChainId) {
    const { address, prefix } = parseEip3770Address(fullAddress);
    validateEthereumAddress(address);
    if (prefix) {
        validateEip3770NetworkPrefix(prefix, currentChainId);
    }
    return { address, prefix };
}
//# sourceMappingURL=index.js.map