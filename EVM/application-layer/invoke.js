/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'first-network', 'connection-org1.json');

        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

	console.log(wallet);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet: wallet, identity: 'appUser', discovery: { enabled: false, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('evm');

        // Get the contract from the network.
        const contract = network.getContract('evmpkr');

        // Submit the specified transactions.

	console.log(contract);

	console.log('submitting setEVMAddress');

        await contract.submitTransaction('setEVMAddress', 'http://172.31.10.189:5000');

        console.log('submitting setSCAddress');

	await contract.submitTransaction('setSCAddress', '0x7C772aE34234B8868cafB3785D319B606851aF82');

        console.log('Transactions have been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
	console.log("Error is");
	for(const innerError of error.errors){
	    console.log(innerError);
	}
	//console.log(error);
        process.exit(1);
    }
}

main();
