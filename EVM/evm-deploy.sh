#!/usr/bin/env bash

export VERSION=1
export CHANNEL_NAME=evm
export ORDERER_CA=${PWD}/../../fabric-samples/first-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export CC_SRC_PATH=github.com/hyperledger/fabric-chaincode-evm/evmcc
export CC_RUNTIME_LANGUAGE=golang
export CORE_PEER_TLS_ENABLED=true
export ORG1_MSP=Org1MSP
export ORG2_MSP=Org2MSP

export SEQUENCE=1

export ORG1_PEER0_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORG1_PEER0_CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export ORG1_PEER0_CORE_PEER_LOCALMSPID="Org1MSP"
export ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

export ORG1_PEER1_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export ORG1_PEER1_CORE_PEER_ADDRESS=peer1.org1.example.com:8051
export ORG1_PEER1_CORE_PEER_LOCALMSPID="Org1MSP"
export ORG1_PEER1_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt

export ORG2_PEER0_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export ORG2_PEER0_CORE_PEER_ADDRESS=peer0.org2.example.com:9051
export ORG2_PEER0_CORE_PEER_LOCALMSPID="Org2MSP"
export ORG2_PEER0_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

export ORG2_PEER1_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export ORG2_PEER1_CORE_PEER_ADDRESS=peer1.org2.example.com:10051
export ORG2_PEER1_CORE_PEER_LOCALMSPID="Org2MSP"
export ORG2_PEER1_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt

setGlobals() {
  local USING_ORG=""
  local USING_PEER=""

  USING_ORG=$1
  USING_PEER=$2

  echo "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then

	  if [ $USING_PEER -eq 0 ]; then
	    export CORE_PEER_LOCALMSPID=$ORG1_PEER0_CORE_PEER_LOCALMSPID
	    export CORE_PEER_TLS_ROOTCERT_FILE=$ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE
	    export CORE_PEER_MSPCONFIGPATH=$ORG1_PEER0_CORE_PEER_MSPCONFIGPATH
	    export CORE_PEER_ADDRESS=$ORG1_PEER0_CORE_PEER_ADDRESS
	  elif [ $USING_PEER -eq 1 ]; then
		export CORE_PEER_LOCALMSPID=$ORG1_PEER1_CORE_PEER_LOCALMSPID
		export CORE_PEER_TLS_ROOTCERT_FILE=$ORG1_PEER1_CORE_PEER_TLS_ROOTCERT_FILE
		export CORE_PEER_MSPCONFIGPATH=$ORG1_PEER1_CORE_PEER_MSPCONFIGPATH
		export CORE_PEER_ADDRESS=$ORG1_PEER1_CORE_PEER_ADDRESS
	  else
	    echo "================== ERROR !!! PEER Unknown =================="
	  fi	  	
  elif [ $USING_ORG -eq 2 ]; then
	  if [ $USING_PEER -eq 0 ]; then
	    export CORE_PEER_LOCALMSPID=$ORG2_PEER0_CORE_PEER_LOCALMSPID
	    export CORE_PEER_TLS_ROOTCERT_FILE=$ORG2_PEER0_CORE_PEER_TLS_ROOTCERT_FILE
	    export CORE_PEER_MSPCONFIGPATH=$ORG2_PEER0_CORE_PEER_MSPCONFIGPATH
	    export CORE_PEER_ADDRESS=$ORG2_PEER0_CORE_PEER_ADDRESS
	  elif [ $USING_PEER -eq 1 ]; then
		export CORE_PEER_LOCALMSPID=$ORG2_PEER1_CORE_PEER_LOCALMSPID
		export CORE_PEER_TLS_ROOTCERT_FILE=$ORG2_PEER1_CORE_PEER_TLS_ROOTCERT_FILE
		export CORE_PEER_MSPCONFIGPATH=$ORG2_PEER1_CORE_PEER_MSPCONFIGPATH
		export CORE_PEER_ADDRESS=$ORG2_PEER1_CORE_PEER_ADDRESS
	  else
	    echo "================== ERROR !!! PEER Unknown =================="
	  fi	  	

  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi
}

export PEER_CONN_PARMS="--peerAddresses $ORG1_PEER0_CORE_PEER_ADDRESS --peerAddresses $ORG1_PEER1_CORE_PEER_ADDRESS --peerAddresses $ORG2_PEER0_CORE_PEER_ADDRESS --peerAddresses $ORG2_PEER1_CORE_PEER_ADDRESS --tlsRootCertFiles $ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE --tlsRootCertFiles $ORG1_PEER1_CORE_PEER_TLS_ROOTCERT_FILE --tlsRootCertFiles $ORG2_PEER0_CORE_PEER_TLS_ROOTCERT_FILE --tlsRootCertFiles $ORG2_PEER1_CORE_PEER_TLS_ROOTCERT_FILE"
export QUERY_PEER_CONN_PARAMS="--peerAddresses $ORG1_PEER0_CORE_PEER_ADDRESS --tlsRootCertFiles $ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE"


setGlobals 1 0
#peer chaincode invoke -n evmcc -C $CHANNEL_NAME  -c '{"Args":["0000000000000000000000000000000000000000","608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea2646970667358221220f0b1759e133e35c41664effceaa2072f88637700fb7dd37882c436e5faaed62a64736f6c63430006010033"]}' -o orderer.example.com:7050 --tls --cafile $ORDERER_CA

#peer chaincode query -n evmcc -C $CHANNEL_NAME  -c '{"Args":["getCode","bfd09f489229ba69dd4b351c0a654d7ce1feace1"]}' -o orderer.example.com:7050 --tls --cafile $ORDERER_CA >&log.txt

#peer chaincode invoke -n evmcc -C $CHANNEL_NAME -c '{"Args":["getCode","249c8070330d58809854c958e8426356a8ad69fb"]}'
#peer chaincode invoke -n evmcc -C $CHANNEL_NAME  -c '{"Args":["665af82732ff22c69d9f3836f6f6f114743be2dc","60fe47b1000000000000000000000000000000000000000000000000000000000000000a"]}' -o orderer.example.com:7050 --tls --cafile $ORDERER_CA $QUERY_PEER_CONN_PARAMS
#peer chaincode query -n evmcc -C $CHANNEL_NAME  -c '{"Args":["getCode","665af82732ff22c69d9f3836f6f6f114743be2dc"]}' -o orderer.example.com:7050 --tls --cafile $ORDERER_CA $QUERY_PEER_CONN_PARAMS
#peer chaincode query -n evmcc -C $CHANNEL_NAME  -c '{"Args":["account"]}'

#peer chaincode list --installed --channelID evm
#peer chaincode invoke -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n evmcc $PEER_CONN_PARMS --isInit -c '{"function":"Init","Args":[]}' >&log.txt

#cat log.txt


