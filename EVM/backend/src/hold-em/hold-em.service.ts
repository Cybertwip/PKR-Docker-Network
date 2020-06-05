import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO, VeredictDTO, BoardDTO } from './interfaces/hold-em-game-dto.interface';

import { readFileSync } from 'fs';

import * as path from 'path';

var shuffle = require("lodash.shuffle");
var mentalPoker = require("mental-poker");

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

    console.log(game.players);
    console.log(players);

    board.cardCodewords = mentalPoker.createDeck(players.map(player => player.cardCodewordFragments));
    board.deck  = board.cardCodewords;
    
    console.log('\n# Card codewords of the game\n');
    //console.log(board.cardCodewords);

    console.log('\n# Deck shuffling\n');
    players.forEach((player) => {
      console.log('Shuffling deck');
      const encryptedDeck = mentalPoker.encryptDeck(shuffle(board.deck), player.keyPairs[CARD_COUNT].privateKey);
      board.deck = encryptedDeck;
      
      console.log('Encrypted deck');
      console.log(encryptedDeck);

      console.log('Board deck');
      console.log(board.deck);
    });

    console.log('\n# Deck locking\n');
    players.forEach((player) => {
      console.log('Locking deck');
      const encryptedDeck = mentalPoker.encryptDeck(
        mentalPoker.decryptDeck(board.deck, player.keyPairs[CARD_COUNT].privateKey),
        player.keyPairs.map(keyPair => keyPair.privateKey),
      );

      board.deck = encryptedDeck;

      console.log('Encrypted deck');
      console.log(encryptedDeck);

      console.log('Board deck');
      console.log(board.deck);

    });

    players.forEach((player) => {
      console.log('Player private key');
      console.log(player.keyPairs[CARD_COUNT].privateKey);
    })

    game.board = board;

    for(var i = 0; i<game.players.length; ++i){
      game.players[i].keyPairs = players[i].keyPairs;
    }

    for(var i = 0; i<game.board.cardCodewords.length; ++i){
      game.board.cardCodewords[i] = game.board.cardCodewords[i].toString();
    }

    for(var i = 0; i<game.players.length; ++i){
      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKey = game.players[i].keyPairs[j].privateKey.toString();

        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKey;

      }
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = game.board.deck[i].toString();
    }

    
    console.log(game);

    for(var i = 0; i<game.players.length; ++i){
      console.log(game.players[i].keyPairs);
      
    }

    const gameDTO : GameDTO = JSON.parse(JSON.stringify(game));

    console.log('Game DTO');
    console.log(gameDTO);

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

    var game : GameDTO = plainToClass(GameDTO, JSON.parse(rawGameObject.toString()));
    
    console.log(game);

    console.log('Players');
    console.log(game.players);

    console.log('Keypairs');
    
    game.players.forEach((player) =>{
      console.log(player.keyPairs);
    });

    var board = game.board;

    for(var i = 0; i<game.players.length; ++i){
      console.log('Decoding keypair');

      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKeyBuffer = Buffer.from(game.players[i].keyPairs[j].privateKey);        
        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKeyBuffer;
      }
    }

    for(var i = 0; i<board.cardCodewords.length; ++i){
      board.cardCodewords[i] = Buffer.from(board.cardCodewords[i]);
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = Buffer.from(game.board.deck[i]);
    }

    console.log('Decrypting card');
    console.log('Next card');

    console.log(game.board.nextCard);
    
    const cardDecrypted = mentalPoker.decryptCard(
      game.board.deck[game.board.nextCard],
      game.players.map(player => player.keyPairs[game.board.nextCard].privateKey),
    );

    console.log('Card decrypted');
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