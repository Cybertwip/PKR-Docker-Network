import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Gateway } from 'fabric-network';
import { readFileSync } from 'fs';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class DispersionsService {

  constructor(
    private readonly wallet: WalletService,
    private readonly configuration: ConfigService
  ) { }

  async create() {

    const networkConfigurationPath = this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
    const serverIdentity = this.configuration.get<string>('SERVER_IDENTITY')


    console.log("Network Configuration Path: " + networkConfigurationPath)

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
    const rules = network.getContract("dispag");
    const log = network.getContract("distran");

    return { message: 'ack' };
  }
}
