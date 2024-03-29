import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { Gateway } from 'fabric-network';
import { Game, Bet } from './interfaces/game.interface';
import { GameDTO, VeredictDTO, BoardDTO } from './interfaces/hold-em-game-dto.interface';

import { QueueService } from './queue/queue.service';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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
        private readonly configuration: ConfigService,
        private readonly queue: QueueService) {

    }
    
    async tokens(userId: string){
  
      console.log('Tokens called');
      
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
  
      const result = await contract.evaluateTransaction(
          'User',
          userId
      );

      await gateway.disconnect();

      return result;
    }
  
    async cashIn(userId: string, amount: string){
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
  
      const result = await contract.submitTransaction(
          'CashIn',
          userId,
          amount
      );

      await gateway.disconnect();

      return result;
    }
  
    /*
	async create(game: GameDTO) {
    // mentalPoker

    const CARD_COUNT = 52

    var board = new BoardDTO();

    var config = mentalPoker.createConfig(CARD_COUNT);
    console.log('\n# Card codeword fragments of players\n');


    var players = Array(...Array(game.players.length)).map(() => mentalPoker.createPlayer(config));

    board.nextCard = 0;
    board.cardCodewords = mentalPoker.createDeck(players.map(player => player.cardCodewordFragments));
    board.deck  = board.cardCodewords;
    
    console.log('\n# Card codewords of the game\n');

    console.log('\n# Deck shuffling\n');
    players.forEach((player) => {
      console.log('Shuffling deck');
      const encryptedDeck = mentalPoker.encryptDeck(shuffle(board.deck), player.keyPairs[CARD_COUNT].privateKey);
      board.deck = encryptedDeck;
    });

    console.log('\n# Deck locking\n');
    players.forEach((player) => {
      console.log('Locking deck');
      const encryptedDeck = mentalPoker.encryptDeck(
        mentalPoker.decryptDeck(board.deck, player.keyPairs[CARD_COUNT].privateKey),
        player.keyPairs.map(keyPair => keyPair.privateKey),
      );

      board.deck = encryptedDeck;

    });

    game.board = board;

    for(var i = 0; i<game.players.length; ++i){
      game.players[i].keyPairs = players[i].keyPairs;
    }

    for(var i = 0; i<game.board.cardCodewords.length; ++i){
      game.board.cardCodewords[i] = game.board.cardCodewords[i].toString('base64');
    }

    for(var i = 0; i<game.players.length; ++i){
      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKey = game.players[i].keyPairs[j].privateKey.toString('base64');

        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKey;

      }
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = game.board.deck[i].toString('base64');
    }

    
    // console.log(game);

    // for(var i = 0; i<game.players.length; ++i){
    //   console.log(game.players[i].keyPairs);
      
    // }

    const gameDTO : GameDTO = JSON.parse(JSON.stringify(game));

    // console.log('Game DTO');
    // console.log(gameDTO);

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

    const result = await contract.submitTransaction(
        'Create',
        'hold-em',
        JSON.stringify(game)
    );

    await gateway.disconnect();

    return result;

  }*/

  async createDeal(game: GameDTO, amount: number) {
    // mentalPoker

    const CARD_COUNT = 52

    var board = new BoardDTO();

    var config = mentalPoker.createConfig(CARD_COUNT);
    console.log('\n# Card codeword fragments of players\n');


    var players = Array(...Array(game.players.length)).map(() => mentalPoker.createPlayer(config));

    board.nextCard = 0;
    board.cardCodewords = mentalPoker.createDeck(players.map(player => player.cardCodewordFragments));
    board.deck  = board.cardCodewords;
    
    console.log('\n# Card codewords of the game\n');

    console.log('\n# Deck shuffling\n');
    players.forEach((player) => {
      console.log('Shuffling deck');
      const encryptedDeck = mentalPoker.encryptDeck(shuffle(board.deck), player.keyPairs[CARD_COUNT].privateKey);
      board.deck = encryptedDeck;
    });

    console.log('\n# Deck locking\n');
    players.forEach((player) => {
      console.log('Locking deck');
      const encryptedDeck = mentalPoker.encryptDeck(
        mentalPoker.decryptDeck(board.deck, player.keyPairs[CARD_COUNT].privateKey),
        player.keyPairs.map(keyPair => keyPair.privateKey),
      );

      board.deck = encryptedDeck;

    });

    game.board = board;

    for(var i = 0; i<game.players.length; ++i){
      game.players[i].keyPairs = players[i].keyPairs;
    }

    for(var i = 0; i<game.board.cardCodewords.length; ++i){
      game.board.cardCodewords[i] = game.board.cardCodewords[i].toString('base64');
    }

    for(var i = 0; i<game.players.length; ++i){
      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKey = game.players[i].keyPairs[j].privateKey.toString('base64');

        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKey;

      }
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = game.board.deck[i].toString('base64');
    }

    
    // console.log(game);

    // for(var i = 0; i<game.players.length; ++i){
    //   console.log(game.players[i].keyPairs);
      
    // }

    /////////////////////// QUEUE UP

    var gameData = { identity: "", method: "", game: "", value: ""};

    gameData.identity = "admin";
    gameData.method = "Create";
    gameData.game = "hold-em";
    gameData.value = JSON.stringify(game);

    this.queue.add("queue", gameData);


    ///////////////////// DEAL CARDS

    const gameDTO : GameDTO = JSON.parse(JSON.stringify(game));


    // console.log('Game DTO');
    // console.log(gameDTO);

    var board = game.board;

    for(var i = 0; i<game.players.length; ++i){
      console.log('Decoding keypair');

      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKeyBuffer = new Buffer(game.players[i].keyPairs[j].privateKey, 'base64');        
        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKeyBuffer;
      }
    }

    for(var i = 0; i<board.cardCodewords.length; ++i){
      const cardCodewordBuffer = new Buffer(board.cardCodewords[i], 'base64');        

      board.cardCodewords[i] = cardCodewordBuffer;
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      const deckBuffer = new Buffer(game.board.deck[i], 'base64');        

      game.board.deck[i] = deckBuffer;
    }

    console.log('Decrypting card');
    console.log('Next card');

    console.log(game.board.nextCard);



    let cards = {data: []};

    for(var i = 0; i<amount; ++i){

        const cardDecrypted = mentalPoker.decryptCard(
          game.board.deck[game.board.nextCard],
          game.players.map(player => player.keyPairs[game.board.nextCard].privateKey),
        );
    
        console.log('Card decrypted');
        const codewordIndex = game.board.cardCodewords.findIndex(cardCodeword => cardCodeword.equals(cardDecrypted));
    
        game.board.nextCard++;


        console.log('Codeword index:', codewordIndex, '\n');

        let card = {
          "card":codewordIndex
        }

        cards.data.push(card);


    }


    // encode game

    for(var i = 0; i<game.board.cardCodewords.length; ++i){
      game.board.cardCodewords[i] = game.board.cardCodewords[i].toString('base64');
    }

    for(var i = 0; i<game.players.length; ++i){
      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKey = game.players[i].keyPairs[j].privateKey.toString('base64');

        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKey;

      }
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = game.board.deck[i].toString('base64');
    }

    // submit game again

    var cardsData = { identity: "", method: "", game: "", value: ""};

    cardsData.identity = "admin"
    cardsData.method = "SetGame";
    cardsData.game = "hold-em";
    cardsData.value = JSON.stringify(game);

    this.queue.add("queue", cardsData);

    return cards;
  }


  /*
  async dealCard(gameId: string, amount: number){
 
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
    
    var board = game.board;

    for(var i = 0; i<game.players.length; ++i){
      console.log('Decoding keypair');

      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKeyBuffer = new Buffer(game.players[i].keyPairs[j].privateKey, 'base64');        
        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKeyBuffer;
      }
    }

    for(var i = 0; i<board.cardCodewords.length; ++i){
      const cardCodewordBuffer = new Buffer(board.cardCodewords[i], 'base64');        

      board.cardCodewords[i] = cardCodewordBuffer;
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      const deckBuffer = new Buffer(game.board.deck[i], 'base64');        

      game.board.deck[i] = deckBuffer;
    }

    console.log('Decrypting card');
    console.log('Next card');

    console.log(game.board.nextCard);



    let cards = {data: []};

    for(var i = 0; i<amount; ++i){

        const cardDecrypted = mentalPoker.decryptCard(
          game.board.deck[game.board.nextCard],
          game.players.map(player => player.keyPairs[game.board.nextCard].privateKey),
        );
    
        console.log('Card decrypted');
        const codewordIndex = game.board.cardCodewords.findIndex(cardCodeword => cardCodeword.equals(cardDecrypted));
    
        game.board.nextCard++;


        console.log('Codeword index:', codewordIndex, '\n');

        let card = {
          "card":codewordIndex
        }

        cards.data.push(card);


    }


    // encode game

    for(var i = 0; i<game.board.cardCodewords.length; ++i){
      game.board.cardCodewords[i] = game.board.cardCodewords[i].toString('base64');
    }

    for(var i = 0; i<game.players.length; ++i){
      for(var j = 0; j<game.players[i].keyPairs.length; ++j){
        const privateKey = game.players[i].keyPairs[j].privateKey.toString('base64');

        game.players[i].keyPairs[j] = {}
        game.players[i].keyPairs[j].privateKey = privateKey;

      }
    }

    for(var i = 0; i<game.board.deck.length; ++i){
      game.board.deck[i] = game.board.deck[i].toString('base64');
    }

    // submit game again

    await contract.submitTransaction(
      'SetGame', 
      'hold-em',
      JSON.stringify(game)
    );

    await gateway.disconnect();

    return cards;
  }*/

  async play(bet: Bet) {
    var serverIdentity = bet.playerId;

    if(bet.cpu){
      serverIdentity = 'admin';
    }
    
    var gameData = { identity: "", method: "", game: "", value: ""};

    gameData.identity = serverIdentity;
    gameData.method = "Play";
    gameData.game = "hold-em";
    gameData.value = JSON.stringify(bet);

    this.queue.add("queue", gameData);

    return { status: "Correct", description: "Bet submitted"};
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

    const result =  await contract.submitTransaction(
        'Finish',
        'hold-em', 
        JSON.stringify(veredict)
    );

    await gateway.disconnect();

    return result;
  }

}