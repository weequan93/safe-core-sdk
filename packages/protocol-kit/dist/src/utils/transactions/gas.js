"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGas = estimateGas;
exports.estimateTxGas = estimateTxGas;
exports.estimateTxBaseGas = estimateTxBaseGas;
exports.estimateSafeTxGas = estimateSafeTxGas;
exports.estimateSafeDeploymentGas = estimateSafeDeploymentGas;
const viem_1 = require("viem");
const types_kit_1 = require("@safe-global/types-kit");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const constants_1 = require("../constants");
const safeDeploymentContracts_1 = require("../../contracts/safeDeploymentContracts");
const safeVersions_1 = require("../safeVersions");
const types_1 = require("../types");
// Every byte == 00 -> 4  Gas cost
const CALL_DATA_ZERO_BYTE_GAS_COST = 4;
// Every byte != 00 -> 16 Gas cost (68 before Istanbul)
const CALL_DATA_BYTE_GAS_COST = 16;
// gas cost initialization of a Safe
const INITIZATION_GAS_COST = 20000;
// increment nonce gas cost
const INCREMENT_NONCE_GAS_COST = 5000;
// Keccak gas cost for the hash of the Safe transaction
const HASH_GENERATION_GAS_COST = 1500;
// ecrecover gas cost for ecdsa ~= 4K gas, we use 6K
const ECRECOVER_GAS_COST = 6000;
// transfer gas cost
const TRANSAFER_GAS_COST = 32000;
// numbers < 256 (0x00(31*2)..ff) are 192 -> 31 * 4 + 1 * CALL_DATA_BYTE_GAS_COST
// numbers < 65535 (0x(30*2)..ffff) are 256 -> 30 * 4 + 2 * CALL_DATA_BYTE_GAS_COST
// Calculate gas for signatures
// (array count (3 -> r, s, v) + ecrecover costs) * signature count
const GAS_COST_PER_SIGNATURE = 1 * CALL_DATA_BYTE_GAS_COST + 2 * 32 * CALL_DATA_BYTE_GAS_COST + ECRECOVER_GAS_COST;
function estimateDataGasCosts(data) {
    const bytes = data.match(/.{2}/g);
    return bytes.reduce((gasCost, currentByte) => {
        if (currentByte === '0x') {
            return gasCost + 0;
        }
        if (currentByte === '00') {
            return gasCost + CALL_DATA_ZERO_BYTE_GAS_COST;
        }
        return gasCost + CALL_DATA_BYTE_GAS_COST;
    }, 0);
}
async function estimateGas(safeVersion, safeContract, safeProvider, to, valueInWei, data, operation, customContracts) {
    const chainId = await safeProvider.getChainId();
    const simulateTxAccessorContract = await (0, safeDeploymentContracts_1.getSimulateTxAccessorContract)({
        safeProvider,
        safeVersion,
        customContracts: customContracts?.[chainId.toString()]
    });
    const transactionDataToEstimate = simulateTxAccessorContract.encode('simulate', [
        to,
        BigInt(valueInWei),
        (0, types_1.asHex)(data),
        operation
    ]);
    const safeContractContractCompatibleWithSimulateAndRevert = await (0, safeVersions_1.isSafeContractCompatibleWithSimulateAndRevert)(safeContract);
    const safeFunctionToEstimate = safeContractContractCompatibleWithSimulateAndRevert.encode('simulateAndRevert', [simulateTxAccessorContract.getAddress(), (0, types_1.asHex)(transactionDataToEstimate)]);
    const safeAddress = safeContract.getAddress();
    const transactionToEstimateGas = {
        to: safeAddress,
        value: '0',
        data: safeFunctionToEstimate,
        from: safeAddress
    };
    try {
        const encodedResponse = await safeProvider.call(transactionToEstimateGas);
        return decodeSafeTxGas(encodedResponse);
    }
    catch (error) {
        return parseSafeTxGasErrorResponse(error);
    }
}
async function estimateTxGas(safeContract, safeProvider, to, valueInWei, data, operation) {
    const safeAddress = safeContract.getAddress();
    try {
        const estimateGas = await safeProvider.estimateGas({
            to,
            from: safeAddress,
            value: valueInWei,
            data
        });
        return estimateGas;
    }
    catch (error) {
        if (operation === types_kit_1.OperationType.DelegateCall) {
            return '0';
        }
        return Promise.reject(error);
    }
}
/**
 * This function estimates the baseGas of a Safe transaction.
 * The baseGas includes costs for:
 * - Generation of the Safe transaction hash (txHash)
 * - Increasing the nonce of the Safe
 * - Verifying the signatures of the Safe transaction
 * - Payment to relayers for executing the transaction
 * - Emitting events ExecutionSuccess or ExecutionFailure
 *
 * Note: it does not include the transaction execution cost (safeTxGas)
 *
 * @async
 * @function estimateTxBaseGas
 * @param {Safe} safe - The Safe instance containing all the information about the safe.
 * @param {SafeTransaction} safeTransaction - The transaction for which the baseGas is to be estimated.
 * @returns {Promise<string>} A Promise that resolves with the estimated baseGas as a string.
 */
async function estimateTxBaseGas(safe, safeTransaction) {
    const safeTransactionData = safeTransaction.data;
    const { to, value, data, operation, safeTxGas, gasToken, refundReceiver } = safeTransactionData;
    const safeThreshold = await safe.getThreshold();
    const safeNonce = await safe.getNonce();
    const signaturesGasCost = safeThreshold * GAS_COST_PER_SIGNATURE;
    const encodeSafeTxGas = safeTxGas || 0;
    const encodeBaseGas = 0;
    const gasPrice = 1;
    const encodeGasToken = gasToken || constants_1.ZERO_ADDRESS;
    const encodeRefundReceiver = refundReceiver || constants_1.ZERO_ADDRESS;
    const signatures = '0x';
    const safeVersion = safe.getContractVersion();
    const safeProvider = safe.getSafeProvider();
    const isL1SafeSingleton = safe.getContractManager().isL1SafeSingleton;
    const chainId = await safe.getChainId();
    const customContracts = safe.getContractManager().contractNetworks?.[chainId.toString()];
    const safeSingletonContract = await (0, safeDeploymentContracts_1.getSafeContract)({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts
    });
    //TODO: We should explore contract versions and map to the correct types
    //@ts-expect-error: Type too complex to represent.
    const execTransactionData = safeSingletonContract.encode('execTransaction', [
        to,
        BigInt(value),
        data,
        operation,
        encodeSafeTxGas,
        encodeBaseGas,
        gasPrice,
        encodeGasToken,
        encodeRefundReceiver,
        signatures
    ]);
    // If nonce == 0, nonce storage has to be initialized
    const isSafeInitialized = safeNonce !== 0;
    const incrementNonceGasCost = isSafeInitialized ? INCREMENT_NONCE_GAS_COST : INITIZATION_GAS_COST;
    let baseGas = signaturesGasCost +
        estimateDataGasCosts(execTransactionData) +
        incrementNonceGasCost +
        HASH_GENERATION_GAS_COST;
    // Add additional gas costs
    baseGas > 65536 ? (baseGas += 64) : (baseGas += 128);
    // Base tx costs, transfer costs...
    baseGas += TRANSAFER_GAS_COST;
    return baseGas.toString();
}
/**
 * This function estimates the safeTxGas of a Safe transaction.
 * The safeTxGas value represents the amount of gas required to execute the Safe transaction itself.
 * It does not include costs such as signature verification, transaction hash generation, nonce incrementing, and so on.
 *
 * The estimation method differs based on the version of the Safe:
 * - For versions >= 1.3.0, the simulate function defined in the simulateTxAccessor.sol Contract is used.
 * - For versions < 1.3.0, the deprecated requiredTxGas method defined in the GnosisSafe.sol contract is used.
 *
 * @async
 * @function estimateSafeTxGas
 * @param {Safe} safe - The Safe instance containing all the necessary information about the safe.
 * @param {SafeTransaction} safeTransaction - The transaction for which the safeTxGas is to be estimated.
 * @returns {Promise<string>} A Promise that resolves with the estimated safeTxGas as a string.
 *
 */
async function estimateSafeTxGas(safe, safeTransaction) {
    const safeVersion = safe.getContractVersion();
    if ((0, satisfies_1.default)(safeVersion, '>=1.3.0')) {
        const safeTxGas = await estimateSafeTxGasWithSimulate(safe, safeTransaction);
        return addExtraGasForSafety(safeTxGas);
    }
    // deprecated method to estimate the safeTxGas of a Safe transaction
    const safeTxGas = await estimateSafeTxGasWithRequiredTxGas(safe, safeTransaction);
    return addExtraGasForSafety(safeTxGas);
}
/**
 * Increase the given safeTxGas gas amount by 5% as a security margin to avoid running out of gas.
 * In some contexts, the safeTxGas might be underestimated, leading to 'out of gas' errors during the Safe transaction execution
 *
 * @param {string} safeTxGas - The original safeTxGas gas amount.
 * @returns {string} The new safeTxGas gas amount, increased by 5% rounded.
 */
function addExtraGasForSafety(safeTxGas) {
    const INCREASE_GAS_FACTOR = 1.05; // increase the gas by 5% as a security margin
    return Math.round(Number(safeTxGas) * INCREASE_GAS_FACTOR).toString();
}
/**
 * This function estimates the safeTxGas of a Safe transaction.
 * Using the deprecated method of requiredTxGas defined in the GnosisSafe contract. This method is meant to be used for Safe versions < 1.3.0.
 * see: https://github.com/safe-global/safe-contracts/blob/v1.2.0/contracts/GnosisSafe.sol#L276
 *
 * @async
 * @function estimateSafeTxGasWithRequiredTxGas
 * @param {Safe} safe - The Safe instance containing all the necessary information about the safe.
 * @param {SafeTransaction} safeTransaction - The transaction for which the safeTxGas is to be estimated.
 * @returns {Promise<string>} A Promise that resolves with the estimated safeTxGas as a string.
 *
 */
async function estimateSafeTxGasWithRequiredTxGas(safe, safeTransaction) {
    const isSafeDeployed = await safe.isSafeDeployed();
    const safeAddress = await safe.getAddress();
    const safeVersion = safe.getContractVersion();
    const safeProvider = safe.getSafeProvider();
    const isL1SafeSingleton = safe.getContractManager().isL1SafeSingleton;
    const chainId = await safe.getChainId();
    const customContracts = safe.getContractManager().contractNetworks?.[chainId.toString()];
    const safeSingletonContract = await (0, safeDeploymentContracts_1.getSafeContract)({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts
    });
    const safeContractCompatibleWithRequiredTxGas = await (0, safeVersions_1.isSafeContractCompatibleWithRequiredTxGas)(safeSingletonContract);
    const transactionDataToEstimate = safeContractCompatibleWithRequiredTxGas.encode('requiredTxGas', [
        safeTransaction.data.to,
        BigInt(safeTransaction.data.value),
        (0, types_1.asHex)(safeTransaction.data.data),
        safeTransaction.data.operation
    ]);
    const to = isSafeDeployed ? safeAddress : safeSingletonContract.getAddress();
    const transactionToEstimateGas = {
        to,
        value: '0',
        data: transactionDataToEstimate,
        from: safeAddress
    };
    try {
        const encodedResponse = await safeProvider.call(transactionToEstimateGas);
        const safeTxGas = '0x' + encodedResponse.slice(-32);
        return safeTxGas;
        // if the call throws an error we try to parse the returned value
    }
    catch (error) {
        try {
            const revertData = error?.info?.error?.data;
            if (revertData && revertData.startsWith('Reverted ')) {
                const [, safeTxGas] = revertData.split('Reverted ');
                return Number(safeTxGas).toString();
            }
        }
        catch {
            return '0';
        }
    }
    return '0';
}
// TO-DO: Improve decoding
/*
  const simulateAndRevertResponse = safeProvider.decodeParameters(
    ['bool', 'bytes'],
    encodedResponse
  )
  const returnedData = safeProvider.decodeParameters(['uint256', 'bool', 'bytes'], simulateAndRevertResponse[1])
  */
function decodeSafeTxGas(encodedDataResponse) {
    const [, encodedSafeTxGas] = encodedDataResponse.split('0x');
    const data = '0x' + encodedSafeTxGas;
    return Number('0x' + data.slice(184).slice(0, 10)).toString();
}
function isEthersError(error) {
    return error.data != null;
}
function isViemError(error) {
    return error instanceof viem_1.BaseError;
}
function isGnosisChainEstimationError(error) {
    return error.info.error.data != null;
}
/**
 * Parses the SafeTxGas estimation response from different providers.
 * It extracts and decodes the SafeTxGas value from the Error object.
 *
 * @param {ProviderEstimationError} error - The estimation object with the estimation data.
 * @returns {string} The SafeTxGas value.
 * @throws It Will throw an error if the SafeTxGas cannot be parsed.
 */
function parseSafeTxGasErrorResponse(error) {
    // Ethers v6
    if (isEthersError(error)) {
        return decodeSafeTxGas(error.data);
    }
    // viem
    if (isViemError(error)) {
        const cause = error.walk();
        if (typeof cause?.data === 'string') {
            return decodeSafeTxGas(cause?.data);
        }
    }
    // gnosis-chain
    if (isGnosisChainEstimationError(error)) {
        const gnosisChainProviderData = error.info.error.data;
        const isString = typeof gnosisChainProviderData === 'string';
        const encodedDataResponse = isString ? gnosisChainProviderData : gnosisChainProviderData.data;
        return decodeSafeTxGas(encodedDataResponse);
    }
    // Error message
    const isEncodedDataPresent = error.message.includes('0x');
    if (isEncodedDataPresent) {
        return decodeSafeTxGas(error.message);
    }
    throw new Error('Could not parse SafeTxGas from Estimation response, Details: ' + error?.message);
}
/**
 * This function estimates the safeTxGas of a Safe transaction.
 * It uses the simulate function defined in the SimulateTxAccessor contract. This method is meant to be used for Safe versions >= 1.3.0.
 *
 * @async
 * @function estimateSafeTxGasWithSimulate
 * @param {Safe} safe - The Safe instance containing all the necessary information about the safe.
 * @param {SafeTransaction} safeTransaction - The transaction for which the safeTxGas is to be estimated.
 * @returns {Promise<string>} A Promise that resolves with the estimated safeTxGas as a string.
 *
 */
async function estimateSafeTxGasWithSimulate(safe, safeTransaction) {
    const isSafeDeployed = await safe.isSafeDeployed();
    const safeAddress = await safe.getAddress();
    const safeVersion = safe.getContractVersion();
    const safeProvider = safe.getSafeProvider();
    const chainId = await safe.getChainId();
    const customContracts = safe.getContractManager().contractNetworks?.[chainId.toString()];
    const isL1SafeSingleton = safe.getContractManager().isL1SafeSingleton;
    const safeSingletonContract = await (0, safeDeploymentContracts_1.getSafeContract)({
        safeProvider,
        safeVersion,
        isL1SafeSingleton,
        customContracts
    });
    // new version of the estimation
    const simulateTxAccessorContract = await (0, safeDeploymentContracts_1.getSimulateTxAccessorContract)({
        safeProvider,
        safeVersion,
        customContracts
    });
    const transactionDataToEstimate = simulateTxAccessorContract.encode('simulate', [
        safeTransaction.data.to,
        BigInt(safeTransaction.data.value),
        (0, types_1.asHex)(safeTransaction.data.data),
        safeTransaction.data.operation
    ]);
    // if the Safe is not deployed we can use the singleton address to simulate
    const to = isSafeDeployed ? safeAddress : safeSingletonContract.getAddress();
    const SafeContractCompatibleWithSimulateAndRevert = await (0, safeVersions_1.isSafeContractCompatibleWithSimulateAndRevert)(safeSingletonContract);
    const safeFunctionToEstimate = SafeContractCompatibleWithSimulateAndRevert.encode('simulateAndRevert', [simulateTxAccessorContract.getAddress(), (0, types_1.asHex)(transactionDataToEstimate)]);
    const transactionToEstimateGas = {
        to,
        value: '0',
        data: safeFunctionToEstimate,
        from: safeAddress
    };
    try {
        const encodedResponse = await safeProvider.call(transactionToEstimateGas);
        const safeTxGas = decodeSafeTxGas(encodedResponse);
        return safeTxGas;
        // if the call throws an error we try to parse the returned value
    }
    catch (error) {
        return parseSafeTxGasErrorResponse(error);
    }
}
/**
 * This function estimates the gas cost of deploying a Safe.
 * It considers also the costs of the Safe setup call.
 * The setup call includes tasks such as setting up initial owners, defining the threshold, and initializing the salt nonce used for address generation.
 *
 * @async
 * @function estimateSafeDeploymentGas
 * @param {Safe} safe - The Safe object containing all necessary information about the safe, including owners, threshold, and saltNonce.
 * @returns {Promise<string>} A Promise that resolves with the estimated gas cost of the safe deployment as a string.
 */
async function estimateSafeDeploymentGas(safe) {
    const isSafeDeployed = await safe.isSafeDeployed();
    if (isSafeDeployed) {
        return '0';
    }
    const safeProvider = safe.getSafeProvider();
    const safeDeploymentTransaction = await safe.createSafeDeploymentTransaction();
    const estimation = await safeProvider.estimateGas({
        ...safeDeploymentTransaction,
        from: constants_1.ZERO_ADDRESS // if we use the Safe address the estimation always fails due to CREATE2
    });
    return estimation;
}
//# sourceMappingURL=gas.js.map