// Transaction Hex: 0xf86c01850c4b201000825208949cbfd6ebdb9cfcccd6b043f43e524583486d455e880490283b23ec8f768025a067da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6ca00b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842

// payload range [0xf8 - 0xff]
// 0x
// 1101100
// f8 = f7 + length of payload in binary form in bytes = f7 + 108(convert to binary) = f7 + 1101100
// 6c = 108 bytes -> length of payload -> 01850c4b201000825208949cbfd6ebdb9cfcccd6b043f43e524583486d455e880490283b23ec8f768025a067da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6ca00b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842
// 01 = nonce

// 133  - 128 = 5 bytes (hex of  0x85 - 0x80)
// 0x85 - 0x80 =

// 85 0c4b201000 -> 5 bytes (Gas Price)

// 130  - 128 = 2 bytes (hex of  0x85 - 0x80)
// 0x85 - 0x80 =

// 82 5208 -> 2bytes (Gas Limit)

// 148  - 128 = 20 bytes (hex of 0x94 - 0x80)
// 0x94 - 0x80 =
// 94 9cbfd6ebdb9cfcccd6b043f43e524583486d455e -> 20 bytes (To)

// 136  -  128 = 8 bytes (hex of 0x88 - 0x80)
// 0x88 - 0x80 =

// 88 0490283b23ec8f76 -> 8 bytes (value)

// 0x80 -0x80 = 0
// 80 -> 0 bytes -> 0x (data)

// 0x25 - 1 byte is encoding itself
// 25 -> v

// 160 - 128 = 32 bytes (hex of a0 - 0x80)
// a0 - 0x80 =

// a0 67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c -> r

// 160 - 128 = 32 bytes (hex of a0 - 0x80)
// a0 - 0x80 =

// a0 0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842 -> s

// 1 nibble = 4 bits
// 1 byte = 8 bits

//const ethutil = require("ethereumjs-util");
const EthereumTx = require("ethereumjs-tx").Transaction;

// below values are converted in hex
// signed transaction
const txParams = {
  nonce: "0x01",
  gasPrice: "0x0C4B201000",
  gasLimit: "0x5208",
  to: "0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e",
  value: "0x0490283B23EC8F76",
  data: "0x", // null, ""
  v: "0x25",
  r: "0x67da959a6d114d42016b5fb43ff8ae018efe6e4c784d40dfb2f2aad8fb2d4f6c",
  s: "0x0b019b1e457b592e5bfd553e3b73742de625c7b65145494a57dbca17e5e9d842",
};

const tx = new EthereumTx(txParams, { chain: "mainnet" });

const key = tx.getSenderPublicKey();
// keccak256(public key)
// d854623eb394bee7c483b540055b936d7603f0b12b980631884b0628bb10a86e
// 0x055b936d7603f0b12b980631884b0628bb10a86e -> last 20 bytes of keccak256(public key) is from address
const address = tx.getSenderAddress();
const isValid = tx.verifySignature();

console.log("Public key: ", key.toString("hex"));
console.log("Address: ", address.toString("hex"));
console.log("Is Valid: ", isValid);

// unsigned transaction
const txParams_u = {
  nonce: "0x01",
  gasPrice: "0x0C4B201000",
  gasLimit: "0x5208",
  to: "0x9cbfd6ebdb9cfcccd6b043f43e524583486d455e",
  value: "0x0490283B23EC8F76",
  data: "0x", // null, ""
};

const tx2 = new EthereumTx(txParams_u, { chain: "mainnet" });

const privateKey = Buffer.from(
  "8a27bcf2f323040465ec83e1eaf0ce327e811ee39a52c17db7331dbb6adbf989",
  "hex"
);

tx2.sign(privateKey);

const key2 = tx2.getSenderPublicKey();
// keccak256(public key)
// d854623eb394bee7c483b540055b936d7603f0b12b980631884b0628bb10a86e
// 0x055b936d7603f0b12b980631884b0628bb10a86e -> last 20 bytes of keccak256(public key) is from address
const address2 = tx2.getSenderAddress();
const isValid2 = tx2.verifySignature();

console.log("Public key: ", key2.toString("hex"));
console.log("Address: ", address2.toString("hex"));
console.log("Is Valid: ", isValid2);
