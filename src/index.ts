import { eddsa as Eddsa } from 'elliptic';
import { sha256 } from 'js-sha256';
import { sha512 } from 'js-sha512';
import {
    encrypt as _encrypt,
    decrypt as _decrypt
} from '@futuretense/secret-box'

export function encrypt(
    privKey: Uint8Array,
    pubKey: Uint8Array,
    input,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    const key = deriveKey(privKey, pubKey);
    return _encrypt(input, key, nonce, authenticate);
}

export function decrypt(
    privKey: Uint8Array,
    pubKey: Uint8Array,
    input,
    nonce: Uint8Array | null,
    authenticate: Boolean = true
): Promise<Uint8Array> {
    const key = deriveKey(privKey, pubKey);
    return _decrypt(input, key, nonce, authenticate);
}

const ec = new Eddsa('ed25519');

function deriveKey(
    privKey: Uint8Array,
    pubKey: Uint8Array
) {
    const scalar = ec.decodeInt(getScalar(privKey));
    const point  = ec.decodePoint(Array.from(pubKey));
    const secret = ec.encodePoint(point.mul(scalar));
    return new Uint8Array(sha256.arrayBuffer(secret));
}

function getScalar(seed) {
    const hash = sha512.array(seed);
    hash[0]  &= 0xf8;
    hash[31] &= 0x3f;
    hash[31] |= 0x40;
    hash.slice(0, 32);
}
