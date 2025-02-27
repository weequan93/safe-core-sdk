"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("viem/actions");
const SafeBaseContract_1 = __importDefault(require("../../../contracts/Safe/SafeBaseContract"));
const utils_1 = require("../../../contracts/utils");
const utils_2 = require("../../../utils");
const types_kit_1 = require("@safe-global/types-kit");
const constants_1 = require("../../../utils/constants");
const types_1 = require("../../../utils/types");
/**
 * SafeContract_v1_0_0  is the implementation specific to the Safe contract version 1.0.0.
 *
 * This class specializes in handling interactions with the Safe contract version 1.0.0 using Ethers.js v6.
 *
 * @extends SafeBaseContract<SafeContract_v1_0_0_Abi> - Inherits from SafeBaseContract with ABI specific to Safe contract version 1.0.0.
 * @implements SafeContract_v1_0_0_Contract - Implements the interface specific to Safe contract version 1.0.0.
 */
class SafeContract_v1_0_0 extends SafeBaseContract_1.default {
    /**
     * Constructs an instance of SafeContract_v1_0_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param isL1SafeSingleton - A flag indicating if the contract is a L1 Safe Singleton.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.0.0 is used.
     * @param deploymentType - Optional deployment type for the contract. If not provided, the first deployment retrieved from the safe-deployments array will be used.
     */
    constructor(chainId, safeProvider, isL1SafeSingleton = false, customContractAddress, customContractAbi, deploymentType) {
        const safeVersion = '1.0.0';
        const defaultAbi = types_kit_1.safe_1_0_0_ContractArtifacts.abi;
        super(chainId, safeProvider, defaultAbi, safeVersion, isL1SafeSingleton, customContractAddress, customContractAbi, deploymentType);
        /* ----- Specific v1.0.0 properties -----  */
        this.DOMAIN_SEPARATOR_TYPEHASH = async () => {
            return [await this.read('DOMAIN_SEPARATOR_TYPEHASH')];
        };
        this.SENTINEL_MODULES = async () => {
            return [await this.read('SENTINEL_MODULES')];
        };
        this.SENTINEL_OWNERS = async () => {
            return [await this.read('SENTINEL_OWNERS')];
        };
        this.SAFE_MSG_TYPEHASH = async () => {
            return [await this.read('SAFE_MSG_TYPEHASH')];
        };
        this.SAFE_TX_TYPEHASH = async () => {
            return [await this.read('SAFE_TX_TYPEHASH')];
        };
        /* ----- End of specific v1.0.0 properties -----  */
        /**
         * @returns Array[contractName]
         */
        this.NAME = async () => {
            return [await this.read('NAME')];
        };
        /**
         * @returns Array[safeContractVersion]
         */
        this.VERSION = async () => {
            return [await this.read('VERSION')];
        };
        /**
         * @param args - Array[owner, txHash]
         * @returns Array[approvedHashes]
         */
        this.approvedHashes = async (args) => {
            return [await this.read('approvedHashes', args)];
        };
        /**
         * @returns Array[domainSeparator]
         */
        this.domainSeparator = async () => {
            return [await this.read('domainSeparator')];
        };
        /**
         * Returns array of modules.
         * @returns Array[Array[modules]]
         */
        this.getModules = async () => {
            return [await this.read('getModules')];
        };
        /**
         * Returns the list of Safe owner accounts.
         * @returns Array[Array[owners]]
         */
        this.getOwners = async () => {
            return [await this.read('getOwners')];
        };
        /**
         * Returns the Safe threshold.
         * @returns Array[threshold]
         */
        this.getThreshold = async () => {
            return [await this.read('getThreshold')];
        };
        /**
         * Checks if a specific address is an owner of the current Safe.
         * @param args - Array[address]
         * @returns Array[isOwner]
         */
        this.isOwner = async (args) => {
            return [await this.read('isOwner', args)];
        };
        /**
         * Returns the Safe nonce.
         * @returns Array[nonce]
         */
        this.nonce = async () => {
            return [await this.read('nonce')];
        };
        /**
         * @param args - Array[messageHash]
         * @returns Array[signedMessages]
         */
        this.signedMessages = async (args) => {
            return [await this.read('signedMessages', args)];
        };
        /**
         * Returns hash of a message that can be signed by owners.
         * @param args - Array[message]
         * @returns Array[messageHash]
         */
        this.getMessageHash = async (args) => {
            return [await this.read('getMessageHash', args)];
        };
        /**
         * Returns the bytes that are hashed to be signed by owners.
         * @param args - Array[to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]
         * @returns Array[encodedData]
         */
        this.encodeTransactionData = async (args) => {
            return [await this.read('encodeTransactionData', args)];
        };
        /**
         * Returns hash to be signed by owners.
         * @param args - Array[to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]
         * @returns Array[transactionHash]
         */
        this.getTransactionHash = async (args) => {
            return [await this.read('getTransactionHash', args)];
        };
    }
    /**
     * Marks a hash as approved. This can be used to validate a hash that is used by a signature.
     * @param hash - The hash that should be marked as approved for signatures that are verified by this contract.
     * @param options - Optional transaction options.
     * @returns Transaction result.
     */
    async approveHash(hash, options) {
        const gasLimit = options?.gasLimit || (await this.estimateGas('approveHash', [(0, types_1.asHash)(hash)], options));
        return (0, utils_1.toTxResult)(this.runner, await this.write('approveHash', [(0, types_1.asHash)(hash)], { ...options, gasLimit }), options);
    }
    /**
     * Executes a transaction.
     * @param safeTransaction - The Safe transaction to execute.
     * @param options - Transaction options.
     * @returns Transaction result.
     */
    async execTransaction(safeTransaction, options) {
        const gasLimit = options?.gasLimit ||
            (await this.estimateGas('execTransaction', [
                safeTransaction.data.to,
                BigInt(safeTransaction.data.value),
                (0, types_1.asHex)(safeTransaction.data.data),
                safeTransaction.data.operation,
                BigInt(safeTransaction.data.safeTxGas),
                BigInt(safeTransaction.data.baseGas),
                BigInt(safeTransaction.data.gasPrice),
                safeTransaction.data.gasToken,
                safeTransaction.data.refundReceiver,
                (0, types_1.asHex)(safeTransaction.encodedSignatures())
            ], options));
        const args = [
            safeTransaction.data.to,
            BigInt(safeTransaction.data.value),
            (0, types_1.asHex)(safeTransaction.data.data),
            safeTransaction.data.operation,
            BigInt(safeTransaction.data.safeTxGas),
            BigInt(safeTransaction.data.baseGas),
            BigInt(safeTransaction.data.gasPrice),
            safeTransaction.data.gasToken,
            safeTransaction.data.refundReceiver,
            (0, types_1.asHex)(safeTransaction.encodedSignatures())
        ];
        return (0, utils_1.toTxResult)(this.runner, await this.write('execTransaction', args, { ...options, gasLimit }), options);
    }
    async getModulesPaginated([start, pageSize]) {
        if (pageSize <= 0)
            throw new Error('Invalid page size for fetching paginated modules');
        const size = Number(pageSize);
        const [array] = await this.getModules();
        if ((0, utils_2.isSentinelAddress)(start)) {
            const next = pageSize < array.length ? array[size] : constants_1.SENTINEL_ADDRESS;
            return [array.slice(0, size), next];
        }
        else {
            const moduleIndex = array.findIndex((module) => (0, utils_2.sameString)(module, start));
            if (moduleIndex === -1) {
                return [[], constants_1.SENTINEL_ADDRESS];
            }
            const nextElementIndex = moduleIndex + 1;
            const nextPageAddress = nextElementIndex + size < array.length ? array[nextElementIndex + size] : constants_1.SENTINEL_ADDRESS;
            return [array.slice(moduleIndex + 1, nextElementIndex + size), nextPageAddress];
        }
    }
    /**
     * Checks if a specific Safe module is enabled for the current Safe.
     * @param moduleAddress - The module address to check.
     * @returns True, if the module with the given address is enabled.
     */
    async isModuleEnabled([moduleAddress]) {
        const [modules] = await this.getModules();
        const isModuleEnabled = modules.some((enabledModuleAddress) => (0, utils_2.sameString)(enabledModuleAddress, moduleAddress));
        return [isModuleEnabled];
    }
    /**
     * Checks whether a given Safe transaction can be executed successfully with no errors.
     * @param safeTransaction - The Safe transaction to check.
     * @param options - Optional transaction options.
     * @returns True, if the given transactions is valid.
     */
    async isValidTransaction(safeTransaction, options = {}) {
        try {
            const gasLimit = options?.gasLimit ||
                (await this.estimateGas('execTransaction', [
                    safeTransaction.data.to,
                    BigInt(safeTransaction.data.value),
                    (0, types_1.asHex)(safeTransaction.data.data),
                    safeTransaction.data.operation,
                    BigInt(safeTransaction.data.safeTxGas),
                    BigInt(safeTransaction.data.baseGas),
                    BigInt(safeTransaction.data.gasPrice),
                    safeTransaction.data.gasToken,
                    safeTransaction.data.refundReceiver,
                    (0, types_1.asHex)(safeTransaction.encodedSignatures())
                ], options));
            const converted = this.convertOptions({ ...options, gasLimit });
            const txResult = await (0, actions_1.simulateContract)(this.runner, {
                address: this.contractAddress,
                functionName: 'execTransaction',
                abi: this.contractAbi,
                args: [
                    safeTransaction.data.to,
                    BigInt(safeTransaction.data.value),
                    (0, types_1.asHex)(safeTransaction.data.data),
                    safeTransaction.data.operation,
                    BigInt(safeTransaction.data.safeTxGas),
                    BigInt(safeTransaction.data.baseGas),
                    BigInt(safeTransaction.data.gasPrice),
                    safeTransaction.data.gasToken,
                    safeTransaction.data.refundReceiver,
                    (0, types_1.asHex)(safeTransaction.encodedSignatures())
                ],
                ...converted
            });
            return txResult.result;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * returns the nonce of the Safe contract.
     *
     * @returns {Promise<bigint>} A promise that resolves to the nonce of the Safe contract.
     */
    async getNonce() {
        const [nonce] = await this.nonce();
        return nonce;
    }
}
exports.default = SafeContract_v1_0_0;
//# sourceMappingURL=SafeContract_v1_0_0.js.map