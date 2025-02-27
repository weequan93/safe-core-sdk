import SafeBaseContract from '../../../contracts/Safe/SafeBaseContract';
import SafeProvider from '../../../SafeProvider';
import { DeploymentType } from '../../../types';
import { SafeContract_v1_4_1_Abi, SafeContract_v1_4_1_Contract, SafeContract_v1_4_1_Function, SafeTransaction, TransactionOptions, TransactionResult } from '@safe-global/types-kit';
/**
 * SafeContract_v1_4_1  is the implementation specific to the Safe contract version 1.4.1.
 *
 * This class specializes in handling interactions with the Safe contract version 1.4.1 using Ethers.js v6.
 *
 * @extends SafeBaseContract<SafeContract_v1_4_1_Abi> - Inherits from SafeBaseContract with ABI specific to Safe contract version 1.4.1.
 * @implements SafeContract_v1_4_1_Contract - Implements the interface specific to Safe contract version 1.4.1.
 */
declare class SafeContract_v1_4_1 extends SafeBaseContract<SafeContract_v1_4_1_Abi> implements SafeContract_v1_4_1_Contract {
    /**
     * Constructs an instance of SafeContract_v1_4_1
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param isL1SafeSingleton - A flag indicating if the contract is a L1 Safe Singleton.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.4.1 is used.
     * @param deploymentType - Optional deployment type for the contract. If not provided, the first deployment retrieved from the safe-deployments array will be used.
     */
    constructor(chainId: bigint, safeProvider: SafeProvider, isL1SafeSingleton?: boolean, customContractAddress?: string, customContractAbi?: SafeContract_v1_4_1_Abi, deploymentType?: DeploymentType);
    /**
     * @returns Array[safeContractVersion]
     */
    VERSION: SafeContract_v1_4_1_Function<'VERSION'>;
    /**
     * @param args - Array[owner, txHash]
     * @returns Array[approvedHashes]
     */
    approvedHashes: SafeContract_v1_4_1_Function<'approvedHashes'>;
    /**
     * Checks whether the signature provided is valid for the provided data, hash and number of required signatures.
     * Will revert otherwise.
     * @param args - Array[dataHash, data, signatures, requiredSignatures]
     * @returns Empty array
     */
    checkNSignatures: SafeContract_v1_4_1_Function<'checkNSignatures'>;
    /**
     * Checks whether the signature provided is valid for the provided data and hash. Will revert otherwise.
     * @param args - Array[dataHash, data, signatures]
     * @returns Empty array
     */
    checkSignatures: SafeContract_v1_4_1_Function<'checkSignatures'>;
    /**
     * @returns Array[domainSeparator]
     */
    domainSeparator: SafeContract_v1_4_1_Function<'domainSeparator'>;
    /**
     * Encodes the data for a transaction to the Safe contract.
     * @param args - Array[to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]
     * @returns Array[encodedData]
     */
    encodeTransactionData: SafeContract_v1_4_1_Function<'encodeTransactionData'>;
    /**
     * Returns array of modules.
     * @param args - Array[start, pageSize]
     * @returns Array[Array[modules], next]
     */
    getModulesPaginated: SafeContract_v1_4_1_Function<'getModulesPaginated'>;
    /**
     * Returns the list of Safe owner accounts.
     * @returns Array[Array[owners]]
     */
    getOwners: SafeContract_v1_4_1_Function<'getOwners'>;
    /**
     * Reads `length` bytes of storage in the currents contract
     * @param args - Array[offset, length]
     * @returns Array[storage]
     */
    getStorageAt: SafeContract_v1_4_1_Function<'getStorageAt'>;
    /**
     * Returns the Safe threshold.
     * @returns Array[threshold]
     */
    getThreshold: SafeContract_v1_4_1_Function<'getThreshold'>;
    /**
     * Returns hash to be signed by owners.
     * @param args - Array[to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]
     * @returns Array[transactionHash]
     */
    getTransactionHash: SafeContract_v1_4_1_Function<'getTransactionHash'>;
    /**
     * Checks if a specific Safe module is enabled for the current Safe.
     * @param args - Array[moduleAddress]
     * @returns Array[isEnabled]
     */
    isModuleEnabled: SafeContract_v1_4_1_Function<'isModuleEnabled'>;
    /**
     * Checks if a specific address is an owner of the current Safe.
     * @param args - Array[address]
     * @returns Array[isOwner]
     */
    isOwner: SafeContract_v1_4_1_Function<'isOwner'>;
    /**
     * Returns the Safe nonce.
     * @returns Array[nonce]
     */
    nonce: SafeContract_v1_4_1_Function<'nonce'>;
    /**
     * @param args - Array[messageHash]
     * @returns Array[signedMessages]
     */
    signedMessages: SafeContract_v1_4_1_Function<'signedMessages'>;
    /**
     * Checks whether a given Safe transaction can be executed successfully with no errors.
     * @param safeTransaction - The Safe transaction to check.
     * @param options - Optional transaction options.
     * @returns True, if the given transactions is valid.
     */
    isValidTransaction(safeTransaction: SafeTransaction, options?: TransactionOptions): Promise<boolean>;
    /**
     * Executes a transaction.
     * @param safeTransaction - The Safe transaction to execute.
     * @param options - Transaction options.
     * @returns Transaction result.
     */
    execTransaction(safeTransaction: SafeTransaction, options?: TransactionOptions): Promise<TransactionResult>;
    /**
     * Returns array of first 10 modules.
     * @returns Array[modules]
     */
    getModules(): Promise<[string[]]>;
    /**
     * Marks a hash as approved. This can be used to validate a hash that is used by a signature.
     * @param hash - The hash that should be marked as approved for signatures that are verified by this contract.
     * @param options - Optional transaction options.
     * @returns Transaction result.
     */
    approveHash(hash: string, options?: TransactionOptions): Promise<TransactionResult>;
    /**
     * Returns the chain id of the Safe contract. (Custom method - not defined in the Safe Contract)
     * @returns Array[chainId]
     */
    getChainId(): Promise<[bigint]>;
    /**
     * returns the nonce of the Safe contract.
     *
     * @returns {Promise<bigint>} A promise that resolves to the nonce of the Safe contract.
     */
    getNonce(): Promise<bigint>;
}
export default SafeContract_v1_4_1;
