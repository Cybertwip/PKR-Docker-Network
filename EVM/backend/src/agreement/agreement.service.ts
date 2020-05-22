import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Agreement } from './interfaces/agreement.interface';
import { Gateway } from 'fabric-network';
import { readFileSync } from 'fs';

@Injectable()
export class AgreementService {

    constructor(
        private readonly wallet: WalletService,
        private readonly configuration: ConfigService
    ) {}

    async create(agreement: Agreement) {
        const networkConfigurationPath = this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
        const serverIdentity = this.configuration.get<string>('SERVER_IDENTITY')
    
        await this.wallet.get(serverIdentity)
    
        const gateway = new Gateway()
        const configuration = readFileSync(networkConfigurationPath, 'utf8')
        await gateway.connect(
          JSON.parse(configuration),
          {
            identity: serverIdentity,
            wallet: this.wallet.self,
            discovery: { enabled: true, asLocalhost: true }
          }
        )
    
        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("agreement");
    
        await contract.submitTransaction(
            'createAgreement', 
            agreement.id,
            agreement.type,
            agreement.owner,
            agreement.rules.humanReadable,
            agreement.rules.machineReadable
        )
    }

}
