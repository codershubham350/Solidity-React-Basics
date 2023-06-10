// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Test {
    function test(uint256 testNumb) external pure returns (uint data) {
        // In order to write lower level code in solidity
        assembly {
            let _num := 4
            let _fmp := mload(0x40) //memory load
        }

        // uint8[3] memory items = [1, 2, 3];

        assembly {
            data := mload(add(0x90, 0x20))
        }
        return testNumb;
    }

    function test2() external pure returns (uint data) {
        assembly {
            let fmp := mload(0x40)
            // hello in hex -> 68656C6C6F
            mstore(add(fmp, 0x00), 0x68656C6C6F)
            data := mload(add(fmp, 0x00))
        }
    }
}

// After compiling the code what we are actually doing is
// at memory(M) ->  M[0x40] = 0x80

// 0x40 (32 bytes or 256 bits) [1 byte = 8 bits]
// 0x0000000000000000000000000000000000000000000000000000000000000080

// 0x0000000000000000000000000000000000000000000000000000000000000080 ????????????????????????????????
// ?? mark indicates that after 0x80 these are coded values since we are having no values so by default it's '?'

// 0x29e99f070000000000000000000000000000000000000000000000000000000000000003
// 29e99f07-> test(uint256) 03-> value passing in function

// in 0x80 we are storing chunks of 32 bytes i.e. 1, 2, 3
