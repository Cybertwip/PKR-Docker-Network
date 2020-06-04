import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO, VeredictDTO } from './interfaces/hold-em-game-dto.interface';

import { readFileSync } from 'fs';

import * as path from 'path';


const configPath = path.join(__dirname, '..', '..', '..', 'connection-org1.json');


@Injectable()
export class HoldEmService {
    constructor(
        private readonly wallet: WalletService,
        private readonly configuration: ConfigService
    ) {

    }
    
    async tokens(userId: string){
  
      const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
      const serverIdentity = 'admin'

      const gateway = new Gateway()
      const configuration = readFileSync(networkConfigurationPath, 'utf8')

      await gateway.connect(
        JSON.parse(configuration),
        {
          identity: serverIdentity,
          wallet: this.wallet.self,
          discovery: { enabled: true, asLocalhost: false }
        }
      )

  
      const network = await gateway.getNetwork("pkr");
      const contract = network.getContract("pkrstudio");
  
      return await contract.evaluateTransaction(
          'User',
          userId
      );
    }
  
    async cashIn(userId: string, amount: number){
      const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
      const serverIdentity = 'admin'
    
      const gateway = new Gateway()
      const configuration = readFileSync(networkConfigurationPath, 'utf8')

      await gateway.connect(
        JSON.parse(configuration),
        {
          identity: serverIdentity,
          wallet: this.wallet.self,
          discovery: { enabled: true, asLocalhost: false }
        }
      )
  
      const network = await gateway.getNetwork("pkr");
      const contract = network.getContract("pkrstudio");
  
      return await contract.submitTransaction(
          'CashIn',
          userId,
          amount
      );
    }
    

	async create(game: GameDTO) {
    const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
    const serverIdentity = 'admin'; //this.configuration.get<string>('SERVER_IDENTITY')

    const gateway = new Gateway()
    const configuration = readFileSync(networkConfigurationPath, 'utf8')

    await gateway.connect(
      JSON.parse(configuration),
      {
        identity: serverIdentity,
        wallet: this.wallet.self,
        discovery: { enabled: true, asLocalhost: false }
      }
    )

    const network = await gateway.getNetwork("pkr");
    const contract = network.getContract("pkrstudio");

    return await contract.submitTransaction(
        'Create',
        'hold-em',
        JSON.stringify(game)
    );
    }

  async play(bet: Bet) {
    const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')

    var serverIdentity = bet.playerId;

    if(bet.cpu){
      serverIdentity = 'admin';
    }
    

    const gateway = new Gateway()
    const configuration = readFileSync(networkConfigurationPath, 'utf8')
    
    await gateway.connect(
      JSON.parse(configuration),
      {
        identity: serverIdentity,
        wallet: this.wallet.self,
        discovery: { enabled: true, asLocalhost: false }
      }
    );

    const network = await gateway.getNetwork("pkr");
    const contract = network.getContract("pkrstudio");

    return await contract.submitTransaction(
        'Play', 
        'hold-em',
        bet.amount,
        bet.playerId,
        bet.gameId,
        JSON.stringify(bet)
    );
  }

  async finish(veredict: VeredictDTO) {
    const networkConfigurationPath = configPath; //this.configuration.get<string>('NETWORK_CONFIGURATION_PATH')
    const serverIdentity = 'admin'; //this.configuration.get<string>('SERVER_IDENTITY')

    const gateway = new Gateway()
    const configuration = readFileSync(networkConfigurationPath, 'utf8')
    await gateway.connect(
      JSON.parse(configuration),
      {
        identity: serverIdentity,
        wallet: this.wallet.self,
        discovery: { enabled: true, asLocalhost: false }
      }
    );

    const network = await gateway.getNetwork("pkr");
    const contract = network.getContract("pkrstudio");

    return await contract.submitTransaction(
        'hold-em', 
        JSON.stringify(veredict)
    );
  }

}
