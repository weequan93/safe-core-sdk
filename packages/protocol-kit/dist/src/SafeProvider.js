"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SafeProvider_instances, _SafeProvider_chain, _SafeProvider_externalProvider, _SafeProvider_getChain;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const utils_2 = require("./contracts/utils");
const safeDeploymentContracts_1 = require("./contracts/safeDeploymentContracts");
const config_1 = require("./contracts/config");
const types_1 = require("./utils/types");
const block_1 = require("./utils/block");
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const actions_1 = require("viem/actions");
const provider_1 = require("./utils/provider");
class SafeProvider {
    constructor({ provider, signer }) {
        _SafeProvider_instances.add(this);
        _SafeProvider_chain.set(this, void 0);
        _SafeProvider_externalProvider.set(this, void 0);
        __classPrivateFieldSet(this, _SafeProvider_externalProvider, (0, viem_1.createPublicClient)({
            transport: (0, provider_1.isEip1193Provider)(provider)
                ? (0, viem_1.custom)(provider)
                : (0, viem_1.http)(provider)
        }), "f");
        this.provider = provider;
        this.signer = signer;
        __classPrivateFieldSet(this, _SafeProvider_chain, undefined, "f");
    }
    getExternalProvider() {
        return __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f");
    }
    static async init({ provider, signer, safeVersion = config_1.DEFAULT_SAFE_VERSION, contractNetworks, safeAddress, owners }) {
        const isPasskeySigner = signer && typeof signer !== 'string';
        if (isPasskeySigner) {
            if (!(0, utils_1.hasSafeFeature)(utils_1.SAFE_FEATURES.PASSKEY_SIGNER, safeVersion)) {
                throw new Error('Current version of the Safe does not support the Passkey signer functionality');
            }
            const safeProvider = new SafeProvider({
                provider
            });
            const chainId = await safeProvider.getChainId();
            const customContracts = contractNetworks?.[chainId.toString()];
            let passkeySigner;
            if (!(0, provider_1.isSignerPasskeyClient)(signer)) {
                // signer is type PasskeyArgType {rawId, coordinates, customVerifierAddress? }
                const safeWebAuthnSignerFactoryContract = await (0, safeDeploymentContracts_1.getSafeWebAuthnSignerFactoryContract)({
                    safeProvider,
                    safeVersion,
                    customContracts
                });
                const safeWebAuthnSharedSignerContract = await (0, safeDeploymentContracts_1.getSafeWebAuthnSharedSignerContract)({
                    safeProvider,
                    safeVersion,
                    customContracts
                });
                passkeySigner = await (0, utils_1.createPasskeyClient)(signer, safeWebAuthnSignerFactoryContract, safeWebAuthnSharedSignerContract, safeProvider.getExternalProvider(), safeAddress || '', owners || [], chainId.toString());
            }
            else {
                // signer was already initialized and we pass a PasskeyClient instance (reconnecting)
                passkeySigner = signer;
            }
            return new SafeProvider({
                provider,
                signer: passkeySigner
            });
        }
        else {
            return new SafeProvider({
                provider,
                signer
            });
        }
    }
    async getExternalSigner() {
        const { transport, chain = await __classPrivateFieldGet(this, _SafeProvider_instances, "m", _SafeProvider_getChain).call(this) } = this.getExternalProvider();
        if ((0, provider_1.isSignerPasskeyClient)(this.signer)) {
            return this.signer;
        }
        if ((0, provider_1.isPrivateKey)(this.signer)) {
            // This is a client with a local account, the account needs to be of type Account as Viem consider strings as 'json-rpc' (on parseAccount)
            const account = (0, accounts_1.privateKeyToAccount)((0, types_1.asHex)(this.signer));
            return (0, viem_1.createWalletClient)({
                account,
                chain,
                transport: (0, viem_1.custom)(transport)
            });
        }
        // If we have a signer and its not a PK, it might be a delegate on the rpc levels and this should work with eth_requestAcc
        if (this.signer && typeof this.signer === 'string') {
            return (0, viem_1.createWalletClient)({
                account: this.signer,
                chain,
                transport: (0, viem_1.custom)(transport)
            });
        }
        try {
            // This behavior is a reproduction of JsonRpcApiProvider#getSigner (which is super of BrowserProvider).
            // it dispatches and eth_accounts and picks the index 0. https://github.com/ethers-io/ethers.js/blob/a4b1d1f43fca14f2e826e3c60e0d45f5b6ef3ec4/src.ts/providers/provider-jsonrpc.ts#L1119C24-L1119C37
            const wallet = (0, viem_1.createWalletClient)({
                chain,
                transport: (0, viem_1.custom)(transport)
            });
            const [address] = await wallet.getAddresses();
            if (address) {
                const client = (0, viem_1.createClient)({
                    account: address,
                    transport: (0, viem_1.custom)(transport),
                    chain: wallet.chain,
                    rpcSchema: (0, viem_1.rpcSchema)()
                })
                    .extend(viem_1.walletActions)
                    .extend(viem_1.publicActions);
                return client;
            }
        }
        catch { }
        return undefined;
    }
    async isPasskeySigner() {
        return (0, provider_1.isSignerPasskeyClient)(this.signer);
    }
    isAddress(address) {
        return (0, viem_1.isAddress)(address);
    }
    async getEip3770Address(fullAddress) {
        const chainId = await this.getChainId();
        return (0, utils_1.validateEip3770Address)(fullAddress, chainId);
    }
    async getBalance(address, blockTag) {
        return (0, actions_1.getBalance)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            address,
            ...(0, block_1.asBlockId)(blockTag)
        });
    }
    async getNonce(address, blockTag) {
        return (0, actions_1.getTransactionCount)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            address,
            ...(0, block_1.asBlockId)(blockTag)
        });
    }
    async getChainId() {
        const res = (await __classPrivateFieldGet(this, _SafeProvider_instances, "m", _SafeProvider_getChain).call(this)).id;
        return BigInt(res);
    }
    getChecksummedAddress(address) {
        return (0, viem_1.getAddress)(address);
    }
    async getContractCode(address, blockTag) {
        const res = await (0, actions_1.getCode)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            address,
            ...(0, block_1.asBlockId)(blockTag)
        });
        return res ?? '0x';
    }
    async isContractDeployed(address, blockTag) {
        const contractCode = await (0, actions_1.getCode)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            address,
            ...(0, block_1.asBlockId)(blockTag)
        });
        // https://github.com/wevm/viem/blob/963877cd43083260a4399d6f0bbf142ccede53b4/src/actions/public/getCode.ts#L71
        return !!contractCode;
    }
    async getStorageAt(address, position) {
        const content = await (0, actions_1.getStorageAt)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            address,
            slot: (0, types_1.asHex)(position)
        });
        const decodedContent = this.decodeParameters('address', (0, types_1.asHex)(content));
        return decodedContent[0];
    }
    async getTransaction(transactionHash) {
        return (0, actions_1.getTransaction)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            hash: (0, types_1.asHash)(transactionHash)
        });
    }
    async getSignerAddress() {
        const externalSigner = await this.getExternalSigner();
        return externalSigner ? (0, viem_1.getAddress)(externalSigner.account.address) : undefined;
    }
    async signMessage(message) {
        const signer = await this.getExternalSigner();
        const account = await this.getSignerAddress();
        if (!signer || !account) {
            throw new Error('SafeProvider must be initialized with a signer to use this method');
        }
        // The address on the `WalletClient` is the one we are passing so we let Viem make assertions about that account
        // For Viem, in this context a typeof account === 'string' to signMessage is assumed to be a json-rpc account (returned by parseAccount function)
        if ((0, utils_1.sameString)(signer.account.address, account)) {
            return await signer?.signMessage({
                message: { raw: (0, viem_1.toBytes)(message) }
            });
        }
        else {
            return await signer?.signMessage({
                account: account,
                message: { raw: (0, viem_1.toBytes)(message) }
            });
        }
    }
    async signTypedData(safeEIP712Args) {
        const signer = await this.getExternalSigner();
        if (!signer) {
            throw new Error('SafeProvider must be initialized with a signer to use this method');
        }
        if ((0, utils_2.isTypedDataSigner)(signer)) {
            const typedData = (0, utils_1.generateTypedData)(safeEIP712Args);
            const { chainId, verifyingContract } = typedData.domain;
            const chain = chainId ? Number(chainId) : undefined; // ensure empty string becomes undefined
            const domain = { verifyingContract: verifyingContract, chainId: chain };
            const signature = await signer.signTypedData({
                domain,
                types: typedData.primaryType === 'SafeMessage'
                    ? { SafeMessage: typedData.types.SafeMessage }
                    : { SafeTx: typedData.types.SafeTx },
                primaryType: typedData.primaryType,
                message: typedData.message
            });
            return signature;
        }
        throw new Error('The current signer does not implement EIP-712 to sign typed data');
    }
    async estimateGas(transaction) {
        const converted = (0, utils_1.toEstimateGasParameters)(transaction);
        return (await (0, actions_1.estimateGas)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), converted)).toString();
    }
    async call(transaction, blockTag) {
        const converted = (0, utils_1.toCallGasParameters)(transaction);
        const { data } = await (0, actions_1.call)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), {
            ...converted,
            ...(0, block_1.asBlockId)(blockTag)
        });
        return data ?? '0x';
    }
    async readContract(args) {
        return (0, actions_1.readContract)(__classPrivateFieldGet(this, _SafeProvider_externalProvider, "f"), args);
    }
    // TODO: fix anys
    encodeParameters(types, values) {
        return (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)(types), values);
    }
    decodeParameters(types, values) {
        return (0, viem_1.decodeAbiParameters)((0, viem_1.parseAbiParameters)(types), (0, types_1.asHex)(values));
    }
}
_SafeProvider_chain = new WeakMap(), _SafeProvider_externalProvider = new WeakMap(), _SafeProvider_instances = new WeakSet(), _SafeProvider_getChain = async function _SafeProvider_getChain() {
    if (__classPrivateFieldGet(this, _SafeProvider_chain, "f"))
        return __classPrivateFieldGet(this, _SafeProvider_chain, "f");
    const chain = (0, types_1.getChainById)(BigInt(await __classPrivateFieldGet(this, _SafeProvider_externalProvider, "f").getChainId()));
    if (!chain)
        throw new Error('Invalid chainId');
    __classPrivateFieldSet(this, _SafeProvider_chain, chain, "f");
    return __classPrivateFieldGet(this, _SafeProvider_chain, "f");
};
exports.default = SafeProvider;
//# sourceMappingURL=SafeProvider.js.map