"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSafeDeploymentConfig = exports.validateSafeAccountConfig = exports.PREDETERMINED_SALT_NONCE = void 0;
exports.encodeCreateProxyWithNonce = encodeCreateProxyWithNonce;
exports.encodeSetupCallData = encodeSetupCallData;
exports.getSafeContractVersion = getSafeContractVersion;
exports.getChainSpecificDefaultSaltNonce = getChainSpecificDefaultSaltNonce;
exports.getPredictedSafeAddressInitCode = getPredictedSafeAddressInitCode;
exports.predictSafeAddress = predictSafeAddress;
exports.zkSyncEraCreate2Address = zkSyncEraCreate2Address;
exports.toTxResult = toTxResult;
exports.isTypedDataSigner = isTypedDataSigner;
exports.isSignerCompatible = isSignerCompatible;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const config_1 = require("../contracts/config");
const constants_1 = require("../utils/constants");
const memoized_1 = require("../utils/memoized");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const types_1 = require("../utils/types");
const safeDeploymentContracts_1 = require("../contracts/safeDeploymentContracts");
// keccak256(toUtf8Bytes('Safe Account Abstraction'))
exports.PREDETERMINED_SALT_NONCE = '0xb1073742015cbcf5a3a4d9d1ae33ecf619439710b89475f92e2abd2117e90f90';
const ZKSYNC_MAINNET = 324n;
const ZKSYNC_TESTNET = 280n;
// For bundle size efficiency we store SafeProxy.sol/GnosisSafeProxy.sol zksync bytecode hash in hex.
// To get the values below we need to:
// 1. Compile Safe smart contracts for zksync
// 2. Get `deployedBytecode` from SafeProxy.json/GnosisSafeProxy.json
// 3. Use zksync-web3 SDK to get the bytecode hash
//    const bytecodeHash = zkSyncUtils.hashBytecode(${deployedBytecode})
// 4. Use ethers to convert the array into hex
//    const deployedBytecodeHash = ethers.hexlify(bytecodeHash)
const ZKSYNC_SAFE_PROXY_DEPLOYED_BYTECODE = {
    '1.3.0': {
        deployedBytecodeHash: '0x0100004124426fb9ebb25e27d670c068e52f9ba631bd383279a188be47e3f86d'
    }
};
// keccak256(toUtf8Bytes('zksyncCreate2'))
const ZKSYNC_CREATE2_PREFIX = '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494';
function encodeCreateProxyWithNonce(safeProxyFactoryContract, safeSingletonAddress, initializer, salt) {
    return safeProxyFactoryContract.encode('createProxyWithNonce', [
        safeSingletonAddress,
        (0, types_1.asHex)(initializer),
        BigInt(salt || exports.PREDETERMINED_SALT_NONCE)
    ]);
}
const memoizedGetCompatibilityFallbackHandlerContract = (0, memoized_1.createMemoizedFunction)(safeDeploymentContracts_1.getCompatibilityFallbackHandlerContract);
async function encodeSetupCallData({ safeProvider, safeAccountConfig, safeContract, customContracts, customSafeVersion, deploymentType }) {
    const { owners, threshold, to = constants_1.ZERO_ADDRESS, data = constants_1.EMPTY_DATA, fallbackHandler, paymentToken = constants_1.ZERO_ADDRESS, payment = 0, paymentReceiver = constants_1.ZERO_ADDRESS } = safeAccountConfig;
    const safeVersion = customSafeVersion || safeContract.safeVersion;
    if ((0, satisfies_1.default)(safeVersion, '<=1.0.0')) {
        return safeContract.encode('setup', [
            owners,
            threshold,
            to,
            (0, types_1.asHex)(data),
            paymentToken,
            payment,
            paymentReceiver
        ]);
    }
    let fallbackHandlerAddress = fallbackHandler;
    const isValidAddress = fallbackHandlerAddress !== undefined && (0, viem_1.isAddress)(fallbackHandlerAddress);
    if (!isValidAddress) {
        const fallbackHandlerContract = await memoizedGetCompatibilityFallbackHandlerContract({
            safeProvider,
            safeVersion,
            customContracts,
            deploymentType
        });
        fallbackHandlerAddress = fallbackHandlerContract.getAddress();
    }
    return safeContract.encode('setup', [
        owners,
        threshold,
        to,
        data,
        fallbackHandlerAddress,
        paymentToken,
        payment,
        paymentReceiver
    ]);
}
const memoizedGetProxyFactoryContract = (0, memoized_1.createMemoizedFunction)(({ safeProvider, safeVersion, customContracts, deploymentType }) => (0, safeDeploymentContracts_1.getSafeProxyFactoryContract)({ safeProvider, safeVersion, customContracts, deploymentType }));
const memoizedGetProxyCreationCode = (0, memoized_1.createMemoizedFunction)(async ({ safeProvider, safeVersion, customContracts, chainId, deploymentType }) => {
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId,
        deploymentType
    });
    return safeProxyFactoryContract.proxyCreationCode();
});
const memoizedGetSafeContract = (0, memoized_1.createMemoizedFunction)(({ safeProvider, safeVersion, isL1SafeSingleton, customContracts, deploymentType }) => (0, safeDeploymentContracts_1.getSafeContract)({
    safeProvider,
    safeVersion,
    isL1SafeSingleton,
    customContracts,
    deploymentType
}));
/**
 * Retrieves the version of the Safe contract associated with the given Safe address from the blockchain.
 *
 * @param {SafeProvider} safeProvider The provider to use when reading the contract.
 * @param {string} safeAddress The address of the Safe contract for which to retrieve the version.
 *
 * @returns {Promise<SafeVersion>} A promise resolving to the version of the Safe contract.
 * @throws when fetching an address which doesn't have a Safe deployed in it.
 */
async function getSafeContractVersion(safeProvider, safeAddress) {
    return (await safeProvider.readContract({
        address: safeAddress,
        abi: (0, viem_1.parseAbi)(['function VERSION() view returns (string)']),
        functionName: 'VERSION'
    }));
}
/**
 * Provides a chain-specific default salt nonce for generating unique addresses
 * for the same Safe configuration across different chains.
 *
 * @param {bigint} chainId - The chain ID associated with the chain.
 * @returns {string} The chain-specific salt nonce in hexadecimal format.
 */
function getChainSpecificDefaultSaltNonce(chainId) {
    return (0, viem_1.keccak256)((0, viem_1.toHex)(exports.PREDETERMINED_SALT_NONCE + chainId));
}
async function getPredictedSafeAddressInitCode({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig = {}, isL1SafeSingleton = false, customContracts }) {
    (0, exports.validateSafeAccountConfig)(safeAccountConfig);
    (0, exports.validateSafeDeploymentConfig)(safeDeploymentConfig);
    const { safeVersion = config_1.DEFAULT_SAFE_VERSION, saltNonce = getChainSpecificDefaultSaltNonce(chainId), deploymentType } = safeDeploymentConfig;
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString(),
        deploymentType
    });
    const safeContract = await memoizedGetSafeContract({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts,
        chainId: chainId.toString(),
        deploymentType
    });
    const initializer = await encodeSetupCallData({
        safeProvider,
        safeAccountConfig,
        safeContract,
        customContracts,
        customSafeVersion: safeVersion, // it is more efficient if we provide the safeVersion manually
        deploymentType
    });
    const encodedNonce = safeProvider.encodeParameters('uint256', [saltNonce]);
    const safeSingletonAddress = safeContract.getAddress();
    const initCodeCallData = encodeCreateProxyWithNonce(safeProxyFactoryContract, safeSingletonAddress, initializer, encodedNonce);
    const safeProxyFactoryAddress = safeProxyFactoryContract.getAddress();
    const initCode = `0x${[safeProxyFactoryAddress, initCodeCallData].reduce((acc, x) => acc + x.replace('0x', ''), '')}`;
    return initCode;
}
async function predictSafeAddress({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig = {}, isL1SafeSingleton = false, customContracts }) {
    (0, exports.validateSafeAccountConfig)(safeAccountConfig);
    (0, exports.validateSafeDeploymentConfig)(safeDeploymentConfig);
    const { safeVersion = config_1.DEFAULT_SAFE_VERSION, saltNonce = getChainSpecificDefaultSaltNonce(chainId), deploymentType } = safeDeploymentConfig;
    const safeProxyFactoryContract = await memoizedGetProxyFactoryContract({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString(),
        deploymentType
    });
    const [proxyCreationCode] = await memoizedGetProxyCreationCode({
        safeProvider,
        safeVersion,
        customContracts,
        chainId: chainId.toString(),
        deploymentType
    });
    const safeContract = await memoizedGetSafeContract({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts,
        chainId: chainId.toString(),
        deploymentType
    });
    const initializer = await encodeSetupCallData({
        safeProvider,
        safeAccountConfig,
        safeContract,
        customContracts,
        customSafeVersion: safeVersion, // it is more efficient if we provide the safeVersion manuall
        deploymentType
    });
    const initializerHash = (0, viem_1.keccak256)((0, types_1.asHex)(initializer));
    const encodedNonce = (0, types_1.asHex)(safeProvider.encodeParameters('uint256', [saltNonce]));
    const salt = (0, viem_1.keccak256)((0, viem_1.concat)([initializerHash, encodedNonce]));
    const input = safeProvider.encodeParameters('address', [safeContract.getAddress()]);
    const from = safeProxyFactoryContract.getAddress();
    // On the zkSync Era chain, the counterfactual deployment address is calculated differently
    const isZkSyncEraChain = [ZKSYNC_MAINNET, ZKSYNC_TESTNET].includes(chainId);
    if (isZkSyncEraChain) {
        const proxyAddress = zkSyncEraCreate2Address(from, safeVersion, salt, (0, types_1.asHex)(input));
        return safeProvider.getChecksummedAddress(proxyAddress);
    }
    const initCode = (0, viem_1.concat)([proxyCreationCode, (0, types_1.asHex)(input)]);
    const proxyAddress = (0, viem_1.getContractAddress)({
        from,
        bytecode: initCode,
        opcode: 'CREATE2',
        salt
    });
    return safeProvider.getChecksummedAddress(proxyAddress);
}
const validateSafeAccountConfig = ({ owners, threshold }) => {
    if (owners.length <= 0)
        throw new Error('Owner list must have at least one owner');
    if (threshold <= 0)
        throw new Error('Threshold must be greater than or equal to 1');
    if (threshold > owners.length)
        throw new Error('Threshold must be lower than or equal to owners length');
};
exports.validateSafeAccountConfig = validateSafeAccountConfig;
const validateSafeDeploymentConfig = ({ saltNonce }) => {
    if (saltNonce && BigInt(saltNonce) < 0)
        throw new Error('saltNonce must be greater than or equal to 0');
};
exports.validateSafeDeploymentConfig = validateSafeDeploymentConfig;
/**
 * Generates a zkSync Era address. zkSync Era uses a distinct address derivation method compared to Ethereum
 * see: https://docs.zksync.io/build/developer-reference/ethereum-differences/evm-instructions/#address-derivation
 *
 * @param {`string`} from - The sender's address.
 * @param {SafeVersion} safeVersion - The version of the safe.
 * @param {`0x${string}`} salt - The salt used for address derivation.
 * @param {`0x${string}`} input - Additional input data for the derivation.
 *
 * @returns {string} The derived zkSync Era address.
 */
function zkSyncEraCreate2Address(from, safeVersion, salt, input) {
    const bytecodeHash = ZKSYNC_SAFE_PROXY_DEPLOYED_BYTECODE[safeVersion].deployedBytecodeHash;
    const inputHash = (0, viem_1.keccak256)(input);
    const addressBytes = (0, viem_1.keccak256)((0, viem_1.concat)([ZKSYNC_CREATE2_PREFIX, (0, viem_1.pad)((0, types_1.asHex)(from)), salt, bytecodeHash, inputHash])).slice(26);
    return `0x${addressBytes}`;
}
function toTxResult(runner, hash, options) {
    return {
        hash,
        options,
        transactionResponse: {
            wait: async () => (0, actions_1.waitForTransactionReceipt)(runner, { hash })
        }
    };
}
function isTypedDataSigner(signer) {
    const isPasskeySigner = !!signer?.passkeyRawId;
    return signer.signTypedData !== undefined || !isPasskeySigner;
}
/**
 * Check if the signerOrProvider is compatible with `Signer`
 * @param signerOrProvider - Signer or provider
 * @returns true if the parameter is compatible with `Signer`
 */
function isSignerCompatible(signerOrProvider) {
    const candidate = signerOrProvider;
    const isSigntransactionCompatible = typeof candidate.signTransaction === 'function';
    const isSignMessageCompatible = typeof candidate.signMessage === 'function';
    const isGetAddressCompatible = typeof candidate.getAddresses === 'function';
    return isSigntransactionCompatible && isSignMessageCompatible && isGetAddressCompatible;
}
//# sourceMappingURL=utils.js.map