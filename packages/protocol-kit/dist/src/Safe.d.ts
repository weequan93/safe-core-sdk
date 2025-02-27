import { SafeMultisigTransactionResponse, SafeSignature, SafeTransaction, SafeVersion, TransactionOptions, TransactionResult, MetaTransactionData, Transaction, EIP712TypedData } from '@safe-global/types-kit';
import { ContractInfo } from './contracts/config';
import ContractManager from './managers/contractManager';
import { AddOwnerTxParams, AddPasskeyOwnerTxParams, ConnectSafeConfig, CreateTransactionProps, PredictedSafeProps, RemoveOwnerTxParams, SafeConfig, SigningMethodType, SwapOwnerTxParams, SafeModulesPaginated, RemovePasskeyOwnerTxParams } from './types';
import { SafeTransactionOptionalProps } from './utils/transactions/types';
import SafeMessage from './utils/messages/SafeMessage';
import SafeProvider from './SafeProvider';
declare class Safe {
    #private;
    /**
     * Creates an instance of the Safe Core SDK.
     * @param config - Ethers Safe configuration
     * @returns The Safe Core SDK instance
     * @throws "The SDK must be initialized with a safeAddress or a predictedSafe"
     * @throws "SafeProxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     * @throws "MultiSendCallOnly contract is not deployed on the current network"
     */
    static init(config: SafeConfig): Promise<Safe>;
    /**
     * Returns a new instance of the Safe Core SDK.
     * @param config - Connect Safe configuration
     * @throws "A safeAddress and a predictedSafe cannot be connected at the same time"
     * @throws "SafeProxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     * @throws "MultiSendCallOnly contract is not deployed on the current network"
     */
    connect(config: ConnectSafeConfig): Promise<Safe>;
    /**
     * Returns the initialization code to deploy a Safe account based on the predicted address.
     *
     * @returns The Safe configuration
     */
    getInitCode(): Promise<string>;
    /**
     * Returns the predicted Safe configuration.
     * @returns {PredictedSafeProps | undefined} The predicted Safe configuration
     */
    getPredictedSafe(): PredictedSafeProps | undefined;
    /**
     * Returns the address of the current SafeProxy contract.
     *
     * @returns The address of the SafeProxy contract
     */
    getAddress(): Promise<string>;
    /**
     * Returns the ContractManager
     *
     * @returns The current ContractManager
     * */
    getContractManager(): ContractManager;
    /**
     * Returns the current SafeProvider.
     *
     * @returns The current SafeProvider
     */
    getSafeProvider(): SafeProvider;
    /**
     * Returns the address of the MultiSend contract.
     *
     * @returns The address of the MultiSend contract
     */
    getMultiSendAddress(): string;
    /**
     * Returns the address of the MultiSendCallOnly contract.
     *
     * @returns The address of the MultiSendCallOnly contract
     */
    getMultiSendCallOnlyAddress(): string;
    /**
     * Checks if the current Safe is deployed.
     *
     * @returns TRUE if the Safe contract is deployed
     */
    isSafeDeployed(): Promise<boolean>;
    /**
     * Returns the Safe Singleton contract version.
     *
     * @returns The Safe Singleton contract version
     */
    getContractVersion(): SafeVersion;
    /**
     * Returns the list of Safe owner accounts.
     *
     * @returns The list of owners
     */
    getOwners(): Promise<string[]>;
    /**
     * Returns the Safe nonce.
     *
     * @returns The Safe nonce
     */
    getNonce(): Promise<number>;
    /**
     * Returns the Safe threshold.
     *
     * @returns The Safe threshold
     */
    getThreshold(): Promise<number>;
    /**
     * Returns the chainId of the connected network.
     *
     * @returns The chainId of the connected network
     */
    getChainId(): Promise<bigint>;
    /**
     * Returns the ETH balance of the Safe.
     *
     * @returns The ETH balance of the Safe
     */
    getBalance(): Promise<bigint>;
    /**
     * Returns the address of the FallbackHandler contract.
     *
     * @returns The address of the FallbackHandler contract
     */
    getFallbackHandler(): Promise<string>;
    /**
     * Returns the enabled Safe guard or 0x address if no guards are enabled.
     *
     * @returns The address of the enabled Safe guard
     * @throws "Current version of the Safe does not support Safe transaction guards functionality"
     */
    getGuard(): Promise<string>;
    /**
     * Returns the list of addresses of all the enabled Safe modules.
     *
     * @returns The list of addresses of all the enabled Safe modules
     */
    getModules(): Promise<string[]>;
    /**
     * Returns the list of addresses of all the enabled Safe modules. The list will start on the next position address in relation to start.
     *
     * @param start - The address to be "offsetted" from the list, should be SENTINEL_ADDRESS otherwise.
     * @param pageSize - The size of the page. It will be the max length of the returning array. Must be greater then 0.
     * @returns The list of addresses of all the enabled Safe modules
     */
    getModulesPaginated(start: string, pageSize?: number): Promise<SafeModulesPaginated>;
    /**
     * Checks if a specific Safe module is enabled for the current Safe.
     *
     * @param moduleAddress - The desired module address
     * @returns TRUE if the module is enabled
     */
    isModuleEnabled(moduleAddress: string): Promise<boolean>;
    /**
     * Checks if a specific address is an owner of the current Safe.
     *
     * @param ownerAddress - The account address
     * @returns TRUE if the account is an owner
     */
    isOwner(ownerAddress: string): Promise<boolean>;
    /**
     * Returns a Safe transaction ready to be signed by the owners.
     *
     * @param createTransactionProps - The createTransaction props
     * @returns The Safe transaction
     * @throws "Invalid empty array of transactions"
     */
    createTransaction({ transactions, onlyCalls, options }: CreateTransactionProps): Promise<SafeTransaction>;
    /**
     * Returns a Safe transaction ready to be signed by the owners that invalidates the pending Safe transaction/s with a specific nonce.
     *
     * @param nonce - The nonce of the transaction/s that are going to be rejected
     * @returns The Safe transaction that invalidates the pending Safe transaction/s
     */
    createRejectionTransaction(nonce: number): Promise<SafeTransaction>;
    /**
     * Copies a Safe transaction
     *
     * @param safeTransaction - The Safe transaction
     * @returns The new Safe transaction
     */
    copyTransaction(safeTransaction: SafeTransaction): Promise<SafeTransaction>;
    /**
     * Returns the transaction hash of a Safe transaction.
     *
     * @param safeTransaction - The Safe transaction
     * @returns The hash of the Safe transaction
     */
    getTransactionHash(safeTransaction: SafeTransaction): Promise<string>;
    /**
     * Signs a hash using the current signer account.
     *
     * @param hash - The hash to sign
     * @returns The Safe signature
     */
    signHash(hash: string): Promise<SafeSignature>;
    /**
     * Returns a Safe message ready to be signed by the owners.
     *
     * @param message - The message
     * @returns The Safe message
     */
    createMessage(message: string | EIP712TypedData): SafeMessage;
    /**
     * Returns the Safe message with a new signature
     *
     * @param message The message to be signed
     * @param signingMethod The signature type
     * @param preimageSafeAddress If the preimage is required, the address of the Safe that will be used to calculate the preimage.
     * This field is mandatory for 1.4.1 contract versions Because the safe uses the old EIP-1271 interface which uses `bytes` instead of `bytes32` for the message
     * we need to use the pre-image of the message to calculate the message hash
     * https://github.com/safe-global/safe-contracts/blob/192c7dc67290940fcbc75165522bb86a37187069/test/core/Safe.Signatures.spec.ts#L229-L233
     * @returns The signed Safe message
     */
    signMessage(message: SafeMessage, signingMethod?: SigningMethodType, preimageSafeAddress?: string): Promise<SafeMessage>;
    /**
     * Signs a transaction according to the EIP-712 using the current signer account.
     *
     * @param eip712Data - The Safe Transaction or message hash to be signed
     * @param methodVersion - EIP-712 version. Optional
     * @returns The Safe signature
     */
    signTypedData(eip712Data: SafeTransaction | SafeMessage, methodVersion?: 'v3' | 'v4'): Promise<SafeSignature>;
    /**
     * Adds the signature of the current signer to the Safe transaction object.
     *
     * @param safeTransaction - The Safe transaction to be signed
     * @param signingMethod - Method followed to sign a transaction. Optional. Default value is "eth_sign"
     * @param preimageSafeAddress - If the preimage is required, the address of the Safe that will be used to calculate the preimage
     * This field is mandatory for 1.3.0 and 1.4.1 contract versions Because the safe uses the old EIP-1271 interface which uses `bytes` instead of `bytes32` for the message
     * we need to use the pre-image of the message to calculate the message hash
     * https://github.com/safe-global/safe-contracts/blob/192c7dc67290940fcbc75165522bb86a37187069/test/core/Safe.Signatures.spec.ts#L229-L233
     * @returns The signed Safe transaction
     * @throws "Transactions can only be signed by Safe owners"
     */
    signTransaction(safeTransaction: SafeTransaction | SafeMultisigTransactionResponse, signingMethod?: SigningMethodType, preimageSafeAddress?: string): Promise<SafeTransaction>;
    /**
     * Approves on-chain a hash using the current signer account.
     *
     * @param hash - The hash to approve
     * @param options - The Safe transaction execution options. Optional
     * @returns The Safe transaction response
     * @throws "Transaction hashes can only be approved by Safe owners"
     * @throws "Cannot specify gas and gasLimit together in transaction options"
     */
    approveTransactionHash(hash: string, options?: TransactionOptions): Promise<TransactionResult>;
    /**
     * Returns a list of owners who have approved a specific Safe transaction.
     *
     * @param txHash - The Safe transaction hash
     * @returns The list of owners
     */
    getOwnersWhoApprovedTx(txHash: string): Promise<string[]>;
    /**
     * Returns the Safe transaction to enable the fallback handler.
     *
     * @param address - The new fallback handler address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid fallback handler address provided"
     * @throws "Fallback handler provided is already enabled"
     * @throws "Current version of the Safe does not support the fallback handler functionality"
     */
    createEnableFallbackHandlerTx(fallbackHandlerAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to disable the fallback handler.
     *
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "There is no fallback handler enabled yet"
     * @throws "Current version of the Safe does not support the fallback handler functionality"
     */
    createDisableFallbackHandlerTx(options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to enable a Safe guard.
     *
     * @param guardAddress - The desired guard address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid guard address provided"
     * @throws "Guard provided is already enabled"
     * @throws "Current version of the Safe does not support Safe transaction guards functionality"
     */
    createEnableGuardTx(guardAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to disable a Safe guard.
     *
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "There is no guard enabled yet"
     * @throws "Current version of the Safe does not support Safe transaction guards functionality"
     */
    createDisableGuardTx(options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to enable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is already enabled"
     */
    createEnableModuleTx(moduleAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to disable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is not enabled already"
     */
    createDisableModuleTx(moduleAddress: string, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to add an owner and optionally change the threshold.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid owner address provided"
     * @throws "Address provided is already an owner"
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    createAddOwnerTx(params: AddOwnerTxParams | AddPasskeyOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to remove an owner and optionally change the threshold.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid owner address provided"
     * @throws "Address provided is not an owner"
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    createRemoveOwnerTx(params: RemoveOwnerTxParams | RemovePasskeyOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to replace an owner of the Safe with a new one.
     *
     * @param params - The transaction params
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid new owner address provided"
     * @throws "Invalid old owner address provided"
     * @throws "New address provided is already an owner"
     * @throws "Old address provided is not an owner"
     */
    createSwapOwnerTx(params: SwapOwnerTxParams, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Returns the Safe transaction to change the threshold.
     *
     * @param threshold - The new threshold
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    createChangeThresholdTx(threshold: number, options?: SafeTransactionOptionalProps): Promise<SafeTransaction>;
    /**
     * Converts a transaction from type SafeMultisigTransactionResponse to type SafeTransaction
     *
     * @param serviceTransactionResponse - The transaction to convert
     * @returns The converted transaction with type SafeTransaction
     */
    toSafeTransactionType(serviceTransactionResponse: SafeMultisigTransactionResponse): Promise<SafeTransaction>;
    /**
     * Checks if a Safe transaction can be executed successfully with no errors.
     *
     * @param safeTransaction - The Safe transaction to check
     * @param options - The Safe transaction execution options. Optional
     * @returns TRUE if the Safe transaction can be executed successfully with no errors
     */
    isValidTransaction(safeTransaction: SafeTransaction | SafeMultisigTransactionResponse, options?: TransactionOptions): Promise<boolean>;
    /**
     * Executes a Safe transaction.
     *
     * @param safeTransaction - The Safe transaction to execute
     * @param options - The Safe transaction execution options. Optional
     * @returns The Safe transaction response
     * @throws "No signer provided"
     * @throws "There are X signatures missing"
     * @throws "Cannot specify gas and gasLimit together in transaction options"
     */
    executeTransaction(safeTransaction: SafeTransaction | SafeMultisigTransactionResponse, options?: TransactionOptions): Promise<TransactionResult>;
    /**
     * Returns the Safe Transaction encoded
     *
     * @async
     * @param {SafeTransaction} safeTransaction - The Safe transaction to be encoded.
     * @returns {Promise<string>} The encoded transaction
     *
     */
    getEncodedTransaction(safeTransaction: SafeTransaction): Promise<string>;
    /**
     * Wraps a Safe transaction into a Safe deployment batch.
     *
     * This function creates a transaction batch of 2 transactions, which includes the
     * deployment of the Safe and the provided Safe transaction.
     *
     * @async
     * @param {SafeTransaction} safeTransaction - The Safe transaction to be wrapped into the deployment batch.
     * @param {TransactionOptions} [transactionOptions] - Optional. Options for the transaction, such as from, gas price, gas limit, etc.
     * @param {string} [customSaltNonce] - Optional. a Custom salt nonce to be used for the deployment of the Safe. If not provided, a default value is used.
     * @returns {Promise<Transaction>} A promise that resolves to a Transaction object representing the prepared batch of transactions.
     * @throws Will throw an error if the safe is already deployed.
     *
     */
    wrapSafeTransactionIntoDeploymentBatch(safeTransaction: SafeTransaction, transactionOptions?: TransactionOptions, customSaltNonce?: string): Promise<Transaction>;
    /**
     * Creates a Safe deployment transaction.
     *
     * This function prepares a transaction for the deployment of a Safe.
     * Both the saltNonce and options parameters are optional, and if not
     * provided, default values will be used.
     *
     * @async
     * @param {string} [customSaltNonce] - Optional. a Custom salt nonce to be used for the deployment of the Safe. If not provided, a default value is used.
     * @param {TransactionOptions} [options] - Optional. Options for the transaction, such as gas price, gas limit, etc.
     * @returns {Promise<Transaction>} A promise that resolves to a Transaction object representing the prepared Safe deployment transaction.
     *
     */
    createSafeDeploymentTransaction(customSaltNonce?: string, transactionOptions?: TransactionOptions): Promise<Transaction>;
    /**
     * This function creates a batch of the provided Safe transactions using the MultiSend contract.
     * It groups the transactions together into a single transaction which can then be executed atomically.
     *
     * @async
     * @function createTransactionBatch
     * @param {MetaTransactionData[]} transactions - An array of MetaTransactionData objects to be batched together.
     * @param {TransactionOption} [transactionOptions] - Optional TransactionOption object to specify additional options for the transaction batch.
     * @returns {Promise<Transaction>} A Promise that resolves with the created transaction batch.
     *
     */
    createTransactionBatch(transactions: MetaTransactionData[], transactionOptions?: TransactionOptions): Promise<Transaction>;
    /**
     * Call the CompatibilityFallbackHandler getMessageHash method
     *
     * @param messageHash The hash of the message
     * @returns Returns the Safe message hash to be signed
     * @link https://github.com/safe-global/safe-contracts/blob/8ffae95faa815acf86ec8b50021ebe9f96abde10/contracts/handler/CompatibilityFallbackHandler.sol#L26-L28
     */
    getSafeMessageHash: (messageHash: string) => Promise<string>;
    /**
     * Call the CompatibilityFallbackHandler isValidSignature method
     *
     * @param messageHash The hash of the message
     * @param signature The signature to be validated or '0x'. You can send as signature one of the following:
     *  1) An array of SafeSignature. In this case the signatures are concatenated for validation (buildSignatureBytes())
     *  2) The concatenated signatures as string
     *  3) '0x' if you want to validate an onchain message (Approved hash)
     * @returns A boolean indicating if the signature is valid
     * @link https://github.com/safe-global/safe-contracts/blob/main/contracts/handler/CompatibilityFallbackHandler.sol
     */
    isValidSignature: (messageHash: string, signature?: SafeSignature[] | string) => Promise<boolean>;
    getContractInfo: ({ contractAddress }: {
        contractAddress: string;
    }) => ContractInfo | undefined;
}
export default Safe;
