#!/usr/bin/env bash

export CHANNEL_NAME=evm
export ORG=Org1
export USER=User1

export FAB3_CONFIG=${GOPATH}/src/github.com/hyperledger/fabric-chaincode-evm/examples/first-network-sdk-config.yaml # Path to a compatible Fabric SDK Go config file
export FAB3_USER=$USER # User identity being used for the proxy (Matches the users names in the crypto-config directory specified in the config)
export FAB3_ORG=$ORG  # Organization of the specified user
export FAB3_CHANNEL=$CHANNEL_NAME # Channel to be used for the transactions
export FAB3_CCID=evmcc # ID of the EVM Chaincode deployed in your fabric network. If not provided default is evmcc.
export FAB3_PORT=5000 # Port the proxy will listen on. If not provided default is 5000.

${GOPATH}/src/github.com/hyperledger/fabric-chaincode-evm/bin/fab3
