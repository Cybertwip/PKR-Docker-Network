#!/bin/bash
function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $6)
    local CP=$(one_line_pem $7)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${DOMAIN}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${P1PORT}/$4/" \
        -e "s/\${CAPORT}/$5/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $6)
    local CP=$(one_line_pem $7)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${DOMAIN}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${P1PORT}/$4/" \
        -e "s/\${CAPORT}/$5/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
}

ORG=$ORG1_NAME
P0PORT=7051
P1PORT=8051
CAPORT=7054
PEERPEM=crypto-config/peerOrganizations/${ORG}.${DOMAIN_NAME}.com/tlsca/tlsca.${ORG}.${DOMAIN_NAME}.com-cert.pem
CAPEM=crypto-config/peerOrganizations/${ORG}.${DOMAIN_NAME}.com/ca/ca.${ORG}.${DOMAIN_NAME}.com-cert.pem

echo "$(json_ccp $ORG $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org1.json
echo "$(yaml_ccp $ORG $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org1.yaml

ORG=$ORG2_NAME
P0PORT=9051
P1PORT=10051
CAPORT=8054
PEERPEM=crypto-config/peerOrganizations/${ORG}.${DOMAIN_NAME}.com/tlsca/tlsca.${ORG}.${DOMAIN_NAME}.com-cert.pem
CAPEM=crypto-config/peerOrganizations/${ORG}.${DOMAIN_NAME}.com/ca/ca.${ORG}.${DOMAIN_NAME}.com-cert.pem

echo "$(json_ccp $ORG $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org2.json
echo "$(yaml_ccp $ORG $DOMAIN_NAME $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-org2.yaml