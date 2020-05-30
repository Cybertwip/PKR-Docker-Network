import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { readFileSync } from 'fs';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO } from './interfaces/game-dto.interface';

@Injectable()
export class HoldEmService {
    constructor(
        private readonly wallet: WalletService,
        private readonly configuration: ConfigService
    ) {

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
    
        const network = await gateway.getNetwork("evm");
        const contract = network.getContract("evmpkr");
    
        await contract.submitTransaction(
            'createGame', 
            game.id,
            game.type
        )
    }

  async getGame(id: string){
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
    );

    const network = await gateway.getNetwork("evm");
    const contract = network.getContract("evmpkr");

    var gameString = await contract.evaluateTransaction(
        'getGame', 
        id
    );

    var gameObject = JSON.parse(gameString);

    if(gameObject.status == "found"){
      return gameObject.data;
    }
    else {
      throw new NotFoundException(gameObject, `Game with id ${id} was not found`);
    }
  }

  async setGame(game: GameDTO){
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
    );

    const network = await gateway.getNetwork("evm");
    const contract = network.getContract("evmpkr");

    await contract.submitTransaction(
        'setGame', 
        JSON.stringify(game)
    );
  }

  async bet(bet: Bet) {
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

      const network = await gateway.getNetwork("evm");
      const contract = network.getContract("evmpkr");

      await contract.submitTransaction(
          'bet', 
          bet.id,
          bet.playerId,
          bet.amount
      );
  }

  async finish(game: Game) {
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
  
      const network = await gateway.getNetwork("evm");
      const contract = network.getContract("evmpkr");
  
      await contract.submitTransaction(
          'finishGame', 
          game.id
      );
  }

}
