"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Safe_instances, _Safe_predictedSafe, _Safe_safeProvider, _Safe_contractManager, _Safe_ownerManager, _Safe_moduleManager, _Safe_guardManager, _Safe_fallbackHandlerManager, _Safe_MAGIC_VALUE, _Safe_MAGIC_VALUE_BYTES, _Safe_initializeProtocolKit, _Safe_getFallbackHandlerContract;
Object.defineProperty(exports, "__esModule", { value: true });
const types_kit_1 = require("@safe-global/types-kit");
const utils_1 = require("./contracts/utils");
const config_1 = require("./contracts/config");
const contractManager_1 = __importDefault(require("./managers/contractManager"));
const fallbackHandlerManager_1 = __importDefault(require("./managers/fallbackHandlerManager"));
const guardManager_1 = __importDefault(require("./managers/guardManager"));
const moduleManager_1 = __importDefault(require("./managers/moduleManager"));
const ownerManager_1 = __importDefault(require("./managers/ownerManager"));
const types_1 = require("./types");
const utils_2 = require("./utils");
const SafeTransaction_1 = __importDefault(require("./utils/transactions/SafeTransaction"));
const utils_3 = require("./utils/transactions/utils");
const types_2 = require("./utils/types");
const safeDeploymentContracts_1 = require("./contracts/safeDeploymentContracts");
const SafeMessage_1 = __importDefault(require("./utils/messages/SafeMessage"));
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const SafeProvider_1 = __importDefault(require("./SafeProvider"));
const types_3 = require("./utils/types");
const getPasskeyOwnerAddress_1 = __importDefault(require("./utils/passkeys/getPasskeyOwnerAddress"));
const createPasskeyDeploymentTransaction_1 = __importDefault(require("./utils/passkeys/createPasskeyDeploymentTransaction"));
const EQ_OR_GT_1_4_1 = '>=1.4.1';
const EQ_OR_GT_1_3_0 = '>=1.3.0';
class Safe {
    constructor() {
        _Safe_instances.add(this);
        _Safe_predictedSafe.set(this, void 0);
        _Safe_safeProvider.set(this, void 0);
        _Safe_contractManager.set(this, void 0);
        _Safe_ownerManager.set(this, void 0);
        _Safe_moduleManager.set(this, void 0);
        _Safe_guardManager.set(this, void 0);
        _Safe_fallbackHandlerManager.set(this, void 0);
        _Safe_MAGIC_VALUE.set(this, '0x1626ba7e');
        _Safe_MAGIC_VALUE_BYTES.set(this, '0x20c13b0b'
        /**
         * Creates an instance of the Safe Core SDK.
         * @param config - Ethers Safe configuration
         * @returns The Safe Core SDK instance
         * @throws "The SDK must be initialized with a safeAddress or a predictedSafe"
         * @throws "SafeProxy contract is not deployed on the current network"
         * @throws "MultiSend contract is not deployed on the current network"
         * @throws "MultiSendCallOnly contract is not deployed on the current network"
         */
        );
        /**
         * Call the CompatibilityFallbackHandler getMessageHash method
         *
         * @param messageHash The hash of the message
         * @returns Returns the Safe message hash to be signed
         * @link https://github.com/safe-global/safe-contracts/blob/8ffae95faa815acf86ec8b50021ebe9f96abde10/contracts/handler/CompatibilityFallbackHandler.sol#L26-L28
         */
        this.getSafeMessageHash = async (messageHash) => {
            const safeAddress = await this.getAddress();
            const safeVersion = this.getContractVersion();
            const chainId = await this.getChainId();
            return (0, utils_2.calculateSafeMessageHash)(safeAddress, messageHash, safeVersion, chainId);
        };
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
        this.isValidSignature = async (messageHash, signature = '0x') => {
            const safeAddress = await this.getAddress();
            const fallbackHandler = await __classPrivateFieldGet(this, _Safe_instances, "m", _Safe_getFallbackHandlerContract).call(this);
            const signatureToCheck = signature && Array.isArray(signature) ? (0, utils_2.buildSignatureBytes)(signature) : signature;
            // both bytes and bytes32 ends up being resolved to a bytes-like structure which is represented by a `0x` prefixed address.
            // because there is an overload going on, named-tuples (https://www.typescriptlang.org/play/?ts=4.0.2#example/named-tuples) are used to solve the ambiguity.
            const bytes32Tuple = [
                (0, types_3.asHash)(messageHash),
                (0, types_3.asHex)(signatureToCheck)
            ];
            const data = fallbackHandler.encode('isValidSignature', bytes32Tuple);
            const bytesTuple = [
                (0, types_3.asHash)(messageHash),
                (0, types_3.asHex)(signatureToCheck)
            ];
            const bytesData = fallbackHandler.encode('isValidSignature', bytesTuple);
            try {
                const isValidSignatureResponse = await Promise.all([
                    __classPrivateFieldGet(this, _Safe_safeProvider, "f").call({
                        from: safeAddress,
                        to: safeAddress,
                        data: data
                    }),
                    __classPrivateFieldGet(this, _Safe_safeProvider, "f").call({
                        from: safeAddress,
                        to: safeAddress,
                        data: bytesData
                    })
                ]);
                return (!!isValidSignatureResponse.length &&
                    (isValidSignatureResponse[0].slice(0, 10).toLowerCase() === __classPrivateFieldGet(this, _Safe_MAGIC_VALUE, "f") ||
                        isValidSignatureResponse[1].slice(0, 10).toLowerCase() === __classPrivateFieldGet(this, _Safe_MAGIC_VALUE_BYTES, "f")));
            }
            catch (error) {
                return false;
            }
        };
        this.getContractInfo = ({ contractAddress }) => {
            return (0, config_1.getContractInfo)(contractAddress);
        };
    }
    /**
     * Creates an instance of the Safe Core SDK.
     * @param config - Ethers Safe configuration
     * @returns The Safe Core SDK instance
     * @throws "The SDK must be initialized with a safeAddress or a predictedSafe"
     * @throws "SafeProxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     * @throws "MultiSendCallOnly contract is not deployed on the current network"
     */
    static async init(config) {
        const protocolKit = new Safe();
        await __classPrivateFieldGet(protocolKit, _Safe_instances, "m", _Safe_initializeProtocolKit).call(protocolKit, config);
        return protocolKit;
    }
    /**
     * Returns a new instance of the Safe Core SDK.
     * @param config - Connect Safe configuration
     * @throws "A safeAddress and a predictedSafe cannot be connected at the same time"
     * @throws "SafeProxy contract is not deployed on the current network"
     * @throws "MultiSend contract is not deployed on the current network"
     * @throws "MultiSendCallOnly contract is not deployed on the current network"
     */
    async connect(config) {
        const { provider, signer, safeAddress, predictedSafe, isL1SafeSingleton, contractNetworks } = config;
        const configProps = {
            provider: provider || __classPrivateFieldGet(this, _Safe_safeProvider, "f").provider,
            signer,
            isL1SafeSingleton: isL1SafeSingleton || __classPrivateFieldGet(this, _Safe_contractManager, "f").isL1SafeSingleton,
            contractNetworks: contractNetworks || __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks
        };
        // A new existing Safe is connected to the Signer
        if (safeAddress) {
            return await Safe.init({
                safeAddress,
                ...configProps
            });
        }
        // A new predicted Safe is connected to the Signer
        if (predictedSafe) {
            return await Safe.init({
                predictedSafe,
                ...configProps
            });
        }
        // The previous predicted Safe is connected to a new Signer
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")) {
            return await Safe.init({
                predictedSafe: __classPrivateFieldGet(this, _Safe_predictedSafe, "f"),
                ...configProps
            });
        }
        // The previous existing Safe is connected to a new Signer
        return await Safe.init({
            safeAddress: await this.getAddress(),
            ...configProps
        });
    }
    /**
     * Returns the initialization code to deploy a Safe account based on the predicted address.
     *
     * @returns The Safe configuration
     */
    async getInitCode() {
        if (!__classPrivateFieldGet(this, _Safe_predictedSafe, "f")) {
            throw new Error('The Safe already exists');
        }
        const chainId = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getChainId();
        return (0, utils_1.getPredictedSafeAddressInitCode)({
            safeProvider: __classPrivateFieldGet(this, _Safe_safeProvider, "f"),
            chainId,
            customContracts: __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks?.[chainId.toString()],
            ...__classPrivateFieldGet(this, _Safe_predictedSafe, "f")
        });
    }
    /**
     * Returns the predicted Safe configuration.
     * @returns {PredictedSafeProps | undefined} The predicted Safe configuration
     */
    getPredictedSafe() {
        return __classPrivateFieldGet(this, _Safe_predictedSafe, "f");
    }
    /**
     * Returns the address of the current SafeProxy contract.
     *
     * @returns The address of the SafeProxy contract
     */
    async getAddress() {
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")) {
            const safeVersion = this.getContractVersion();
            if (!(0, utils_2.hasSafeFeature)(utils_2.SAFE_FEATURES.ACCOUNT_ABSTRACTION, safeVersion)) {
                throw new Error('Account Abstraction functionality is not available for Safes with version lower than v1.3.0');
            }
            const chainId = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getChainId();
            return (0, utils_1.predictSafeAddress)({
                safeProvider: __classPrivateFieldGet(this, _Safe_safeProvider, "f"),
                chainId,
                customContracts: __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks?.[chainId.toString()],
                ...__classPrivateFieldGet(this, _Safe_predictedSafe, "f")
            });
        }
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        return __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.getAddress();
    }
    /**
     * Returns the ContractManager
     *
     * @returns The current ContractManager
     * */
    getContractManager() {
        return __classPrivateFieldGet(this, _Safe_contractManager, "f");
    }
    /**
     * Returns the current SafeProvider.
     *
     * @returns The current SafeProvider
     */
    getSafeProvider() {
        return __classPrivateFieldGet(this, _Safe_safeProvider, "f");
    }
    /**
     * Returns the address of the MultiSend contract.
     *
     * @returns The address of the MultiSend contract
     */
    getMultiSendAddress() {
        return __classPrivateFieldGet(this, _Safe_contractManager, "f").multiSendContract.getAddress();
    }
    /**
     * Returns the address of the MultiSendCallOnly contract.
     *
     * @returns The address of the MultiSendCallOnly contract
     */
    getMultiSendCallOnlyAddress() {
        return __classPrivateFieldGet(this, _Safe_contractManager, "f").multiSendCallOnlyContract.getAddress();
    }
    /**
     * Checks if the current Safe is deployed.
     *
     * @returns TRUE if the Safe contract is deployed
     */
    async isSafeDeployed() {
        const safeAddress = await this.getAddress();
        const isSafeDeployed = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").isContractDeployed(safeAddress);
        return isSafeDeployed;
    }
    /**
     * Returns the Safe Singleton contract version.
     *
     * @returns The Safe Singleton contract version
     */
    getContractVersion() {
        if (__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            return __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.safeVersion;
        }
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")?.safeDeploymentConfig?.safeVersion) {
            return __classPrivateFieldGet(this, _Safe_predictedSafe, "f").safeDeploymentConfig.safeVersion;
        }
        return config_1.DEFAULT_SAFE_VERSION;
    }
    /**
     * Returns the list of Safe owner accounts.
     *
     * @returns The list of owners
     */
    async getOwners() {
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")?.safeAccountConfig.owners) {
            return Promise.resolve(__classPrivateFieldGet(this, _Safe_predictedSafe, "f").safeAccountConfig.owners);
        }
        return __classPrivateFieldGet(this, _Safe_ownerManager, "f").getOwners();
    }
    /**
     * Returns the Safe nonce.
     *
     * @returns The Safe nonce
     */
    async getNonce() {
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            return Promise.resolve(0);
        }
        const nonce = await __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.getNonce();
        return Number(nonce);
    }
    /**
     * Returns the Safe threshold.
     *
     * @returns The Safe threshold
     */
    async getThreshold() {
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")?.safeAccountConfig.threshold) {
            return Promise.resolve(__classPrivateFieldGet(this, _Safe_predictedSafe, "f").safeAccountConfig.threshold);
        }
        return __classPrivateFieldGet(this, _Safe_ownerManager, "f").getThreshold();
    }
    /**
     * Returns the chainId of the connected network.
     *
     * @returns The chainId of the connected network
     */
    async getChainId() {
        return __classPrivateFieldGet(this, _Safe_safeProvider, "f").getChainId();
    }
    /**
     * Returns the ETH balance of the Safe.
     *
     * @returns The ETH balance of the Safe
     */
    async getBalance() {
        return __classPrivateFieldGet(this, _Safe_safeProvider, "f").getBalance(await this.getAddress());
    }
    /**
     * Returns the address of the FallbackHandler contract.
     *
     * @returns The address of the FallbackHandler contract
     */
    getFallbackHandler() {
        return __classPrivateFieldGet(this, _Safe_fallbackHandlerManager, "f").getFallbackHandler();
    }
    /**
     * Returns the enabled Safe guard or 0x address if no guards are enabled.
     *
     * @returns The address of the enabled Safe guard
     * @throws "Current version of the Safe does not support Safe transaction guards functionality"
     */
    async getGuard() {
        return __classPrivateFieldGet(this, _Safe_guardManager, "f").getGuard();
    }
    /**
     * Returns the list of addresses of all the enabled Safe modules.
     *
     * @returns The list of addresses of all the enabled Safe modules
     */
    async getModules() {
        return __classPrivateFieldGet(this, _Safe_moduleManager, "f").getModules();
    }
    /**
     * Returns the list of addresses of all the enabled Safe modules. The list will start on the next position address in relation to start.
     *
     * @param start - The address to be "offsetted" from the list, should be SENTINEL_ADDRESS otherwise.
     * @param pageSize - The size of the page. It will be the max length of the returning array. Must be greater then 0.
     * @returns The list of addresses of all the enabled Safe modules
     */
    async getModulesPaginated(start, pageSize = 10) {
        return __classPrivateFieldGet(this, _Safe_moduleManager, "f").getModulesPaginated(start, pageSize);
    }
    /**
     * Checks if a specific Safe module is enabled for the current Safe.
     *
     * @param moduleAddress - The desired module address
     * @returns TRUE if the module is enabled
     */
    async isModuleEnabled(moduleAddress) {
        return __classPrivateFieldGet(this, _Safe_moduleManager, "f").isModuleEnabled(moduleAddress);
    }
    /**
     * Checks if a specific address is an owner of the current Safe.
     *
     * @param ownerAddress - The account address
     * @returns TRUE if the account is an owner
     */
    async isOwner(ownerAddress) {
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")?.safeAccountConfig.owners) {
            return Promise.resolve(__classPrivateFieldGet(this, _Safe_predictedSafe, "f")?.safeAccountConfig.owners.some((owner) => (0, utils_2.sameString)(owner, ownerAddress)));
        }
        return __classPrivateFieldGet(this, _Safe_ownerManager, "f").isOwner(ownerAddress);
    }
    /**
     * Returns a Safe transaction ready to be signed by the owners.
     *
     * @param createTransactionProps - The createTransaction props
     * @returns The Safe transaction
     * @throws "Invalid empty array of transactions"
     */
    async createTransaction({ transactions, onlyCalls = false, options }) {
        const safeVersion = this.getContractVersion();
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f") && !(0, utils_2.hasSafeFeature)(utils_2.SAFE_FEATURES.ACCOUNT_ABSTRACTION, safeVersion)) {
            throw new Error('Account Abstraction functionality is not available for Safes with version lower than v1.3.0');
        }
        if (transactions.length === 0) {
            throw new Error('Invalid empty array of transactions');
        }
        let newTransaction;
        if (transactions.length > 1) {
            const multiSendContract = onlyCalls
                ? __classPrivateFieldGet(this, _Safe_contractManager, "f").multiSendCallOnlyContract
                : __classPrivateFieldGet(this, _Safe_contractManager, "f").multiSendContract;
            const multiSendData = (0, utils_3.encodeMultiSendData)(transactions.map(utils_3.standardizeMetaTransactionData));
            const multiSendTransaction = {
                ...options,
                to: multiSendContract.getAddress(),
                value: '0',
                data: multiSendContract.encode('multiSend', [(0, types_3.asHex)(multiSendData)]),
                operation: types_kit_1.OperationType.DelegateCall
            };
            newTransaction = multiSendTransaction;
        }
        else {
            newTransaction = { ...options, ...transactions[0] };
        }
        if (__classPrivateFieldGet(this, _Safe_predictedSafe, "f")) {
            return new SafeTransaction_1.default(await (0, utils_3.standardizeSafeTransactionData)({
                predictedSafe: __classPrivateFieldGet(this, _Safe_predictedSafe, "f"),
                provider: __classPrivateFieldGet(this, _Safe_safeProvider, "f").provider,
                tx: newTransaction,
                contractNetworks: __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks
            }));
        }
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        return new SafeTransaction_1.default(await (0, utils_3.standardizeSafeTransactionData)({
            safeContract: __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract,
            provider: __classPrivateFieldGet(this, _Safe_safeProvider, "f").provider,
            tx: newTransaction,
            contractNetworks: __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks
        }));
    }
    /**
     * Returns a Safe transaction ready to be signed by the owners that invalidates the pending Safe transaction/s with a specific nonce.
     *
     * @param nonce - The nonce of the transaction/s that are going to be rejected
     * @returns The Safe transaction that invalidates the pending Safe transaction/s
     */
    async createRejectionTransaction(nonce) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: '0x'
        };
        const options = {
            nonce,
            safeTxGas: '0'
        };
        return this.createTransaction({ transactions: [safeTransactionData], options });
    }
    /**
     * Copies a Safe transaction
     *
     * @param safeTransaction - The Safe transaction
     * @returns The new Safe transaction
     */
    async copyTransaction(safeTransaction) {
        const { to, value, data, operation, ...options } = safeTransaction.data;
        const safeTransactionData = {
            to,
            value,
            data,
            operation
        };
        const signedSafeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        safeTransaction.signatures.forEach((signature) => {
            signedSafeTransaction.addSignature(signature);
        });
        return signedSafeTransaction;
    }
    /**
     * Returns the transaction hash of a Safe transaction.
     *
     * @param safeTransaction - The Safe transaction
     * @returns The hash of the Safe transaction
     */
    async getTransactionHash(safeTransaction) {
        const safeAddress = await this.getAddress();
        const safeVersion = this.getContractVersion();
        const chainId = await this.getChainId();
        return (0, utils_2.calculateSafeTransactionHash)(safeAddress, safeTransaction.data, safeVersion, chainId);
    }
    /**
     * Signs a hash using the current signer account.
     *
     * @param hash - The hash to sign
     * @returns The Safe signature
     */
    async signHash(hash) {
        const isPasskeySigner = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").isPasskeySigner();
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (isPasskeySigner && signerAddress) {
            let signature = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").signMessage(hash);
            signature = await (0, utils_2.adjustVInSignature)(types_1.SigningMethod.ETH_SIGN, signature, hash, signerAddress);
            const safeSignature = new utils_2.EthSafeSignature(signerAddress, signature, true);
            return safeSignature;
        }
        const signature = await (0, utils_2.generateSignature)(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), hash);
        return signature;
    }
    /**
     * Returns a Safe message ready to be signed by the owners.
     *
     * @param message - The message
     * @returns The Safe message
     */
    createMessage(message) {
        return new SafeMessage_1.default(message);
    }
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
    async signMessage(message, signingMethod = types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V4, preimageSafeAddress) {
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('The protocol-kit requires a signer to use this method');
        }
        const addressIsOwner = await this.isOwner(signerAddress);
        if (!addressIsOwner) {
            throw new Error('Messages can only be signed by Safe owners');
        }
        const safeVersion = this.getContractVersion();
        if (signingMethod === types_1.SigningMethod.SAFE_SIGNATURE &&
            (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_4_1) &&
            !preimageSafeAddress) {
            throw new Error('The parent Safe account address is mandatory for contract signatures');
        }
        let signature;
        if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V4) {
            signature = await this.signTypedData(message, 'v4');
        }
        else if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V3) {
            signature = await this.signTypedData(message, 'v3');
        }
        else if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA) {
            signature = await this.signTypedData(message, undefined);
        }
        else {
            const chainId = await this.getChainId();
            if (!(0, utils_2.hasSafeFeature)(utils_2.SAFE_FEATURES.ETH_SIGN, safeVersion)) {
                throw new Error('eth_sign is only supported by Safes >= v1.1.0');
            }
            let safeMessageHash;
            if (signingMethod === types_1.SigningMethod.SAFE_SIGNATURE &&
                preimageSafeAddress &&
                (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_4_1)) {
                const messageHashData = (0, utils_2.preimageSafeMessageHash)(preimageSafeAddress, (0, utils_2.hashSafeMessage)(message.data), safeVersion, chainId);
                safeMessageHash = await this.getSafeMessageHash(messageHashData);
            }
            else {
                safeMessageHash = await this.getSafeMessageHash((0, utils_2.hashSafeMessage)(message.data));
            }
            signature = await this.signHash(safeMessageHash);
        }
        const signedSafeMessage = this.createMessage(message.data);
        message.signatures.forEach((signature) => {
            signedSafeMessage.addSignature(signature);
        });
        signedSafeMessage.addSignature(signature);
        return signedSafeMessage;
    }
    /**
     * Signs a transaction according to the EIP-712 using the current signer account.
     *
     * @param eip712Data - The Safe Transaction or message hash to be signed
     * @param methodVersion - EIP-712 version. Optional
     * @returns The Safe signature
     */
    async signTypedData(eip712Data, methodVersion) {
        const safeEIP712Args = {
            safeAddress: await this.getAddress(),
            safeVersion: this.getContractVersion(),
            chainId: await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getChainId(),
            data: eip712Data.data
        };
        return (0, utils_2.generateEIP712Signature)(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), safeEIP712Args, methodVersion);
    }
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
    async signTransaction(safeTransaction, signingMethod = types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V4, preimageSafeAddress) {
        const transaction = (0, utils_2.isSafeMultisigTransactionResponse)(safeTransaction)
            ? await this.toSafeTransactionType(safeTransaction)
            : safeTransaction;
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('The protocol-kit requires a signer to use this method');
        }
        const addressIsOwner = await this.isOwner(signerAddress);
        if (!addressIsOwner) {
            throw new Error('Transactions can only be signed by Safe owners');
        }
        const safeVersion = this.getContractVersion();
        if (signingMethod === types_1.SigningMethod.SAFE_SIGNATURE &&
            (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_3_0) &&
            !preimageSafeAddress) {
            throw new Error('The parent Safe account address is mandatory for contract signatures');
        }
        let signature;
        const isPasskeySigner = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").isPasskeySigner();
        if (isPasskeySigner) {
            const txHash = await this.getTransactionHash(transaction);
            signature = await this.signHash(txHash);
        }
        else if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V4) {
            signature = await this.signTypedData(transaction, 'v4');
        }
        else if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA_V3) {
            signature = await this.signTypedData(transaction, 'v3');
        }
        else if (signingMethod === types_1.SigningMethod.ETH_SIGN_TYPED_DATA) {
            signature = await this.signTypedData(transaction, undefined);
        }
        else {
            const safeVersion = this.getContractVersion();
            const chainId = await this.getChainId();
            if (!(0, utils_2.hasSafeFeature)(utils_2.SAFE_FEATURES.ETH_SIGN, safeVersion)) {
                throw new Error('eth_sign is only supported by Safes >= v1.1.0');
            }
            let txHash;
            // IMPORTANT: because the safe uses the old EIP-1271 interface which uses `bytes` instead of `bytes32` for the message
            // we need to use the pre-image of the transaction hash to calculate the message hash
            // https://github.com/safe-global/safe-contracts/blob/192c7dc67290940fcbc75165522bb86a37187069/test/core/Safe.Signatures.spec.ts#L229-L233
            if (signingMethod === types_1.SigningMethod.SAFE_SIGNATURE &&
                (0, satisfies_1.default)(safeVersion, EQ_OR_GT_1_3_0) &&
                preimageSafeAddress) {
                const txHashData = (0, utils_2.preimageSafeTransactionHash)(preimageSafeAddress, safeTransaction.data, safeVersion, chainId);
                txHash = await this.getSafeMessageHash(txHashData);
            }
            else {
                txHash = await this.getTransactionHash(transaction);
            }
            signature = await this.signHash(txHash);
        }
        const signedSafeTransaction = await this.copyTransaction(transaction);
        signedSafeTransaction.addSignature(signature);
        return signedSafeTransaction;
    }
    /**
     * Approves on-chain a hash using the current signer account.
     *
     * @param hash - The hash to approve
     * @param options - The Safe transaction execution options. Optional
     * @returns The Safe transaction response
     * @throws "Transaction hashes can only be approved by Safe owners"
     * @throws "Cannot specify gas and gasLimit together in transaction options"
     */
    async approveTransactionHash(hash, options) {
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('The protocol-kit requires a signer to use this method');
        }
        const addressIsOwner = await this.isOwner(signerAddress);
        if (!addressIsOwner) {
            throw new Error('Transaction hashes can only be approved by Safe owners');
        }
        return __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.approveHash(hash, {
            from: signerAddress,
            ...options
        });
    }
    /**
     * Returns a list of owners who have approved a specific Safe transaction.
     *
     * @param txHash - The Safe transaction hash
     * @returns The list of owners
     */
    async getOwnersWhoApprovedTx(txHash) {
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        const owners = await this.getOwners();
        const ownersWhoApproved = [];
        for (const owner of owners) {
            const [approved] = await __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.approvedHashes([
                (0, types_3.asHex)(owner),
                (0, types_3.asHash)(txHash)
            ]);
            if (approved > 0) {
                ownersWhoApproved.push(owner);
            }
        }
        return ownersWhoApproved;
    }
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
    async createEnableFallbackHandlerTx(fallbackHandlerAddress, options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_fallbackHandlerManager, "f").encodeEnableFallbackHandlerData(fallbackHandlerAddress)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
    /**
     * Returns the Safe transaction to disable the fallback handler.
     *
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "There is no fallback handler enabled yet"
     * @throws "Current version of the Safe does not support the fallback handler functionality"
     */
    async createDisableFallbackHandlerTx(options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_fallbackHandlerManager, "f").encodeDisableFallbackHandlerData()
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
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
    async createEnableGuardTx(guardAddress, options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_guardManager, "f").encodeEnableGuardData(guardAddress)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
    /**
     * Returns the Safe transaction to disable a Safe guard.
     *
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "There is no guard enabled yet"
     * @throws "Current version of the Safe does not support Safe transaction guards functionality"
     */
    async createDisableGuardTx(options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_guardManager, "f").encodeDisableGuardData()
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
    /**
     * Returns the Safe transaction to enable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is already enabled"
     */
    async createEnableModuleTx(moduleAddress, options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_moduleManager, "f").encodeEnableModuleData(moduleAddress)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
    /**
     * Returns the Safe transaction to disable a Safe module.
     *
     * @param moduleAddress - The desired module address
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Invalid module address provided"
     * @throws "Module provided is not enabled already"
     */
    async createDisableModuleTx(moduleAddress, options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_moduleManager, "f").encodeDisableModuleData(moduleAddress)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
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
    async createAddOwnerTx(params, options) {
        const isPasskey = (0, utils_3.isPasskeyParam)(params);
        const ownerAddress = isPasskey
            ? await (0, getPasskeyOwnerAddress_1.default)(this, params.passkey)
            : params.ownerAddress;
        const { threshold } = params;
        const addOwnerTransaction = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_ownerManager, "f").encodeAddOwnerWithThresholdData(ownerAddress, threshold)
        };
        const transactions = [addOwnerTransaction];
        // The passkey Signer is a contract compliant with EIP-1271 standards, we need to check if it has been deployed.
        if (isPasskey && !(await __classPrivateFieldGet(this, _Safe_safeProvider, "f").isContractDeployed(ownerAddress))) {
            // If it has not been deployed, we need to create a batch that includes both the Signer contract deployment and the addOwner transaction
            const passkeyDeploymentTransaction = await (0, createPasskeyDeploymentTransaction_1.default)(this, params.passkey);
            transactions.push(passkeyDeploymentTransaction);
        }
        const safeTransaction = await this.createTransaction({
            transactions,
            options
        });
        return safeTransaction;
    }
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
    async createRemoveOwnerTx(params, options) {
        const { threshold } = params;
        const isPasskey = (0, utils_3.isPasskeyParam)(params);
        const ownerAddress = isPasskey
            ? await (0, getPasskeyOwnerAddress_1.default)(this, params.passkey)
            : params.ownerAddress;
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_ownerManager, "f").encodeRemoveOwnerData(ownerAddress, threshold)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
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
    async createSwapOwnerTx(params, options) {
        const oldOwnerAddress = (0, utils_3.isOldOwnerPasskey)(params)
            ? await (0, getPasskeyOwnerAddress_1.default)(this, params.oldOwnerPasskey)
            : params.oldOwnerAddress;
        const newOwnerAddress = (0, utils_3.isNewOwnerPasskey)(params)
            ? await (0, getPasskeyOwnerAddress_1.default)(this, params.newOwnerPasskey)
            : params.newOwnerAddress;
        const swapOwnerTransaction = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_ownerManager, "f").encodeSwapOwnerData(oldOwnerAddress, newOwnerAddress)
        };
        const transactions = [swapOwnerTransaction];
        // The passkey Signer is a contract compliant with EIP-1271 standards, we need to check if it has been deployed.
        if ((0, utils_3.isNewOwnerPasskey)(params) &&
            !(await __classPrivateFieldGet(this, _Safe_safeProvider, "f").isContractDeployed(newOwnerAddress))) {
            // If it has not been deployed, we need to create a batch that includes both the Signer contract deployment and the addOwner transaction
            const passkeyDeploymentTransaction = await (0, createPasskeyDeploymentTransaction_1.default)(this, params.newOwnerPasskey);
            transactions.push(passkeyDeploymentTransaction);
        }
        const safeTransaction = await this.createTransaction({
            transactions,
            options
        });
        return safeTransaction;
    }
    /**
     * Returns the Safe transaction to change the threshold.
     *
     * @param threshold - The new threshold
     * @param options - The transaction optional properties
     * @returns The Safe transaction ready to be signed
     * @throws "Threshold needs to be greater than 0"
     * @throws "Threshold cannot exceed owner count"
     */
    async createChangeThresholdTx(threshold, options) {
        const safeTransactionData = {
            to: await this.getAddress(),
            value: '0',
            data: await __classPrivateFieldGet(this, _Safe_ownerManager, "f").encodeChangeThresholdData(threshold)
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        return safeTransaction;
    }
    /**
     * Converts a transaction from type SafeMultisigTransactionResponse to type SafeTransaction
     *
     * @param serviceTransactionResponse - The transaction to convert
     * @returns The converted transaction with type SafeTransaction
     */
    async toSafeTransactionType(serviceTransactionResponse) {
        const safeTransactionData = {
            to: serviceTransactionResponse.to,
            value: serviceTransactionResponse.value,
            data: serviceTransactionResponse.data || '0x',
            operation: serviceTransactionResponse.operation
        };
        const options = {
            safeTxGas: serviceTransactionResponse.safeTxGas.toString(),
            baseGas: serviceTransactionResponse.baseGas.toString(),
            gasPrice: serviceTransactionResponse.gasPrice,
            gasToken: serviceTransactionResponse.gasToken,
            refundReceiver: serviceTransactionResponse.refundReceiver,
            nonce: serviceTransactionResponse.nonce
        };
        const safeTransaction = await this.createTransaction({
            transactions: [safeTransactionData],
            options
        });
        serviceTransactionResponse.confirmations?.map((confirmation) => {
            const signature = new utils_2.EthSafeSignature(confirmation.owner, confirmation.signature);
            safeTransaction.addSignature(signature);
        });
        return safeTransaction;
    }
    /**
     * Checks if a Safe transaction can be executed successfully with no errors.
     *
     * @param safeTransaction - The Safe transaction to check
     * @param options - The Safe transaction execution options. Optional
     * @returns TRUE if the Safe transaction can be executed successfully with no errors
     */
    async isValidTransaction(safeTransaction, options) {
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        const transaction = (0, utils_2.isSafeMultisigTransactionResponse)(safeTransaction)
            ? await this.toSafeTransactionType(safeTransaction)
            : safeTransaction;
        const signedSafeTransaction = await this.copyTransaction(transaction);
        const txHash = await this.getTransactionHash(signedSafeTransaction);
        const ownersWhoApprovedTx = await this.getOwnersWhoApprovedTx(txHash);
        for (const owner of ownersWhoApprovedTx) {
            signedSafeTransaction.addSignature((0, utils_2.generatePreValidatedSignature)(owner));
        }
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('The protocol-kit requires a signer to use this method');
        }
        const addressIsOwner = await this.isOwner(signerAddress);
        if (addressIsOwner) {
            signedSafeTransaction.addSignature((0, utils_2.generatePreValidatedSignature)(signerAddress));
        }
        const isTxValid = await __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.isValidTransaction(signedSafeTransaction, {
            from: signerAddress,
            ...options
        });
        return isTxValid;
    }
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
    async executeTransaction(safeTransaction, options) {
        if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
            throw new Error('Safe is not deployed');
        }
        const transaction = (0, utils_2.isSafeMultisigTransactionResponse)(safeTransaction)
            ? await this.toSafeTransactionType(safeTransaction)
            : safeTransaction;
        const signedSafeTransaction = await this.copyTransaction(transaction);
        const txHash = await this.getTransactionHash(signedSafeTransaction);
        const ownersWhoApprovedTx = await this.getOwnersWhoApprovedTx(txHash);
        for (const owner of ownersWhoApprovedTx) {
            signedSafeTransaction.addSignature((0, utils_2.generatePreValidatedSignature)(owner));
        }
        const threshold = await this.getThreshold();
        const signerAddress = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getSignerAddress();
        if (!signerAddress) {
            throw new Error('The protocol-kit requires a signer to use this method');
        }
        const addressIsOwner = await this.isOwner(signerAddress);
        if (threshold > signedSafeTransaction.signatures.size && addressIsOwner) {
            signedSafeTransaction.addSignature((0, utils_2.generatePreValidatedSignature)(signerAddress));
        }
        if (threshold > signedSafeTransaction.signatures.size) {
            const signaturesMissing = threshold - signedSafeTransaction.signatures.size;
            throw new Error(`There ${signaturesMissing > 1 ? 'are' : 'is'} ${signaturesMissing} signature${signaturesMissing > 1 ? 's' : ''} missing`);
        }
        const value = BigInt(signedSafeTransaction.data.value);
        if (value !== 0n) {
            const balance = await this.getBalance();
            if (value > balance) {
                throw new Error('Not enough Ether funds');
            }
        }
        const txResponse = await __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.execTransaction(signedSafeTransaction, {
            from: signerAddress,
            ...options
        });
        return txResponse;
    }
    /**
     * Returns the Safe Transaction encoded
     *
     * @async
     * @param {SafeTransaction} safeTransaction - The Safe transaction to be encoded.
     * @returns {Promise<string>} The encoded transaction
     *
     */
    async getEncodedTransaction(safeTransaction) {
        const safeVersion = this.getContractVersion();
        const chainId = await this.getChainId();
        const customContracts = __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks?.[chainId.toString()];
        const isL1SafeSingleton = __classPrivateFieldGet(this, _Safe_contractManager, "f").isL1SafeSingleton;
        const safeSingletonContract = await (0, safeDeploymentContracts_1.getSafeContract)({
            safeProvider: __classPrivateFieldGet(this, _Safe_safeProvider, "f"),
            safeVersion,
            isL1SafeSingleton,
            customContracts
        });
        const encodedTransaction = safeSingletonContract.encode('execTransaction', [
            safeTransaction.data.to,
            safeTransaction.data.value,
            safeTransaction.data.data,
            safeTransaction.data.operation,
            safeTransaction.data.safeTxGas,
            safeTransaction.data.baseGas,
            safeTransaction.data.gasPrice,
            safeTransaction.data.gasToken,
            safeTransaction.data.refundReceiver,
            safeTransaction.encodedSignatures()
        ]);
        return encodedTransaction;
    }
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
    async wrapSafeTransactionIntoDeploymentBatch(safeTransaction, transactionOptions, customSaltNonce) {
        const isSafeDeployed = await this.isSafeDeployed();
        // if the safe is already deployed throws an error
        if (isSafeDeployed) {
            throw new Error('Safe already deployed');
        }
        // we create the deployment transaction
        const safeDeploymentTransaction = await this.createSafeDeploymentTransaction(customSaltNonce);
        // First transaction of the batch: The Safe deployment Transaction
        const safeDeploymentBatchTransaction = {
            to: safeDeploymentTransaction.to,
            value: safeDeploymentTransaction.value,
            data: safeDeploymentTransaction.data,
            operation: types_kit_1.OperationType.Call
        };
        // Second transaction of the batch: The Safe Transaction
        const safeBatchTransaction = {
            to: await this.getAddress(),
            value: '0',
            data: await this.getEncodedTransaction(safeTransaction),
            operation: types_kit_1.OperationType.Call
        };
        // transactions for the batch
        const transactions = [safeDeploymentBatchTransaction, safeBatchTransaction];
        // this is the transaction with the batch
        const safeDeploymentBatch = await this.createTransactionBatch(transactions, transactionOptions);
        return safeDeploymentBatch;
    }
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
    async createSafeDeploymentTransaction(customSaltNonce, transactionOptions) {
        if (!__classPrivateFieldGet(this, _Safe_predictedSafe, "f")) {
            throw new Error('Predict Safe should be present');
        }
        const { safeAccountConfig, safeDeploymentConfig } = __classPrivateFieldGet(this, _Safe_predictedSafe, "f");
        const safeVersion = this.getContractVersion();
        const safeProvider = __classPrivateFieldGet(this, _Safe_safeProvider, "f");
        const chainId = await safeProvider.getChainId();
        const isL1SafeSingleton = __classPrivateFieldGet(this, _Safe_contractManager, "f").isL1SafeSingleton;
        const customContracts = __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks?.[chainId.toString()];
        const safeSingletonContract = await (0, safeDeploymentContracts_1.getSafeContract)({
            safeProvider,
            safeVersion,
            isL1SafeSingleton,
            customContracts
        });
        // we use the SafeProxyFactory.sol contract, see: https://github.com/safe-global/safe-contracts/blob/main/contracts/proxies/SafeProxyFactory.sol
        const safeProxyFactoryContract = await (0, safeDeploymentContracts_1.getSafeProxyFactoryContract)({
            safeProvider,
            safeVersion,
            customContracts
        });
        // this is the call to the setup method that sets the threshold & owners of the new Safe, see: https://github.com/safe-global/safe-contracts/blob/main/contracts/Safe.sol#L95
        const initializer = await (0, utils_1.encodeSetupCallData)({
            safeProvider,
            safeContract: safeSingletonContract,
            safeAccountConfig: safeAccountConfig,
            customContracts
        });
        const saltNonce = customSaltNonce ||
            safeDeploymentConfig?.saltNonce ||
            (0, utils_1.getChainSpecificDefaultSaltNonce)(chainId);
        const safeDeployTransactionData = {
            ...transactionOptions, // optional transaction options like from, gasLimit, gasPrice...
            to: safeProxyFactoryContract.getAddress(),
            value: '0',
            // we use the createProxyWithNonce method to create the Safe in a deterministic address, see: https://github.com/safe-global/safe-contracts/blob/main/contracts/proxies/SafeProxyFactory.sol#L52
            data: safeProxyFactoryContract.encode('createProxyWithNonce', [
                (0, types_3.asHex)(safeSingletonContract.getAddress()),
                (0, types_3.asHex)(initializer), // call to the setup method to set the threshold & owners of the new Safe
                BigInt(saltNonce)
            ])
        };
        return safeDeployTransactionData;
    }
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
    async createTransactionBatch(transactions, transactionOptions) {
        // we use the MultiSend contract to create the batch, see: https://github.com/safe-global/safe-contracts/blob/main/contracts/libraries/MultiSendCallOnly.sol
        const multiSendCallOnlyContract = __classPrivateFieldGet(this, _Safe_contractManager, "f").multiSendCallOnlyContract;
        // multiSend method with the transactions encoded
        const batchData = multiSendCallOnlyContract.encode('multiSend', [
            (0, types_3.asHex)((0, utils_3.encodeMultiSendData)(transactions)) // encoded transactions
        ]);
        const transactionBatch = {
            ...transactionOptions, // optional transaction options like from, gasLimit, gasPrice...
            to: multiSendCallOnlyContract.getAddress(),
            value: '0',
            data: batchData
        };
        return transactionBatch;
    }
}
_Safe_predictedSafe = new WeakMap(), _Safe_safeProvider = new WeakMap(), _Safe_contractManager = new WeakMap(), _Safe_ownerManager = new WeakMap(), _Safe_moduleManager = new WeakMap(), _Safe_guardManager = new WeakMap(), _Safe_fallbackHandlerManager = new WeakMap(), _Safe_MAGIC_VALUE = new WeakMap(), _Safe_MAGIC_VALUE_BYTES = new WeakMap(), _Safe_instances = new WeakSet(), _Safe_initializeProtocolKit = 
/**
 * Initializes the Safe Core SDK instance.
 * @param config - Safe configuration
 * @throws "Signer must be connected to a provider"
 * @throws "SafeProxy contract is not deployed on the current network"
 * @throws "MultiSend contract is not deployed on the current network"
 * @throws "MultiSendCallOnly contract is not deployed on the current network"
 */
async function _Safe_initializeProtocolKit(config) {
    const { provider, signer, isL1SafeSingleton, contractNetworks } = config;
    __classPrivateFieldSet(this, _Safe_safeProvider, await SafeProvider_1.default.init({
        provider,
        signer,
        safeVersion: config_1.DEFAULT_SAFE_VERSION,
        contractNetworks
    }), "f");
    if ((0, types_2.isSafeConfigWithPredictedSafe)(config)) {
        __classPrivateFieldSet(this, _Safe_predictedSafe, config.predictedSafe, "f");
        __classPrivateFieldSet(this, _Safe_contractManager, await contractManager_1.default.init({
            provider,
            predictedSafe: __classPrivateFieldGet(this, _Safe_predictedSafe, "f"),
            isL1SafeSingleton,
            contractNetworks
        }, __classPrivateFieldGet(this, _Safe_safeProvider, "f")), "f");
    }
    else {
        __classPrivateFieldSet(this, _Safe_contractManager, await contractManager_1.default.init({
            provider,
            safeAddress: config.safeAddress,
            isL1SafeSingleton,
            contractNetworks
        }, __classPrivateFieldGet(this, _Safe_safeProvider, "f")), "f");
    }
    const safeVersion = this.getContractVersion();
    __classPrivateFieldSet(this, _Safe_safeProvider, await SafeProvider_1.default.init({
        provider,
        signer,
        safeVersion,
        contractNetworks
    }), "f");
    __classPrivateFieldSet(this, _Safe_ownerManager, new ownerManager_1.default(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract), "f");
    __classPrivateFieldSet(this, _Safe_moduleManager, new moduleManager_1.default(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract), "f");
    __classPrivateFieldSet(this, _Safe_guardManager, new guardManager_1.default(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract), "f");
    __classPrivateFieldSet(this, _Safe_fallbackHandlerManager, new fallbackHandlerManager_1.default(__classPrivateFieldGet(this, _Safe_safeProvider, "f"), __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract), "f");
    const isPasskeySigner = signer && typeof signer !== 'string';
    if (isPasskeySigner) {
        const safeAddress = await this.getAddress();
        const owners = await this.getOwners();
        __classPrivateFieldSet(this, _Safe_safeProvider, await SafeProvider_1.default.init({
            provider,
            signer,
            safeVersion,
            contractNetworks,
            safeAddress,
            owners
        }), "f");
    }
}, _Safe_getFallbackHandlerContract = 
/**
 * Get the fallback handler contract
 *
 * @returns The fallback Handler contract
 */
async function _Safe_getFallbackHandlerContract() {
    if (!__classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract) {
        throw new Error('Safe is not deployed');
    }
    const safeVersion = __classPrivateFieldGet(this, _Safe_contractManager, "f").safeContract.safeVersion ?? config_1.DEFAULT_SAFE_VERSION;
    const chainId = await __classPrivateFieldGet(this, _Safe_safeProvider, "f").getChainId();
    const compatibilityFallbackHandlerContract = await (0, safeDeploymentContracts_1.getCompatibilityFallbackHandlerContract)({
        safeProvider: __classPrivateFieldGet(this, _Safe_safeProvider, "f"),
        safeVersion,
        customContracts: __classPrivateFieldGet(this, _Safe_contractManager, "f").contractNetworks?.[chainId.toString()]
    });
    return compatibilityFallbackHandlerContract;
};
exports.default = Safe;
//# sourceMappingURL=Safe.js.map