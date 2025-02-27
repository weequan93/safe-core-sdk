import { AddOwnerTxParams, AddPasskeyOwnerTxParams, PasskeyArgType, RemoveOwnerTxParams, RemovePasskeyOwnerTxParams, SafeProviderTransaction, StandardizeSafeTransactionDataProps, SwapOwnerTxParams, ExternalClient } from '../../types';
import { MetaTransactionData, SafeMultisigTransactionResponse, SafeTransaction, SafeTransactionData, SafeTransactionDataPartial, TransactionOptions } from '@safe-global/types-kit';
import { Hash, EstimateGasParameters, TransactionRequest, UnionOmit } from 'viem';
import { WalletLegacyTransactionOptions, WalletTransactionOptions } from './types';
export declare function standardizeMetaTransactionData(tx: SafeTransactionDataPartial): MetaTransactionData;
export declare function waitForTransactionReceipt(client: ExternalClient, hash: Hash): Promise<import("viem").TransactionReceipt>;
export declare function standardizeSafeTransactionData({ safeContract, predictedSafe, provider, tx, contractNetworks }: StandardizeSafeTransactionDataProps): Promise<SafeTransactionData>;
export declare function encodeMultiSendData(txs: MetaTransactionData[]): string;
export declare function decodeMultiSendData(encodedData: string): MetaTransactionData[];
export declare function isSafeMultisigTransactionResponse(safeTransaction: SafeTransaction | SafeMultisigTransactionResponse): safeTransaction is SafeMultisigTransactionResponse;
type PasskeyParam = {
    passkey: PasskeyArgType;
};
export declare function isPasskeyParam(params: AddOwnerTxParams | AddPasskeyOwnerTxParams | RemoveOwnerTxParams | RemovePasskeyOwnerTxParams): params is PasskeyParam;
export declare function isOldOwnerPasskey(params: SwapOwnerTxParams): params is SwapOwnerTxParams & {
    oldOwnerPasskey: PasskeyArgType;
};
export declare function isNewOwnerPasskey(params: SwapOwnerTxParams): params is SwapOwnerTxParams & {
    newOwnerPasskey: PasskeyArgType;
};
export declare function toEstimateGasParameters(tx: SafeProviderTransaction): EstimateGasParameters;
export declare function toCallGasParameters(tx: SafeProviderTransaction): UnionOmit<TransactionRequest, 'from'>;
export declare function convertTransactionOptions(options?: TransactionOptions): Partial<WalletLegacyTransactionOptions | WalletTransactionOptions>;
export declare function isLegacyTransaction(options?: TransactionOptions): boolean;
export declare function createLegacyTxOptions(options?: TransactionOptions): Partial<WalletLegacyTransactionOptions>;
export declare function createTxOptions(options?: TransactionOptions): Partial<WalletTransactionOptions>;
export {};
