import { Injectable } from '@nestjs/common';
import { Identity, Gateway, Network } from 'fabric-network';
import { WalletService } from '../wallet/wallet.service';
import * as path from 'path';
import * as fs from 'fs';

import { readFileSync } from 'fs';

const configPath = path.join(__dirname, '..', '..', '..', 'connection-org1.json');


@Injectable()
export class UsersService {
  constructor(private wallet: WalletService) {}

  async read(label: string): Promise<Identity> {
    return await this.wallet.get(label);
  }

  async create(user) {
    const { id } = user
    const properties = []
    await this.wallet.put(id, properties);
  }

  async enroll(crypto){

    const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
    const serverIdentity = 'admin'

    const gateway = new Gateway()
    const configuration = readFileSync(networkConfigurationPath, 'utf8')

    console.log('Connect to gateway');

    await gateway.connect(
      JSON.parse(configuration),
      {
        identity: serverIdentity,
        wallet: this.wallet.self,
        discovery: { enabled: true, asLocalhost: false }
      }
    )
    console.log('Getting network');

    const network = await gateway.getNetwork("pkr");

    console.log('Submiting');
    
    const contract = network.getContract("pkrstudio");
  
    const result = await contract.submitTransaction(
            'RegisterUser',
            JSON.stringify(crypto)
            );
            
    console.log('All done', JSON.parse(result.toString()));
  }
}
