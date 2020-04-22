#!/usr/bin/env bash


# must be run from inside the peers' container directory (peer) with docker exec -it cli bash

export ORG1_NAME_1=Org1 #PKR_ORG1
export ORG2_NAME_1=Org2 #PKR_ORG2

export ORG1_NAME_2=org1 #PKR_ORG1
export ORG2_NAME_2=org2 #PKR_ORG2

export DOMAIN_NAME=pkrstudio #pkrstudio

export ORG1_MSP=Org1MSP
export ORG2_MSP=Org2MSP


export VERSION=1
export CHANNEL_NAME=evm
export ORDERER_CA=${PWD}/../../fabric-samples/first-network/crypto-config/ordererOrganizations/${DOMAIN_NAME}.com/orderers/orderer.${DOMAIN_NAME}.com/msp/tlscacerts/tlsca.${DOMAIN_NAME}.com-cert.pem
export CC_SRC_PATH=github.com/hyperledger/fabric-chaincode-evm/evmpkr
export CC_RUNTIME_LANGUAGE=javascript
export CORE_PEER_TLS_ENABLED=true

export CHAINCODE_NAME=evmpkr

export SEQUENCE=1

export ORG1_PEER0_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG1_NAME_2}.${DOMAIN_NAME}.com/users/Admin@${ORG1_NAME_2}.${DOMAIN_NAME}.com/msp
export ORG1_PEER0_CORE_PEER_ADDRESS=peer0.${ORG1_NAME_2}.${DOMAIN_NAME}.com:7051
export ORG1_PEER0_CORE_PEER_LOCALMSPID="${ORG1_MSP}"
export ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG1_NAME_2}.${DOMAIN_NAME}.com/peers/peer0.${ORG1_NAME_2}.${DOMAIN_NAME}.com/tls/ca.crt

export ORG1_PEER1_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG1_NAME_2}.${DOMAIN_NAME}.com/users/Admin@${ORG1_NAME_2}.${DOMAIN_NAME}.com/msp
export ORG1_PEER1_CORE_PEER_ADDRESS=peer1.${ORG1_NAME_2}.${DOMAIN_NAME}.com:8051
export ORG1_PEER1_CORE_PEER_LOCALMSPID="${ORG1_MSP}"
export ORG1_PEER1_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG1_NAME_2}.${DOMAIN_NAME}.com/peers/peer1.${ORG1_NAME_2}.${DOMAIN_NAME}.com/tls/ca.crt

export ORG2_PEER0_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG2_NAME_2}.${DOMAIN_NAME}.com/users/Admin@${ORG2_NAME_2}.${DOMAIN_NAME}.com/msp
export ORG2_PEER0_CORE_PEER_ADDRESS=peer0.${ORG2_NAME_2}.${DOMAIN_NAME}.com:9051
export ORG2_PEER0_CORE_PEER_LOCALMSPID="${ORG2_MSP}"
export ORG2_PEER0_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG2_NAME_2}.${DOMAIN_NAME}.com/peers/peer0.${ORG2_NAME_2}.${DOMAIN_NAME}.com/tls/ca.crt

export ORG2_PEER1_CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG2_NAME_2}.${DOMAIN_NAME}.com/users/Admin@${ORG2_NAME_2}.${DOMAIN_NAME}.com/msp
export ORG2_PEER1_CORE_PEER_ADDRESS=peer1.${ORG2_NAME_2}.${DOMAIN_NAME}.com:10051
export ORG2_PEER1_CORE_PEER_LOCALMSPID="${ORG2_MSP}"
export ORG2_PEER1_CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/${ORG2_NAME_2}.${DOMAIN_NAME}.com/peers/peer1.${ORG2_NAME_2}.${DOMAIN_NAME}.com/tls/ca.crt

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

echo $PEER_CONN_PARMS

peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CHAINCODE_NAME}_${VERSION} >&log.txt
cat log.txt

setGlobals 1 0

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz --peerAddresses $ORG1_PEER0_CORE_PEER_ADDRESS  --tlsRootCertFiles $ORG1_PEER0_CORE_PEER_TLS_ROOTCERT_FILE >&log.txt
cat log.txt

setGlobals 1 1

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz --peerAddresses $ORG1_PEER1_CORE_PEER_ADDRESS --tlsRootCertFiles $ORG1_PEER1_CORE_PEER_TLS_ROOTCERT_FILE >&log.txt
cat log.txt

setGlobals 2 0

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz --peerAddresses $ORG2_PEER0_CORE_PEER_ADDRESS --tlsRootCertFiles $ORG2_PEER0_CORE_PEER_TLS_ROOTCERT_FILE >&log.txt
cat log.txt

setGlobals 2 1

peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz --peerAddresses $ORG2_PEER1_CORE_PEER_ADDRESS --tlsRootCertFiles $ORG2_PEER1_CORE_PEER_TLS_ROOTCERT_FILE >&log.txt
cat log.txt

peer lifecycle chaincode queryinstalled >&log.txt
PACKAGE_ID=$(sed -n "/${CHAINCODE_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

cat log.txt

echo $PACKAGE_ID

setGlobals 1 0

peer lifecycle chaincode approveformyorg -o orderer.${DOMAIN_NAME}.com:7050 --ordererTLSHostnameOverride orderer.${DOMAIN_NAME}.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CHAINCODE_NAME} --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${SEQUENCE}  >&log.txt
cat log.txt 

setGlobals 2 0

peer lifecycle chaincode approveformyorg -o orderer.${DOMAIN_NAME}.com:7050 --ordererTLSHostnameOverride orderer.${DOMAIN_NAME}.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CHAINCODE_NAME} --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${SEQUENCE}  >&log.txt
cat log.txt 


ORGAPPROVAL=$(peer lifecycle chaincode checkcommitreadiness -o orderer.example.com:7050 --channelID ${CHANNEL_NAME} --tls --cafile $ORDERER_CA --name ${CHAINCODE_NAME} --version ${VERSION} --init-required --sequence ${SEQUENCE} --output json | jq -r '.approvals') 


ORG1APPROVAL=$(echo $ORGAPPROVAL | jq -r --arg key "$ORG1_MSP" '.[$key]')
ORG2APPROVAL=$(echo $ORGAPPROVAL | jq -r --arg key "$ORG2_MSP" '.[$key]')

if [ "$ORG1APPROVAL" = true ] ; then
	if [ "$ORG2APPROVAL" = true ] ; then
	    peer lifecycle chaincode commit -o orderer.${DOMAIN_NAME}.com:7050 --ordererTLSHostnameOverride orderer.${DOMAIN_NAME}.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CHAINCODE_NAME} $PEER_CONN_PARMS --version ${VERSION} --sequence ${SEQUENCE} --init-required >&log.txt
	    cat log.txt

	fi

fi

setGlobals 1 0

peer chaincode invoke -o orderer.${DOMAIN_NAME}.com:7050 --ordererTLSHostnameOverride orderer.${DOMAIN_NAME}.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CHAINCODE_NAME} $PEER_CONN_PARMS --isInit -c '{"function":"Init","Args":[]}' >&log.txt
cat log.txt


