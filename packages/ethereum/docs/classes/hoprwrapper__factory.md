[@hoprnet/hopr-ethereum](../README.md) / [Exports](../modules.md) / HoprWrapper__factory

# Class: HoprWrapper\_\_factory

## Hierarchy

- *ContractFactory*

  ↳ **HoprWrapper__factory**

## Table of contents

### Constructors

- [constructor](hoprwrapper__factory.md#constructor)

### Properties

- [bytecode](hoprwrapper__factory.md#bytecode)
- [interface](hoprwrapper__factory.md#interface)
- [signer](hoprwrapper__factory.md#signer)

### Methods

- [attach](hoprwrapper__factory.md#attach)
- [connect](hoprwrapper__factory.md#connect)
- [deploy](hoprwrapper__factory.md#deploy)
- [getDeployTransaction](hoprwrapper__factory.md#getdeploytransaction)
- [connect](hoprwrapper__factory.md#connect)
- [fromSolidity](hoprwrapper__factory.md#fromsolidity)
- [getContract](hoprwrapper__factory.md#getcontract)
- [getContractAddress](hoprwrapper__factory.md#getcontractaddress)
- [getInterface](hoprwrapper__factory.md#getinterface)

## Constructors

### constructor

\+ **new HoprWrapper__factory**(`signer?`: *Signer*): [*HoprWrapper\_\_factory*](hoprwrapper__factory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer?` | *Signer* |

**Returns:** [*HoprWrapper\_\_factory*](hoprwrapper__factory.md)

Overrides: ContractFactory.constructor

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:10

## Properties

### bytecode

• `Readonly` **bytecode**: *string*

Inherited from: ContractFactory.bytecode

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:131

___

### interface

• `Readonly` **interface**: *Interface*

Inherited from: ContractFactory.interface

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:130

___

### signer

• `Readonly` **signer**: *Signer*

Inherited from: ContractFactory.signer

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:132

## Methods

### attach

▸ **attach**(`address`: *string*): [*HoprWrapper*](hoprwrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |

**Returns:** [*HoprWrapper*](hoprwrapper.md)

Overrides: ContractFactory.attach

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:33

___

### connect

▸ **connect**(`signer`: *Signer*): [*HoprWrapper\_\_factory*](hoprwrapper__factory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | *Signer* |

**Returns:** [*HoprWrapper\_\_factory*](hoprwrapper__factory.md)

Overrides: ContractFactory.connect

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:36

___

### deploy

▸ **deploy**(`_xHOPR`: *string*, `_wxHOPR`: *string*, `overrides?`: Overrides & { `from?`: *string* \| *Promise*<string\>  }): *Promise*<[*HoprWrapper*](hoprwrapper.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_xHOPR` | *string* |
| `_wxHOPR` | *string* |
| `overrides?` | Overrides & { `from?`: *string* \| *Promise*<string\>  } |

**Returns:** *Promise*<[*HoprWrapper*](hoprwrapper.md)\>

Overrides: ContractFactory.deploy

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:15

___

### getDeployTransaction

▸ **getDeployTransaction**(`_xHOPR`: *string*, `_wxHOPR`: *string*, `overrides?`: Overrides & { `from?`: *string* \| *Promise*<string\>  }): TransactionRequest

#### Parameters

| Name | Type |
| :------ | :------ |
| `_xHOPR` | *string* |
| `_wxHOPR` | *string* |
| `overrides?` | Overrides & { `from?`: *string* \| *Promise*<string\>  } |

**Returns:** TransactionRequest

Overrides: ContractFactory.getDeployTransaction

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:26

___

### connect

▸ `Static` **connect**(`address`: *string*, `signerOrProvider`: *Signer* \| *Provider*): [*HoprWrapper*](hoprwrapper.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `signerOrProvider` | *Signer* \| *Provider* |

**Returns:** [*HoprWrapper*](hoprwrapper.md)

Defined in: packages/ethereum/types/factories/HoprWrapper__factory.ts:39

___

### fromSolidity

▸ `Static` **fromSolidity**(`compilerOutput`: *any*, `signer?`: *Signer*): *ContractFactory*

#### Parameters

| Name | Type |
| :------ | :------ |
| `compilerOutput` | *any* |
| `signer?` | *Signer* |

**Returns:** *ContractFactory*

Inherited from: ContractFactory.fromSolidity

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:140

___

### getContract

▸ `Static` **getContract**(`address`: *string*, `contractInterface`: ContractInterface, `signer?`: *Signer*): *Contract*

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | *string* |
| `contractInterface` | ContractInterface |
| `signer?` | *Signer* |

**Returns:** *Contract*

Inherited from: ContractFactory.getContract

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:146

___

### getContractAddress

▸ `Static` **getContractAddress**(`tx`: { `from`: *string* ; `nonce`: *number* \| *BigNumber* \| BytesLike  }): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | *object* |
| `tx.from` | *string* |
| `tx.nonce` | *number* \| *BigNumber* \| BytesLike |

**Returns:** *string*

Inherited from: ContractFactory.getContractAddress

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:142

___

### getInterface

▸ `Static` **getInterface**(`contractInterface`: ContractInterface): *Interface*

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractInterface` | ContractInterface |

**Returns:** *Interface*

Inherited from: ContractFactory.getInterface

Defined in: node_modules/@ethersproject/contracts/lib/index.d.ts:141