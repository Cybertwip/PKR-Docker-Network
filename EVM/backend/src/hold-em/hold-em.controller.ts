import { Body, Controller, Post, Get, Res, HttpStatus, UseGuards, NotAcceptableException } from '@nestjs/common';
import { GameDTO, BetDTO } from './interfaces/game-dto.interface';
import { HoldEmService } from './hold-em.service';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';


import { IsString } from 'class-validator'
import { BetAction, PlayerStatus } from './interfaces/game.interface';
import { plainToClass } from 'class-transformer';

class TestDTO {
    @IsString()
    readonly id: string

    @IsString()
    readonly type: string
}


@Controller('hold-em')
export class HoldEmController {

    constructor(private readonly holdEmService: HoldEmService) {}

    @Post('create')
    async create(@Body() game: GameDTO) {
        return await this.holdEmService.create(game)
    }

    @Post()
    async bet(@Body() bet: BetDTO) {

        var gameData =  plainToClass(GameDTO, await this.holdEmService.getGame(bet.gameId));

        switch(bet.action){
            case BetAction.SmallBlind:{
                if(gameData.bets.length != 0){
                    throw new NotAcceptableException();
                }
            }
            break;

            case BetAction.BigBlind:{
                var previousBet = gameData.bets[gameData.bets.length - 1];
                if(previousBet.action != BetAction.SmallBlind){
                    throw new NotAcceptableException();
                }
            }
            break;

            case BetAction.Abandon:{
                for(var i = 0; i<gameData.players.length; ++i){
                    if(gameData.players[i].id == bet.playerId){
                        gameData.players[i].status = PlayerStatus.Left;
                    }
                }
            }
            break;
            case BetAction.Skip:{
                var previousBet = gameData.bets[gameData.bets.length - 1];
                if(previousBet.action == BetAction.Normal || previousBet.action == BetAction.Rise){
                    throw new NotAcceptableException();
                }
            }
            break;

            case BetAction.Normal:{
                var previousBet = gameData.bets[gameData.bets.length - 1];
                if(previousBet.action == BetAction.Rise){
                    throw new NotAcceptableException();
                }
            }
            break;

        }

        gameData.bets.push(bet);

        return await this.holdEmService.setGame(gameData);
    }

    @Post()
    async finish(@Body() game: GameDTO) {
        return await this.holdEmService.finish(game)
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('test')
    async test(@Body() testDTO: TestDTO, @Res() response: Response){

        response.status(HttpStatus.OK).json(testDTO);

    }

}
