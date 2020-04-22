#!/bin/bash

DOMAIN_NAME=pkrstudio

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $7)
    local CP=$(one_line_pem $8)
    sed -e "s/\${ORG_NAME_1}/$1/" \
        -e "s/\${ORG_NAME_2}/$2/" \
        -e "s/\${DOMAIN_NAME}/$3/" \
        -e "s/\${P0PORT}/$4/" \
        -e "s/\${P1PORT}/$5/" \
        -e "s/\${CAPORT}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $7)
    local CP=$(one_line_pem $8)
    sed -e "s/\${ORG_NAME_1}/$1/" \
        -e "s/\${ORG_NAME_2}/$2/" \
        -e "s/\${DOMAIN_NAME}/$3/" \
        -e "s/\${P0PORT}/$4/" \
        -e "s/\${P1PORT}/$5/" \
        -e "s/\${CAPORT}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
}

ORG=1
P0PORT=7051
P1PORT=8051
CAPORT=7054

ORG_NAME_1=Org1
ORG_NAME_2=org1

PEERPEM=crypto-config/peerOrganizations/${ORG_NAME_2}.${DOMAIN_NAME}.com/tlsca/tlsca.${ORG_NAME_2}.${DOMAIN_NAME}.com-cert.pem
CAPEM=crypto-config/peerOrganizations/${ORG_NAME_2}.${DOMAIN_NAME}.com/ca/ca.${ORG_NAME_2}.${DOMAIN_NAME}.com-cert.pem



echo "$(json_ccp $ORG_NAME_1 $ORG_NAME_2 $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org1.json
echo "$(yaml_ccp $ORG_NAME_1 $ORG_NAME_2 $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org1.yaml

ORG=2
P0PORT=9051
P1PORT=10051
CAPORT=8054

ORG_NAME_1=Org2
ORG_NAME_2=org2 

PEERPEM=crypto-config/peerOrganizations/${ORG_NAME_2}.${DOMAIN_NAME}.com/tlsca/tlsca.${ORG_NAME_2}.${DOMAIN_NAME}.com-cert.pem
CAPEM=crypto-config/peerOrganizations/${ORG_NAME_2}.${DOMAIN_NAME}.com/ca/ca.${ORG_NAME_2}.${DOMAIN_NAME}.com-cert.pem

echo "$(json_ccp $ORG_NAME_1 $ORG_NAME_2 $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org2.json
echo "$(yaml_ccp $ORG_NAME_1 $ORG_NAME_2 $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org2.yaml
