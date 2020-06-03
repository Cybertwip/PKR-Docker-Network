import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { readFileSync } from 'fs';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO, VeredictDTO } from './interfaces/hold-em-game-dto.interface';


@Injectable()
export class HoldEmService {
    constructor(
        private readonly wallet: WalletService,
        private readonly configuration: ConfigService
    ) {

    }
    
  async tokens(userId: string){
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
            discovery: { enabled: true, asLocalhost: false }
          }
        )
    
        const network = await gateway.getNetwork("pkr");
        const contract = network.getContract("pkrstudio");
    
        return await contract.submitTransaction(
            'User',
            userId
        );
  }

	async create(game: GameDTO) {
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
      );

      const network = await gateway.getNetwork("pkr");
      const contract = network.getContract("pkrstudio");

      return await contract.submitTransaction(
          'Play', 
          'hold-em',
          bet.amount,
          bet.playerId,
          JSON.stringify(bet)
      );
  }

  async finish(veredict: VeredictDTO) {
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
      );
  
      const network = await gateway.getNetwork("pkr");
      const contract = network.getContract("pkrstudio");
  
      return await contract.submitTransaction(
          'hold-em', 
          JSON.stringify(veredict)
      );
  }

}
