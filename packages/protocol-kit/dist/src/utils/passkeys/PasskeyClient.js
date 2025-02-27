"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPasskeyClient = exports.PASSKEY_CLIENT_NAME = exports.PASSKEY_CLIENT_KEY = void 0;
const viem_1 = require("viem");
const extractPasskeyData_1 = require("./extractPasskeyData");
const types_1 = require("../types");
const isSharedSigner_1 = __importDefault(require("./isSharedSigner"));
exports.PASSKEY_CLIENT_KEY = 'passkeyWallet';
exports.PASSKEY_CLIENT_NAME = 'Passkey Wallet Client';
const sign = async (passkeyRawId, data) => {
    const assertion = (await navigator.credentials.get({
        publicKey: {
            challenge: data,
            allowCredentials: [{ type: 'public-key', id: passkeyRawId }],
            userVerification: 'required'
        }
    }));
    if (!assertion?.response?.authenticatorData) {
        throw new Error('Failed to sign data with passkey Signer');
    }
    const { authenticatorData, signature, clientDataJSON } = assertion.response;
    return (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)('bytes, bytes, uint256[2]'), [
        (0, viem_1.toHex)(new Uint8Array(authenticatorData)),
        extractClientDataFields(clientDataJSON),
        extractSignature(signature)
    ]);
};
const signTransaction = () => {
    throw new Error('Passkey Signers cannot sign transactions, they can only sign data.');
};
const signTypedData = () => {
    throw new Error('Passkey Signers cannot sign signTypedData, they can only sign data.');
};
const createPasskeyClient = async (passkey, safeWebAuthnSignerFactoryContract, safeWebAuthnSharedSignerContract, provider, safeAddress, owners, chainId) => {
    const { rawId, coordinates, customVerifierAddress } = passkey;
    const passkeyRawId = (0, viem_1.hexToBytes)((0, types_1.asHex)(rawId));
    const verifierAddress = customVerifierAddress || (0, extractPasskeyData_1.getDefaultFCLP256VerifierAddress)(chainId);
    const isPasskeySharedSigner = await (0, isSharedSigner_1.default)(passkey, safeWebAuthnSharedSignerContract, safeAddress, owners, chainId);
    let signerAddress;
    if (isPasskeySharedSigner) {
        signerAddress = safeWebAuthnSharedSignerContract.getAddress();
    }
    else {
        ;
        [signerAddress] = await safeWebAuthnSignerFactoryContract.getSigner([
            BigInt(coordinates.x),
            BigInt(coordinates.y),
            (0, viem_1.fromHex)((0, types_1.asHex)(verifierAddress), 'bigint')
        ]);
    }
    return (0, viem_1.createClient)({
        account: signerAddress,
        name: exports.PASSKEY_CLIENT_NAME,
        key: exports.PASSKEY_CLIENT_KEY,
        transport: (0, viem_1.custom)(provider.transport)
    })
        .extend(viem_1.walletActions)
        .extend(() => ({
        signMessage({ message }) {
            if (typeof message === 'string') {
                return sign(passkeyRawId, (0, viem_1.toBytes)(message));
            }
            return sign(passkeyRawId, (0, viem_1.isHex)(message.raw) ? (0, viem_1.toBytes)(message.raw) : message.raw);
        },
        signTransaction,
        signTypedData,
        encodeConfigure() {
            return (0, viem_1.encodeFunctionData)({
                abi: (0, viem_1.parseAbi)(['function configure((uint256 x, uint256 y, uint176 verifiers) signer)']),
                functionName: 'configure',
                args: [
                    {
                        x: BigInt(passkey.coordinates.x),
                        y: BigInt(passkey.coordinates.y),
                        verifiers: (0, viem_1.fromHex)((0, types_1.asHex)(verifierAddress), 'bigint')
                    }
                ]
            });
        },
        encodeCreateSigner() {
            return (0, types_1.asHex)(safeWebAuthnSignerFactoryContract.encode('createSigner', [
                BigInt(coordinates.x),
                BigInt(coordinates.y),
                BigInt(verifierAddress)
            ]));
        },
        createDeployTxRequest() {
            const passkeySignerDeploymentTransaction = {
                to: safeWebAuthnSignerFactoryContract.getAddress(),
                value: '0',
                data: this.encodeCreateSigner()
            };
            return passkeySignerDeploymentTransaction;
        }
    }));
};
exports.createPasskeyClient = createPasskeyClient;
/**
 * Compute the additional client data JSON fields. This is the fields other than `type` and
 * `challenge` (including `origin` and any other additional client data fields that may be
 * added by the authenticator).
 *
 * See <https://w3c.github.io/webauthn/#clientdatajson-serialization>
 *
 * @param {ArrayBuffer} clientDataJSON - The client data JSON.
 * @returns {Hex} A hex string of the additional fields from the client data JSON.
 * @throws {Error} Throws an error if the client data JSON does not contain the expected 'challenge' field pattern.
 */
function extractClientDataFields(clientDataJSON) {
    const decodedClientDataJSON = new TextDecoder('utf-8').decode(clientDataJSON);
    const match = decodedClientDataJSON.match(/^\{"type":"webauthn.get","challenge":"[A-Za-z0-9\-_]{43}",(.*)\}$/);
    if (!match) {
        throw new Error('challenge not found in client data JSON');
    }
    const [, fields] = match;
    return (0, viem_1.toHex)((0, viem_1.stringToBytes)(fields));
}
/**
 * Extracts the numeric values r and s from a DER-encoded ECDSA signature.
 * This function decodes the signature based on a specific format and validates the encoding at each step.
 *
 * @param {ArrayBuffer} signature - The DER-encoded signature to be decoded.
 * @returns {[bigint, bigint]} A tuple containing two BigInt values, r and s, which are the numeric values extracted from the signature.
 * @throws {Error} Throws an error if the signature encoding is invalid or does not meet expected conditions.
 */
function extractSignature(signature) {
    const check = (x) => {
        if (!x) {
            throw new Error('invalid signature encoding');
        }
    };
    // Decode the DER signature. Note that we assume that all lengths fit into 8-bit integers,
    // which is true for the kinds of signatures we are decoding but generally false. I.e. this
    // code should not be used in any serious application.
    const view = new DataView(signature);
    // check that the sequence header is valid
    check(view.getUint8(0) === 0x30);
    check(view.getUint8(1) === view.byteLength - 2);
    // read r and s
    const readInt = (offset) => {
        check(view.getUint8(offset) === 0x02);
        const len = view.getUint8(offset + 1);
        const start = offset + 2;
        const end = start + len;
        const n = (0, viem_1.fromBytes)(new Uint8Array(view.buffer.slice(start, end)), 'bigint');
        check(n < viem_1.maxUint256);
        return [n, end];
    };
    const [r, sOffset] = readInt(2);
    const [s] = readInt(sOffset);
    return [r, s];
}
//# sourceMappingURL=PasskeyClient.js.map