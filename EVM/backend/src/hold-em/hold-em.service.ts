import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO, VeredictDTO, BoardDTO } from './interfaces/hold-em-game-dto.interface';

import { readFileSync } from 'fs';

import * as path from 'path';

import * as shuffle from 'lodash.shuffle';
import * as mentalPoker from 'mental-poker';

const configPath = path.join(__dirname, '..', '..', '..', 'connection-org1.json');

import { plainToClass } from 'class-transformer';


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
    // mentalPoker

    const CARD_COUNT = 52

    var board = new BoardDTO();

    var config = mentalPoker.createConfig(CARD_COUNT);
    console.log('\n# Card codeword fragments of players\n');

    var players = Array(...Array(game.players.length)).map(() => mentalPoker.createPlayer(config));


    board.cardCodewords = mentalPoker.createDeck(players.map(player => player.cardCodewordFragments));
    board.deck  = board.cardCodewords;
    console.log('\n# Card codewords of the game\n');
    console.log(board.cardCodewords);

    console.log('\n# Deck shuffling\n');
    players.forEach((player) => {
      board.deck = mentalPoker.encryptDeck(shuffle(board.deck), player.keyPairs[CARD_COUNT].privateKey);
    });

    console.log('\n# Deck locking\n');
    players.forEach((player) => {
      board.deck = mentalPoker.encryptDeck(
        mentalPoker.decryptDeck(board.deck, player.keyPairs[CARD_COUNT].privateKey),
        player.keyPairs.map(keyPair => keyPair.privateKey),
      );
    });
  

    game.board = board;

    for(var i = 0; i<game.players.length; ++i){
      game.players[i].keyPairs = players[i].keyPairs;
    }
  
  
    
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

  async dealCard(gameId: number){
 
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

    var rawGameObject = await contract.evaluateTransaction(
        'GetGame',
        'hold-em',
        gameId
    );

    var game : GameDTO = plainToClass(GameDTO, rawGameObject);
    

    const cardDecrypted = mentalPoker.decryptCard(
      game.board.deck[game.board.nextCard],
      game.players.map(player => player.keyPairs[game.board.nextCard].privateKey),
    );

    const codewordIndex = game.board.cardCodewords.findIndex(cardCodeword => cardCodeword.equals(cardDecrypted));

    game.board.nextCard++;

    await contract.submitTransaction(
      'SetGame', 
      'hold-em',
      JSON.stringify(game)
    );


    console.log('Codeword index:', codewordIndex, '\n');

    var cardToSend = {
      "card":codewordIndex
    }
    
    console.log(cardToSend);

    return cardToSend;
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
        'Finish',
        'hold-em', 
        JSON.stringify(veredict)
    );
  }

}