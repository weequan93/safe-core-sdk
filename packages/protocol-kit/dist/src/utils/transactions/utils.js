"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardizeMetaTransactionData = standardizeMetaTransactionData;
exports.waitForTransactionReceipt = waitForTransactionReceipt;
exports.standardizeSafeTransactionData = standardizeSafeTransactionData;
exports.encodeMultiSendData = encodeMultiSendData;
exports.decodeMultiSendData = decodeMultiSendData;
exports.isSafeMultisigTransactionResponse = isSafeMultisigTransactionResponse;
exports.isPasskeyParam = isPasskeyParam;
exports.isOldOwnerPasskey = isOldOwnerPasskey;
exports.isNewOwnerPasskey = isNewOwnerPasskey;
exports.toEstimateGasParameters = toEstimateGasParameters;
exports.toCallGasParameters = toCallGasParameters;
exports.convertTransactionOptions = convertTransactionOptions;
exports.isLegacyTransaction = isLegacyTransaction;
exports.createLegacyTxOptions = createLegacyTxOptions;
exports.createTxOptions = createTxOptions;
const SafeProvider_1 = __importDefault(require("../../SafeProvider"));
const config_1 = require("../../contracts/config");
const utils_1 = require("../../utils");
const constants_1 = require("../../utils/constants");
const types_1 = require("../types");
const types_kit_1 = require("@safe-global/types-kit");
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const gas_1 = require("./gas");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
function standardizeMetaTransactionData(tx) {
    const standardizedTxs = {
        ...tx,
        operation: tx.operation ?? types_kit_1.OperationType.Call
    };
    return standardizedTxs;
}
function waitForTransactionReceipt(client, hash) {
    return (0, actions_1.waitForTransactionReceipt)(client, { hash });
}
async function standardizeSafeTransactionData({ safeContract, predictedSafe, provider, tx, contractNetworks }) {
    const standardizedTxs = {
        to: tx.to,
        value: tx.value,
        data: tx.data,
        operation: tx.operation ?? types_kit_1.OperationType.Call,
        baseGas: tx.baseGas ?? '0',
        gasPrice: tx.gasPrice ?? '0',
        gasToken: tx.gasToken || constants_1.ZERO_ADDRESS,
        refundReceiver: tx.refundReceiver || constants_1.ZERO_ADDRESS,
        nonce: tx.nonce ?? (safeContract ? Number(await safeContract.getNonce()) : 0)
    };
    if (typeof tx.safeTxGas !== 'undefined') {
        return {
            ...standardizedTxs,
            safeTxGas: tx.safeTxGas
        };
    }
    let safeVersion;
    if (predictedSafe) {
        safeVersion = predictedSafe?.safeDeploymentConfig?.safeVersion || config_1.DEFAULT_SAFE_VERSION;
    }
    else {
        if (!safeContract) {
            throw new Error('Safe is not deployed');
        }
        safeVersion = safeContract.safeVersion;
    }
    const hasSafeTxGasOptional = (0, utils_1.hasSafeFeature)(utils_1.SAFE_FEATURES.SAFE_TX_GAS_OPTIONAL, safeVersion);
    if ((hasSafeTxGasOptional && standardizedTxs.gasPrice === '0') ||
        (hasSafeTxGasOptional && predictedSafe)) {
        return {
            ...standardizedTxs,
            safeTxGas: '0'
        };
    }
    if (!safeContract) {
        throw new Error('Safe is not deployed');
    }
    let safeTxGas;
    const safeProvider = new SafeProvider_1.default({ provider });
    if ((0, satisfies_1.default)(safeVersion, '>=1.3.0')) {
        safeTxGas = await (0, gas_1.estimateGas)(safeVersion, safeContract, safeProvider, standardizedTxs.to, standardizedTxs.value, standardizedTxs.data, standardizedTxs.operation, contractNetworks);
    }
    else {
        safeTxGas = await (0, gas_1.estimateTxGas)(safeContract, safeProvider, standardizedTxs.to, standardizedTxs.value, standardizedTxs.data, standardizedTxs.operation);
    }
    return {
        ...standardizedTxs,
        safeTxGas
    };
}
function encodeMetaTransaction(tx) {
    const data = (0, viem_1.toBytes)(tx.data);
    const encoded = (0, viem_1.encodePacked)(['uint8', 'address', 'uint256', 'uint256', 'bytes'], [
        tx.operation ?? types_kit_1.OperationType.Call,
        tx.to,
        BigInt(tx.value),
        BigInt(data.length),
        (0, viem_1.bytesToHex)(data)
    ]);
    return encoded.slice(2);
}
function encodeMultiSendData(txs) {
    return `0x${txs.map((tx) => encodeMetaTransaction(tx)).join('')}`;
}
function decodeMultiSendData(encodedData) {
    const decodedData = (0, viem_1.decodeFunctionData)({
        abi: (0, viem_1.parseAbi)(['function multiSend(bytes memory transactions) public payable']),
        data: (0, types_1.asHex)(encodedData)
    });
    const args = decodedData.args;
    const txs = [];
    // Decode after 0x
    let index = 2;
    if (args) {
        const [transactionBytes] = args;
        while (index < transactionBytes.length) {
            // As we are decoding hex encoded bytes calldata, each byte is represented by 2 chars
            // uint8 operation, address to, value uint256, dataLength uint256
            const operation = `0x${transactionBytes.slice(index, (index += 2))}`;
            const to = `0x${transactionBytes.slice(index, (index += 40))}`;
            const value = `0x${transactionBytes.slice(index, (index += 64))}`;
            const dataLength = parseInt(`${transactionBytes.slice(index, (index += 64))}`, 16) * 2;
            const data = `0x${transactionBytes.slice(index, (index += dataLength))}`;
            txs.push({
                operation: Number(operation),
                to: (0, viem_1.getAddress)(to),
                value: BigInt(value).toString(),
                data
            });
        }
    }
    return txs;
}
function isSafeMultisigTransactionResponse(safeTransaction) {
    return safeTransaction.isExecuted !== undefined;
}
function isPasskeyParam(params) {
    return params.passkey !== undefined;
}
function isOldOwnerPasskey(params) {
    return params.oldOwnerPasskey !== undefined;
}
function isNewOwnerPasskey(params) {
    return params.newOwnerPasskey !== undefined;
}
function toEstimateGasParameters(tx) {
    const params = isLegacyTransaction(tx)
        ? createLegacyTxOptions(tx)
        : createTxOptions(tx);
    if (tx.value) {
        params.value = BigInt(tx.value);
    }
    if (tx.to) {
        params.to = tx.to;
    }
    if (tx.data) {
        params.data = (0, types_1.asHex)(tx.data);
    }
    return params;
}
function toCallGasParameters(tx) {
    const params = isLegacyTransaction(tx)
        ? createLegacyTxOptions(tx)
        : createTxOptions(tx);
    if (tx.to) {
        params.to = tx.to;
    }
    if (tx.data) {
        params.data = (0, types_1.asHex)(tx.data);
    }
    return params;
}
function convertTransactionOptions(options) {
    return isLegacyTransaction(options) ? createLegacyTxOptions(options) : createTxOptions(options);
}
function isLegacyTransaction(options) {
    return !!options?.gasPrice;
}
function createLegacyTxOptions(options) {
    const converted = {};
    if (options?.from) {
        converted.account = options.from;
    }
    if (options?.gasLimit) {
        converted.gas = BigInt(options.gasLimit);
    }
    if (options?.gasPrice) {
        converted.gasPrice = BigInt(options.gasPrice);
    }
    if (options?.nonce) {
        converted.nonce = options.nonce;
    }
    return converted;
}
function createTxOptions(options) {
    const converted = {};
    if (options?.from) {
        converted.account = options.from;
    }
    if (options?.gasLimit) {
        converted.gas = BigInt(options.gasLimit);
    }
    if (options?.maxFeePerGas) {
        converted.maxFeePerGas = BigInt(options.maxFeePerGas);
    }
    if (options?.maxPriorityFeePerGas) {
        converted.maxPriorityFeePerGas = BigInt(options.maxPriorityFeePerGas);
    }
    if (options?.nonce) {
        converted.nonce = options.nonce;
    }
    return converted;
}
//# sourceMappingURL=utils.js.map