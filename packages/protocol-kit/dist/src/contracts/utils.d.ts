import { Hash, Hex, Client, WalletClient } from 'viem';
import { DeploymentType } from '../types';
import { SafeProxyFactoryContractType, SafeVersion, TransactionOptions, TransactionResult } from '@safe-global/types-kit';
import { ContractNetworkConfig, ExternalClient, SafeAccountConfig, SafeContractImplementationType, SafeDeploymentConfig } from '../types';
import SafeProvider from '../SafeProvider';
export declare const PREDETERMINED_SALT_NONCE = "0xb1073742015cbcf5a3a4d9d1ae33ecf619439710b89475f92e2abd2117e90f90";
export interface PredictSafeAddressProps {
    safeProvider: SafeProvider;
    chainId: bigint;
    safeAccountConfig: SafeAccountConfig;
    safeDeploymentConfig?: SafeDeploymentConfig;
    isL1SafeSingleton?: boolean;
    customContracts?: ContractNetworkConfig;
}
export interface encodeSetupCallDataProps {
    safeProvider: SafeProvider;
    safeAccountConfig: SafeAccountConfig;
    safeContract: SafeContractImplementationType;
    customContracts?: ContractNetworkConfig;
    customSafeVersion?: SafeVersion;
    deploymentType?: DeploymentType;
}
export declare function encodeCreateProxyWithNonce(safeProxyFactoryContract: SafeProxyFactoryContractType, safeSingletonAddress: string, initializer: string, salt?: string): string;
export declare function encodeSetupCallData({ safeProvider, safeAccountConfig, safeContract, customContracts, customSafeVersion, deploymentType }: encodeSetupCallDataProps): Promise<string>;
/**
 * Retrieves the version of the Safe contract associated with the given Safe address from the blockchain.
 *
 * @param {SafeProvider} safeProvider The provider to use when reading the contract.
 * @param {string} safeAddress The address of the Safe contract for which to retrieve the version.
 *
 * @returns {Promise<SafeVersion>} A promise resolving to the version of the Safe contract.
 * @throws when fetching an address which doesn't have a Safe deployed in it.
 */
export declare function getSafeContractVersion(safeProvider: SafeProvider, safeAddress: string): Promise<SafeVersion>;
/**
 * Provides a chain-specific default salt nonce for generating unique addresses
 * for the same Safe configuration across different chains.
 *
 * @param {bigint} chainId - The chain ID associated with the chain.
 * @returns {string} The chain-specific salt nonce in hexadecimal format.
 */
export declare function getChainSpecificDefaultSaltNonce(chainId: bigint): string;
export declare function getPredictedSafeAddressInitCode({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig, isL1SafeSingleton, customContracts }: PredictSafeAddressProps): Promise<string>;
export declare function predictSafeAddress({ safeProvider, chainId, safeAccountConfig, safeDeploymentConfig, isL1SafeSingleton, customContracts }: PredictSafeAddressProps): Promise<string>;
export declare const validateSafeAccountConfig: ({ owners, threshold }: SafeAccountConfig) => void;
export declare const validateSafeDeploymentConfig: ({ saltNonce }: SafeDeploymentConfig) => void;
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
export declare function zkSyncEraCreate2Address(from: string, safeVersion: SafeVersion, salt: Hex, input: Hex): string;
export declare function toTxResult(runner: ExternalClient, hash: Hash, options?: TransactionOptions): TransactionResult;
export declare function isTypedDataSigner(signer: any): signer is Client;
/**
 * Check if the signerOrProvider is compatible with `Signer`
 * @param signerOrProvider - Signer or provider
 * @returns true if the parameter is compatible with `Signer`
 */
export declare function isSignerCompatible(signerOrProvider: Client | WalletClient): boolean;
