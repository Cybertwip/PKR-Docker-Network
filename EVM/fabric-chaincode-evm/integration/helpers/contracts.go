/*
Copyright IBM Corp All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

package helpers

// Contract struct contains the compiled bytecode of a Solidity contract,
// the runtime bytecode and the function hashes in a map
type Contract struct {
	CompiledBytecode string
	RuntimeBytecode  string
	FunctionHashes   map[string]string
}

// SimpleStorageContract returns a contract object that has the SimpleStorage
// bytecodes and function hashes.
func SimpleStorageContract() Contract {
	/* SimpleStorage Contract
	pragma solidity ^0.5.0;

	contract SimpleStorage {
	    uint storedData;

	    function set(uint x) public {
	        storedData = x;
	    }

	    function get() public view returns (uint) {
	        return storedData;
	    }
	}
	*/
	functionHashes := make(map[string]string)
	functionHashes["get"] = "6d4ce63c"
	functionHashes["set"] = "60fe47b1"

	return Contract{
		CompiledBytecode: "608060405234801561001057600080fd5b5060e68061001f6000396000f3fe6080604052600436106043576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b11460485780636d4ce63c14607f575b600080fd5b348015605357600080fd5b50607d60048036036020811015606857600080fd5b810190808035906020019092919050505060a7565b005b348015608a57600080fd5b50609160b1565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea165627a7a72305820290b24d16ffaf96310c5e236cef6f8bd81744b72beaeae1ca817d9372b69c2ba0029",
		RuntimeBytecode:  "6080604052600436106043576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b11460485780636d4ce63c14607f575b600080fd5b348015605357600080fd5b50607d60048036036020811015606857600080fd5b810190808035906020019092919050505060a7565b005b348015608a57600080fd5b50609160b1565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea165627a7a72305820290b24d16ffaf96310c5e236cef6f8bd81744b72beaeae1ca817d9372b69c2ba0029",
		FunctionHashes:   functionHashes,
	}
}

// InvokeContract has the bytecode and function hashes associated with a
// Solidity contract that takes in a SimpleStorage contract and invokes
// functions from the SimpleStorage contract.
func InvokeContract() Contract {
	/* Invokes a previously deployed SimpleStorage Contract
	pragma solidity ^0.5;

	interface StorageInterface{
		function get() external view returns (uint);
		function set(uint _val) external;
	}

	contract Invoke{
		StorageInterface store;

		constructor(StorageInterface _store) public {
			 store = _store;
		}

		function getVal() public view returns (uint result) {
				return store.get();
		}

		function setVal(uint _val) public returns (uint result) {
				store.set(_val);
				return _val;
		}
	}	*/

	functionHashes := make(map[string]string)
	functionHashes["getVal"] = "e1cb0e52"
	functionHashes["setVal"] = "3d4197f0"

	return Contract{
		CompiledBytecode: "608060405234801561001057600080fd5b506040516020806102f98339810180604052602081101561003057600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610268806100916000396000f3fe608060405260043610610046576000357c0100000000000000000000000000000000000000000000000000000000900480633d4197f01461004b578063e1cb0e521461009a575b600080fd5b34801561005757600080fd5b506100846004803603602081101561006e57600080fd5b81019080803590602001909291905050506100c5565b6040518082815260200191505060405180910390f35b3480156100a657600080fd5b506100af610177565b6040518082815260200191505060405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166360fe47b1836040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561015757600080fd5b505af115801561016b573d6000803e3d6000fd5b50505050819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d4ce63c6040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b1580156101fc57600080fd5b505afa158015610210573d6000803e3d6000fd5b505050506040513d602081101561022657600080fd5b810190808051906020019092919050505090509056fea165627a7a7230582098c74c9ae961568f419cd648965957c2f72a8e3c8ff2c25875b480b6da93a2c80029",
		RuntimeBytecode:  "608060405260043610610046576000357c0100000000000000000000000000000000000000000000000000000000900480633d4197f01461004b578063e1cb0e521461009a575b600080fd5b34801561005757600080fd5b506100846004803603602081101561006e57600080fd5b81019080803590602001909291905050506100c5565b6040518082815260200191505060405180910390f35b3480156100a657600080fd5b506100af610177565b6040518082815260200191505060405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166360fe47b1836040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561015757600080fd5b505af115801561016b573d6000803e3d6000fd5b50505050819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d4ce63c6040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b1580156101fc57600080fd5b505afa158015610210573d6000803e3d6000fd5b505050506040513d602081101561022657600080fd5b810190808051906020019092919050505090509056fea165627a7a7230582098c74c9ae961568f419cd648965957c2f72a8e3c8ff2c25875b480b6da93a2c80029",
		FunctionHashes:   functionHashes,
	}
}

// SimpleStorageWithLog is the simple storage contract with an solidity event to
// emit an evm log which will be stored as a fabric Event.
//
// docker run --rm -i ethereum/solc:0.4.21 --combined-json hashes,bin,bin-runtime - <SimpleStorageWithLog.sol
func SimpleStorageWithLog() Contract {
	/*
	   pragma solidity >=0.4.21 <0.6.0;

	   contract SimpleStorageWithLog {
	       uint storedData;

	       // 'after' is a solidity keyword, so can't use names before and after
	       //
	       // index both to create more topics in the resulting ethereum event
	       event Changed(uint indexed changedFrom, uint indexed changedTo);

	       function set(uint x) public {
	           // emit before we change the storedData
	           emit Changed(storedData, x);
	           storedData = x;
	       }

	       function get() public view returns (uint) {
	           return storedData;
	       }
	   }
	*/
	functionHashes := make(map[string]string)
	functionHashes["get"] = "6d4ce63c"
	functionHashes["set"] = "60fe47b1"

	return Contract{
		CompiledBytecode: "6060604052341561000f57600080fd5b6101038061001e6000396000f3006060604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606e575b600080fd5b3415605857600080fd5b606c60048080359060200190919050506094565b005b3415607857600080fd5b607e60ce565b6040518082815260200191505060405180910390f35b806000547fd81ec364c58bcc9b49b6c953fc8e1f1c158ee89255bae73029133234a2936aad60405160405180910390a38060008190555050565b600080549050905600a165627a7a72305820c25e87c4204a7116bc2c63e7a37614025a0e0fac325fe4469a50743572d05ff90029",
		RuntimeBytecode:  "6060604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c14606e575b600080fd5b3415605857600080fd5b606c60048080359060200190919050506094565b005b3415607857600080fd5b607e60ce565b6040518082815260200191505060405180910390f35b806000547fd81ec364c58bcc9b49b6c953fc8e1f1c158ee89255bae73029133234a2936aad60405160405180910390a38060008190555050565b600080549050905600a165627a7a72305820c25e87c4204a7116bc2c63e7a37614025a0e0fac325fe4469a50743572d05ff90029",
		FunctionHashes:   functionHashes,
	}
}

func SimpleStorageCreator() Contract {
	/*
		pragma solidity ^0.5.0;

		contract SimpleStorage {
				uint storedData;

				function set(uint x) public {
						storedData = x;
				}

				function get() public view returns (uint) {
						return storedData;
				}
		}

		contract SimpleStorageCreator {
				function createSimpleStorage() public returns (SimpleStorage simpleStorageAddress){
						return new SimpleStorage();
				}
		}
	*/

	functionHashes := make(map[string]string)
	functionHashes["createSimpleStorage"] = "40d66b3b"

	return Contract{
		CompiledBytecode: "608060405234801561001057600080fd5b50610204806100206000396000f3fe60806040526004361061003b576000357c01000000000000000000000000000000000000000000000000000000009004806340d66b3b14610040575b600080fd5b34801561004c57600080fd5b50610055610097565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006100a16100c3565b604051809103906000f0801580156100bd573d6000803e3d6000fd5b50905090565b604051610105806100d48339019056fe608060405234801561001057600080fd5b5060e68061001f6000396000f3fe6080604052600436106043576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b11460485780636d4ce63c14607f575b600080fd5b348015605357600080fd5b50607d60048036036020811015606857600080fd5b810190808035906020019092919050505060a7565b005b348015608a57600080fd5b50609160b1565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea165627a7a723058204fba53eb31e370bbdbe1f1064d4e2a6aa794f3533a7563265edde21d4e8563b40029a165627a7a723058208317acddf85b105bfe01677c962f5e4493cfc1b65fcd91dfc3474d3bd4be2eeb0029",
		RuntimeBytecode:  "60806040526004361061003b576000357c01000000000000000000000000000000000000000000000000000000009004806340d66b3b14610040575b600080fd5b34801561004c57600080fd5b50610055610097565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006100a16100c3565b604051809103906000f0801580156100bd573d6000803e3d6000fd5b50905090565b604051610105806100d48339019056fe608060405234801561001057600080fd5b5060e68061001f6000396000f3fe6080604052600436106043576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b11460485780636d4ce63c14607f575b600080fd5b348015605357600080fd5b50607d60048036036020811015606857600080fd5b810190808035906020019092919050505060a7565b005b348015608a57600080fd5b50609160b1565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea165627a7a723058204fba53eb31e370bbdbe1f1064d4e2a6aa794f3533a7563265edde21d4e8563b40029a165627a7a723058208317acddf85b105bfe01677c962f5e4493cfc1b65fcd91dfc3474d3bd4be2eeb0029",
		FunctionHashes:   functionHashes,
	}

}