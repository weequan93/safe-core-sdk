import SafeProxyFactoryBaseContract, { CreateProxyProps } from '../../../contracts/SafeProxyFactory/SafeProxyFactoryBaseContract';
import SafeProvider from '../../../SafeProvider';
import { DeploymentType } from '../../../types';
import { SafeProxyFactoryContract_v1_0_0_Abi, SafeProxyFactoryContract_v1_0_0_Contract, SafeProxyFactoryContract_v1_0_0_Function } from '@safe-global/types-kit';
/**
 * SafeProxyFactoryContract_v1_0_0  is the implementation specific to the Safe Proxy Factory contract version 1.0.0.
 *
 * This class specializes in handling interactions with the Safe Proxy Factory contract version 1.0.0 using Ethers.js v6.
 *
 * @extends SafeProxyFactoryBaseContract<SafeProxyFactoryContract_v1_0_0_Abi> - Inherits from SafeProxyFactoryBaseContract with ABI specific to Safe Proxy Factory contract version 1.0.0.
 * @implements SafeProxyFactoryContract_v1_0_0_Contract - Implements the interface specific to Safe Proxy Factory contract version 1.0.0.
 */
declare class SafeProxyFactoryContract_v1_0_0 extends SafeProxyFactoryBaseContract<SafeProxyFactoryContract_v1_0_0_Abi> implements SafeProxyFactoryContract_v1_0_0_Contract {
    /**
     * Constructs an instance of SafeProxyFactoryContract_v1_0_0
     *
     * @param chainId - The chain ID where the contract resides.
     * @param safeProvider - An instance of SafeProvider.
     * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
     * @param customContractAbi - Optional custom ABI for the contract. If not provided, the default ABI for version 1.0.0 is used.
     * @param deploymentType - Optional deployment type for the contract. If not provided, the first deployment retrieved from the safe-deployments array will be used.
     */
    constructor(chainId: bigint, safeProvider: SafeProvider, customContractAddress?: string, customContractAbi?: SafeProxyFactoryContract_v1_0_0_Abi, deploymentType?: DeploymentType);
    /**
     * Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.
     * @returns Array[creationCode]
     */
    proxyCreationCode: SafeProxyFactoryContract_v1_0_0_Function<'proxyCreationCode'>;
    /**
     * Allows to retrieve the runtime code of a deployed Proxy. This can be used to check that the expected Proxy was deployed.
     * @returns Array[runtimeCode]
     */
    proxyRuntimeCode: SafeProxyFactoryContract_v1_0_0_Function<'proxyRuntimeCode'>;
    /**
     * Allows to create new proxy contact and execute a message call to the new proxy within one transaction.
     * @param args - Array[masterCopy, data]
     * @returns Array[proxyAddress]
     */
    createProxy: SafeProxyFactoryContract_v1_0_0_Function<'createProxy'>;
    /**
     * Allows to create new proxy contract and execute a message call to the new proxy within one transaction.
     * @param args - Array[masterCopy, initializer, saltNonce]
     * @returns Array[proxyAddress]
     */
    createProxyWithNonce: SafeProxyFactoryContract_v1_0_0_Function<'createProxyWithNonce'>;
    /**
     * Allows to create new proxy contract and execute a message call to the new proxy within one transaction.
     * @param {CreateProxyProps} props - Properties for the new proxy contract.
     * @returns The address of the new proxy contract.
     */
    createProxyWithOptions({ safeSingletonAddress, initializer, saltNonce, options, callback }: CreateProxyProps): Promise<string>;
}
export default SafeProxyFactoryContract_v1_0_0;
