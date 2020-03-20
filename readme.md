# @futuretense/ed25519-box

Simple public-key encryption for nodejs and browsers

Draws inspiration from `box` of NaCl, but works with ed25519 keys right away.

### ed25519-box vs nacl-box

* ed25519-box uses ed25519 key-pairs directly, whereas w/ nacl-box you have to transform ed25519 keys to curve25519 keys.
* ed25519-box gives you the choice of not using authentication, whereas nacl-box always adds a Poly1305 authentication tag.
* ed25519-box uses standard crypto APIs, already included in node.js, or in your browser -- no extra dependencies

## Installation

    npm install @futuretense/ed25519-box

## Usage

    import { encrypt, decrypt } from '@futuretense/ed25519-box';

## Functions

### Encrypt

``` javascript
async encrypt(privKey, pubKey, input, nonce, authenticate = true);
```

|Parameter|Type|Description|
|:--|:--|:--|
|privKey|Uint8Array|The private key of the sender|
|pubKey|Uint8Array|The public key of the recipient|
|input|Uint8Array|The data to be encrypted|
|nonce|Uint8Array|The message nonce|
|authenticate|Boolean|Should it be authenticated?|

|Return value|Description|
|:--|:--|
|Promise\<Uint8Array\>|The encrypted data|

### Decrypt

``` javascript
async decrypt(privKey, pubKey, input, nonce, authenticate = true);
```

|Parameter|Type|Description|
|:--|:--|:--|
|privKey|Uint8Array|The private key of the recipient|
|pubKey|Uint8Array|The public key of the sender|
|input|Uint8Array|The encrypted data|
|nonce|Uint8Array|The message nonce|
|authenticate|Boolean|Should it be authenticated?|

|Return value|Description|
|:--|:--|
|Promise\<Uint8Array\>|The decrypted data|

## Authentication

_Authenticated mode_ (which is the default) uses AES-256-GCM to add integrity control to the pot, to make it possible to verify that the provided cipher output has been encrypted by someone with access to the encryption key.

Authentication adds sixteen bytes of data to the output.

_Un-authenticated mode_ uses AES in counter mode (AES-256-CTR), and doesn't add any extra data.

## Nonce

Authenticated mode has a twelve byte nonce, and un-authenticated mode has a sixteen byte nonce.

In both modes, the nonces provided are used as initial values for the counters.


#### Nonce re-use

> The idea is that, for a given key, you should consider each counter value as "burnt" whenever you use it. -- Thomas Pornin

Both modes use stream ciphers that divide the input data into 128-bit blocks, which are then _exclusive-or:ed_
with the result of a function based on the encryption key and the counter value for a block.

If a _(key, counter)_-combination is ever used twice, this can be exploited to arrive at a block that's the _exclusive-or_ of the two unencrypted input blocks.

Copyright &copy; 2020 Future Tense, LLC
