"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashTypedData = hashTypedData;
exports.encodeTypedData = encodeTypedData;
const viem_1 = require("viem");
const types_1 = require("../types");
/*
 * This whole file was copied (and softly adapted) from viem in order to expose the function that provides just the encoding. The purpose is to expose `encodeTypedData` (viem only exports the hashTypedData)
 * That function are used by preimageSafeTransactionHash, preimageSafeMessageHash.
 */
function encodeField({ types, name, type, value }) {
    if (types[type] !== undefined) {
        return [{ type: 'bytes32' }, (0, viem_1.keccak256)(encodeData({ data: value, primaryType: type, types }))];
    }
    if (type === 'bytes') {
        const prepend = value.length % 2 ? '0' : '';
        value = `0x${prepend + value.slice(2)}`;
        return [{ type: 'bytes32' }, (0, viem_1.keccak256)(value)];
    }
    if (type === 'string')
        return [{ type: 'bytes32' }, (0, viem_1.keccak256)((0, viem_1.toHex)(value))];
    if (type.lastIndexOf(']') === type.length - 1) {
        const parsedType = type.slice(0, type.lastIndexOf('['));
        const typeValuePairs = value.map((item) => encodeField({
            name,
            type: parsedType,
            types,
            value: item
        }));
        return [
            { type: 'bytes32' },
            (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
        ];
    }
    return [{ type }, value];
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = new Set()) {
    const match = primaryType_.match(/^\w*/u);
    const primaryType = match?.[0] || '';
    if (results.has(primaryType) || types[primaryType] === undefined) {
        return results;
    }
    results.add(primaryType);
    for (const field of types[primaryType]) {
        findTypeDependencies({ primaryType: field.type, types }, results);
    }
    return results;
}
function encodeType({ primaryType, types }) {
    let result = '';
    const unsortedDeps = findTypeDependencies({ primaryType, types });
    unsortedDeps.delete(primaryType);
    const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
    for (const type of deps) {
        result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(',')})`;
    }
    return result;
}
function hashType({ primaryType, types }) {
    const encodedHashType = (0, viem_1.toHex)(encodeType({ primaryType, types }));
    return (0, viem_1.keccak256)(encodedHashType);
}
function encodeData({ data, primaryType, types }) {
    const encodedTypes = [{ type: 'bytes32' }];
    const encodedValues = [hashType({ primaryType, types })];
    for (const field of types[primaryType]) {
        const [type, value] = encodeField({
            types,
            name: field.name,
            type: field.type,
            value: data[field.name]
        });
        encodedTypes.push(type);
        encodedValues.push(value);
    }
    return (0, viem_1.encodeAbiParameters)(encodedTypes, encodedValues);
}
function hashStruct({ data, primaryType, types }) {
    const encoded = encodeData({
        data,
        primaryType,
        types
    });
    return (0, viem_1.keccak256)(encoded);
}
function deducePrimaryType(types) {
    // In ethers the primaryType is assumed to be the first yielded by a forEach of the types keys
    // https://github.com/ethers-io/ethers.js/blob/a4b1d1f43fca14f2e826e3c60e0d45f5b6ef3ec4/src.ts/hash/typed-data.ts#L278C13-L278C20
    return Object.keys(types)[0];
}
function hashTypedData(typedData) {
    const data = encodeTypedData(typedData);
    return (0, viem_1.keccak256)((0, types_1.asHex)(data));
}
function encodeTypedData(typedData) {
    typedData.primaryType = !typedData?.primaryType
        ? deducePrimaryType(typedData.types)
        : typedData?.primaryType;
    const { domain = {}, message, primaryType } = typedData;
    const types = {
        EIP712Domain: (0, viem_1.getTypesForEIP712Domain)({ domain: domain }),
        ...typedData.types
    };
    // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
    // as we can't statically check this with TypeScript.
    (0, viem_1.validateTypedData)({
        domain: domain,
        message,
        primaryType: primaryType,
        types
    });
    const parts = ['0x1901'];
    if (domain)
        parts.push((0, viem_1.hashDomain)({
            domain,
            types: types
        }));
    if (primaryType !== 'EIP712Domain')
        parts.push(hashStruct({
            data: message,
            primaryType: primaryType,
            types: types
        }));
    return (0, viem_1.concat)(parts);
}
//# sourceMappingURL=encode.js.map