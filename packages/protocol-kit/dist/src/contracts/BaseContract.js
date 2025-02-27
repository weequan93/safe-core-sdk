"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseContract_instances, _BaseContract_resolveAddress;
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const config_1 = require("../contracts/config");
const types_1 = require("../utils/types");
const utils_1 = require("../utils");
/**
 * Abstract class BaseContract
 * It is designed to be instantiated for different contracts.
 *
 * This abstract class sets up the Ethers v6 Contract object that interacts with the smart contract.
 *
 * Subclasses of BaseContract are expected to represent specific contracts.
 *
 * @template ContractAbiType - The ABI type specific to the version of the contract, extending InterfaceAbi from Ethers.
 *
 * Example subclasses:
 * - SafeBaseContract<SafeContractAbiType> extends BaseContract<SafeContractAbiType>
 * - CreateCallBaseContract<CreateCallContractAbiType> extends BaseContract<CreateCallContractAbiType>
 * - SafeProxyFactoryBaseContract<SafeProxyFactoryContractAbiType> extends BaseContract<SafeProxyFactoryContractAbiType>
 */
class BaseContract {
    /**
     * @constructor
     * Constructs an instance of BaseContract.
     *
     * @param contractName - The contract name.
     * @param chainId - The chain ID of the contract.
     * @param safeProvider - An instance of SafeProvider.
     * @param defaultAbi - The default ABI for the contract. It should be compatible with the specific version of the contract.
     * @param safeVersion - The version of the Safe contract.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the ABI is derived from the Safe deployments or the defaultAbi is used.
     * @param deploymentType - Optional deployment type for the contract. If not provided, the first deployment retrieved from the safe-deployments array will be used.
     */
    constructor(contractName, chainId, safeProvider, defaultAbi, safeVersion, customContractAddress, customContractAbi, deploymentType) {
        _BaseContract_instances.add(this);
        this.getAddress = () => {
            return this.contractAddress;
        };
        this.encode = (functionToEncode, args) => {
            const abi = this.contractAbi;
            const functionName = functionToEncode;
            const params = args;
            return (0, viem_1.encodeFunctionData)({
                abi,
                functionName,
                args: params
            });
        };
        this.estimateGas = async (functionToEstimate, args, options = {}) => {
            const contractOptions = this.convertOptions(options);
            const abi = this.contractAbi;
            const params = args;
            return (0, actions_1.estimateContractGas)(this.runner, {
                abi,
                functionName: functionToEstimate,
                address: this.getAddress(),
                args: params,
                ...contractOptions
            });
        };
        console.log("constructor", safeVersion, chainId, contractName);
        const deployment = (0, config_1.getContractDeployment)(safeVersion, chainId, contractName);
        console.log("deployment", deployment);
        const resolvedAddress = customContractAddress ??
            __classPrivateFieldGet(this, _BaseContract_instances, "m", _BaseContract_resolveAddress).call(this, deployment?.networkAddresses[chainId.toString()], deployment, deploymentType);
        console.log("deploymentType", deploymentType);
        if (!resolvedAddress) {
            throw new Error(`Invalid ${contractName.replace('Version', '')} contract address`);
        }
        this.chainId = chainId;
        this.contractName = contractName;
        this.safeVersion = safeVersion;
        this.contractAddress = resolvedAddress;
        this.contractAbi =
            customContractAbi ||
                deployment?.abi || // this cast is required because abi is set as any[] in safe-deployments
                defaultAbi; // if no customAbi and no abi is present in the safe-deployments we use our hardcoded abi
        this.runner = safeProvider.getExternalProvider();
        this.safeProvider = safeProvider;
    }
    async init() {
        this.wallet = await this.safeProvider.getExternalSigner();
    }
    async getTransactionReceipt(hash) {
        return (0, actions_1.getTransactionReceipt)(this.runner, { hash });
    }
    /**
     * Converts a type of TransactionOptions to a viem transaction type. The viem transaction type creates a clear distinction between the multiple transaction objects (e.g., post-London hard fork) and doesn't allow a union of fields.
     * See: https://github.com/wevm/viem/blob/viem%402.18.0/src/types/fee.ts and https://github.com/wevm/viem/blob/603227e2588366914fb79a902d23fd9afc353cc6/src/types/transaction.ts#L200
     *
     * @param options - Transaction options as expected throughout safe sdk and propagated on the results.
     *
     * @returns Options object compatible with Viem
     */
    convertOptions(options) {
        const chain = this.getChain();
        if (!chain)
            throw new Error('Invalid chainId');
        const account = this.getWallet().account;
        if (!account)
            throw new Error('Invalid signer');
        const txOptions = (0, utils_1.convertTransactionOptions)(options);
        return { chain, ...txOptions, account }; // Needs to be in this order to override the `account` if necessary
    }
    getChain() {
        return (0, types_1.getChainById)(this.chainId);
    }
    getWallet() {
        if (!this.wallet)
            throw new Error('A signer must be set');
        return this.wallet;
    }
    async write(functionName, args, options) {
        const converted = this.convertOptions(options);
        return await this.getWallet().writeContract({
            address: this.contractAddress,
            abi: this.contractAbi,
            functionName,
            args,
            ...converted
        });
    }
    async read(functionName, args) {
        return await this.runner.readContract({
            functionName,
            abi: this.contractAbi,
            address: this.contractAddress,
            args
        });
    }
}
_BaseContract_instances = new WeakSet(), _BaseContract_resolveAddress = function _BaseContract_resolveAddress(networkAddresses, deployment, deploymentType) {
    if (!networkAddresses) {
        return undefined;
    }
    if (typeof networkAddresses === 'string') {
        return networkAddresses;
    }
    if (deploymentType) {
        const customDeploymentTypeAddress = deployment.deployments[deploymentType]?.address;
        return (networkAddresses.find((address) => address === customDeploymentTypeAddress) ??
            networkAddresses[0]);
    }
    return networkAddresses[0];
};
exports.default = BaseContract;
//# sourceMappingURL=BaseContract.js.map