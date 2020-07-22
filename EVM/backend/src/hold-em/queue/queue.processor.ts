import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { WalletService } from '../../wallet/wallet.service';

import { Gateway } from 'fabric-network';

import * as path from 'path';

import { readFileSync } from 'fs';

const configPath = path.join(__dirname, '..', '..', '..', '..', 'connection-org1.json');


@Processor('queue')
export class QueueProcessor {

  private readonly logger = new Logger("Queue processor");

  constructor(private readonly wallet: WalletService){

  }
  
  @Process('queue')
  async handleSync(job: Job) {

    this.logger.debug('Start job...');

    this.logger.debug(job.data);

    var gameData = job.data;

    const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
    //const serverIdentity = 'admin'; //this.configuration.get<string>('SERVER_IDENTITY')

    const gateway = new Gateway()
    const configuration = readFileSync(networkConfigurationPath, 'utf8')

    await gateway.connect(
      JSON.parse(configuration),
      {
        identity: gameData.identity,
        wallet: this.wallet.self,
        discovery: { enabled: true, asLocalhost: false }
      }
    )

    const network = await gateway.getNetwork("pkr");
    const contract = network.getContract("pkrstudio");


    const result = await contract.submitTransaction(
        gameData.method,
        gameData.game,
        gameData.value
    );

    await gateway.disconnect();

    this.logger.debug('job completed');

  }
}