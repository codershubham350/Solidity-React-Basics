// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

// Inheritance
contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier limitWithdraw(uint withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        _; // rest of the code
    }

    // private -> can be accessible only within smart contract
    // internal -> can be accessible within smart contract and also derived smart contract

    // this is a special function
    // It's caled when you make a transaction,
    // that dosen't specify function name to call

    // External functions are part of the contract interface
    // which means they can be called via contracts and other transactions.

    receive() external payable {}

    function emitLog() public pure override returns (bytes32) {
        return "hello World";
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function addFunds() external payable override {
        //    uint index = numOfFunders++;
        // funders[index] = msg.sender;
        address funder = msg.sender;
        test3();

        if (!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function test1() external onlyOwner {
        // some managing stuff that only admin should have access to
    }

    function test2() external onlyOwner {
        // some managing stuff that only admin should have access to
    }

    function withdraw(
        uint withdrawAmount
    ) external override limitWithdraw(withdrawAmount) {
        // require(
        //     withdrawAmount <= 100000000000000000,
        //     "Cannot withdraw more than 0.1 ether"
        // );

        payable(msg.sender).transfer(withdrawAmount);
        // if (withdrawAmount < 1000000000000000000) {

        // }
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        // address[] memory _funders = getAllFunders();
        return lutFunders[index];
    }

    //  const instance = await Faucet.deployed();

    // instance.addFunds({from: accounts[0], value: "2000000000000000000"})
    // instance.addFunds({from: accounts[1], value: "2000000000000000000"})

    // instance.withdraw("500000000000000000", {from: accounts[1]})

    // instance.getFunderAtIndex(0)
    // instance.getAllFunders()

    // pure, view - read-only call, no gas  free
    // view - it indicates that the function will not alter the storage state in any way
    // pure - even more strict indicating that it won't even read the storage state
    // external - dosen't allow other functions to be accessible inside smart contract.
    // internal - allow's other functions to be accessible inside smart contract.
    // public -  It does allows other functions to be accessible inside smart contract

    // Transactions (can generate state changes) and require gas fee
    // read-only call, no gas  free

    // to talk to the node on the network you can make JSOn-RPC http calls
}

// Block info
// Nonce - a hash that when combined with the mixHash proofs that
// the block has gone through Proof of Work(POW)
// 8 bytes => 64 bits (E.g  nonce: '0x0000000000000000',  mixHash: '0xfd24934dc23210250dc692123769aea483236dbe079af21bfa651854c91cc5df')

// const instance = await Faucet.deployed()
// instance.addFunds({value: "3000000000000000000", from: accounts[3]})
