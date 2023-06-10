const Trie = require("merkle-patricia-tree").SecureTrie; // We import the library required to create a basic Merkle Patricia Tree
const { BranchNode } = require("merkle-patricia-tree/dist/trieNode");

const { keccak256 } = require("ethereumjs-util");

var trie = new Trie(); // We create an empty Patricia Merkle Tree

const traverseTrie = (node) => {
  trie.walkTrie(node, (_, node) => {
    if (node) {
      console.log(node);
      console.log(node.hash().toString("hex"));
      if (node instanceof BranchNode) {
        for (let i = 0; i < 16; i++) {
          const buffer = node.getBranch(i);
          if (buffer && buffer.length > 0) {
            traverseTrie(buffer);
          }
        }
      }
    }
  });
};

async function test() {
  await trie.put(
    Buffer.from("32fa7b"),
    // ASCII Text to Hex 31 30
    Buffer.from("10")
  );

  await trie.put(
    Buffer.from("32fa7c"),
    // ASCII Text to Hex 32 30
    Buffer.from("20")
  );

  traverseTrie(trie.root);

  console.log("Root Hash: ", trie.root.toString("hex"));

  const path = await trie.findPath(keccak256(Buffer.from("32fa7b")));

  console.log("NODE:  ", path.node.serialize().toString("hex"));
  console.log("NODE HASH VALUE:  ", keccak256(path.node.serialize()));
  console.log("NODE VALUE:  ", path.node.value.toString("ascii"));
}

test();

// Explanation 1 :- (of simple leaf node)
// Keccak256(key) as a String-> Keccak256(32fa7c) (input type 'text')
// 4f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// 4f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 -> even number of values so add 2 which is 20 as prefix

// add 20 hex prefix if nibbles are even
// 204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// 0x80 + 33 (length of our even string) = 161(Decimal) -> A1 or a1 (Hex)(add as prefix)
// a1 204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 (20)ascii to Hex convert -> 20(ascii) to hex is -> 3230
// 0x80 + 2(length of 3230 i.e. 2 bytes) -> 0x82
// a1 204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 82 3230

// 0xc0 + 37(length of our updated string)
// 0xc0(hex to decimal)-> 192 +37 = 229(Decimal) -> E5 or e5 (Hex)
// e5 a1204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230

// e5a1204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230

// Keccak256(RLP) as Hex (input type 'Hex') -> keccak256(e5a1204f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230)
// Below is our output
// 17dee68b36b0276d8db503b497c8335d5d4ace0ed3fef5f6fa62644dcd66f170

// =================================================================================

// Explanation 2 :- (of leaf node and tree)
// Leaf 1-> // Keccak256(key) as a String-> Keccak256(32fa7c) (input type 'text')

// '4' is stored in the branch Node
// 4 f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 -> here '4' is the branch node

// RLP - 20 if number is even, 3 if number is odd
// 3 f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2
// 3f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// 0x80 + 32 (length of our updated string) = 128 + 32 = 160(Decimal) -> A0 or a0 (Hex) (add as prefix)
// a0 3f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2
// a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2

// a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 (20)ascii to Hex convert -> 20(ascii) to hex is -> 3230
// a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 3230

// 0x80 + 2(length of 3230 i.e. 2 bytes) -> 0x82
// a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2 82 3230
// a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230

// 0xc0(hex to decimal)-> 192 +36 = 228(Decimal) -> E4 or e4 (Hex)(add as prefix)
// e4 a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230
// e4a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230

// Keccak256(RLP) as Hex (input type 'Hex') -> keccak256(e4a03f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2823230)
// Below is our output
// b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc

// Leaf 2-> // Keccak256(key) as a String-> Keccak256(32fa7b) (input type 'text')

// '3' is stored in the branch Node
//  3 3865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1 -> here '3' is the branch node

// RLP - 20 if number is even, 3 if number is odd
// 3 3865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1
// 33865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1

// 0x80 + 32 (length of our updated string) = 128 + 32 = 160(Decimal) -> A0 or a0 (Hex) (add as prefix)
// a0 33865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1
// a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1

// a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1 (10)ascii to Hex convert -> 10(ascii) to hex is -> 3130
// a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1 3130

// 0x80 + 2(length of 3230 i.e. 2 bytes) -> 0x82
// a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1 82 3130
// a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1823130

// 0xc0(hex to decimal)-> 192 +36 = 228(Decimal) -> E4 or e4 (Hex)(add as prefix)
// e4 a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1823130
// e4a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1823130

// Keccak256(RLP) as Hex (input type 'Hex') -> keccak256(e4a033865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1823130)
// Below is our output
// 2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65

// =================================================================================

//Explanation 3-> Branch Node (Root Hashing)
// RLP

// 80 means buffer with empty nodes-> <Buffer >,
// In our current example we have nodes filled in 3rd and 4th index only rest are empty
// 808080

// Out of 15 nodes we have only 2 filled so
// 808080   8080808080808080808080

// also we have value as empty so one more extra 80
// 808080   808080808080808080808080

// At index 3rd hash value is 2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65
// 808080 2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65    808080808080808080808080

// 0x80 + 32 (length of our updated string) = 128 + 32 = 160(Decimal) -> A0 or a0 (Hex) (add as prefix)
// 808080 a0 2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65    808080808080808080808080

// At index 4th hash value is b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc
// 0x80 + 32 (length of our updated string) = 128 + 32 = 160(Decimal) -> A0 or a0 (Hex) (add as prefix)
// 808080 a0 2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65 a0 b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc 808080808080808080808080
// 808080a02fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65a0b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc808080808080808080808080

// length is 162 (updated string) -> 81(bytes)[Decimal] -> 51(Hex)(add as Prefix)
// 51 808080a02fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65a0b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc808080808080808080808080

// If length is more than 55 bytes then encoding is f7 + 81(bytes)[Hex] ->
// f7 + 10000001(Binary of 81) -> f7 + 8(bits length of binary) -> f7 + 1 = f8
// f8 51 808080a02fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65a0b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc808080808080808080808080
// f851808080a02fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65a0b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc808080808080808080808080

// Keccak256(RLP) as Hex (input type 'Hex') -> keccak256(f851808080a02fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65a0b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc808080808080808080808080)
// 93267434a14288490332f997cb13123bb68609112edbd06f6e8c7c9798fd20c6

// Below is the output of 2 leaf node and Tree
/*Root Hash:  93267434a14288490332f997cb13123bb68609112edbd06f6e8c7c9798fd20c6
BranchNode {  // [0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f] -> 16 bit format
  _branches: [
  0 ->  <Buffer >,
  1 ->  <Buffer >,
  2 ->  <Buffer >,
  3 ->  <Buffer 2f d2 c9 e2 e7 4e 9d 07 a9 20 dd 1e bf 94 f1 bd 7a 5a a1 76 44 64 76 9c 83 ce 1c bb 38 13 7d 65>,
  4 ->  <Buffer b7 f6 31 fb d6 cf b1 ae b1 94 11 e7 5f c3 37 69 93 4c 7e a2 24 2a 47 b5 4e d6 89 5e 96 27 a0 fc>,
  5 ->  <Buffer >,
  6 ->  <Buffer >,
  7 ->  <Buffer >,
  8 ->  <Buffer >,
  9 ->  <Buffer >,
  a ->  <Buffer >,
  b ->  <Buffer >,
  c ->  <Buffer >,
  d ->  <Buffer >,
  e ->  <Buffer >,
  f ->  <Buffer >
  ],
  _value: <Buffer >
}
93267434a14288490332f997cb13123bb68609112edbd06f6e8c7c9798fd20c6
LeafNode {
  _nibbles: [ // Decimal value in nibbles (when converted to hex) -> 3865e1f181df18d1fff8847c6298e5b2c621a56f368e030e8ead670c8b01aa1
     3,  8,  6,  5, 14,  1, 15,  1,  8,  1, 13, 15,
     1,  8, 13,  1, 15, 15, 15,  8,  8,  4,  7, 12,
     6,  2,  9,  8, 14,  5, 11,  2, 12,  6,  2,  1,
    10,  5,  6, 15,  3,  6,  8, 14,  0,  3,  0, 14,
     8, 14, 10, 13,  6,  7,  0, 12,  8, 11,  0,  1,
    10, 10,  1
  ],
    _value: <Buffer 31 30>
}
2fd2c9e2e74e9d07a920dd1ebf94f1bd7a5aa1764464769c83ce1cbb38137d65
  _nibbles: [ // Decimal value in nibbles (when converted to hex) -> f6c1c50fde5f5d4f20c2979974a8f465b24e65062f02ef80f722200f35105e2
    15,  6, 12,  1, 12,  5,  0, 15, 13, 14, 5, 15,
     5, 13,  4, 15,  2,  0, 12,  2,  9,  7, 9,  9,
     7,  4, 10,  8, 15,  4,  6,  5, 11,  2, 4, 14,
     6,  5,  0,  6,  2, 15,  0,  2, 14, 15, 8,  0,
    15,  7,  2,  2,  2,  0,  0, 15,  3,  5, 1,  0,
     5, 14,  2
  ],
  _value: <Buffer 32 30>
}
b7f631fbd6cfb1aeb19411e75fc33769934c7ea2242a47b54ed6895e9627a0fc */
