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


export ORG1_NAME_1=Org1 #PKR_ORG1
export ORG2_NAME_1=Org2 #PKR_ORG2

export ORG1_NAME_2=org1 #PKR_ORG1
export ORG2_NAME_2=org2 #PKR_ORG2

export DOMAIN_NAME=pkrstudio #pkrstudio

export LOCALHOST_NAME=172.31.8.177

function yaml_template {
    sed -e "s/\${ORG1_NAME_1}/$1/g" \
        -e "s/\${ORG2_NAME_1}/$2/g" \
        -e "s/\${ORG1_NAME_2}/$3/g" \
        -e "s/\${ORG2_NAME_2}/$4/g" \
        -e "s/\${LOCALHOST_NAME}/$5/g" \
        -e "s/\${DOMAIN_NAME}/$6/g" \
        $7 
}

echo "$(yaml_template $ORG1_NAME_1 $ORG2_NAME_1 $ORG1_NAME_2 $ORG2_NAME_2 $LOCALHOST_NAME $DOMAIN_NAME ./first-network-sdk-config-template.yaml)" > $FAB3_CONFIG

${GOPATH}/src/github.com/hyperledger/fabric-chaincode-evm/bin/fab3
