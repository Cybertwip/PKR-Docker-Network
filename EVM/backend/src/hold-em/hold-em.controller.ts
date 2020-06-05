import { Body, Controller, Post, Get, Res, Req, HttpStatus, UseGuards, NotAcceptableException } from '@nestjs/common';
import { GameDTO, BetDTO, VeredictDTO, BoardDTO } from './interfaces/hold-em-game-dto.interface';
import { HoldEmService } from './hold-em.service';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { IsString, IsNumber } from 'class-validator'
import { BetAction, PlayerStatus } from './interfaces/game.interface';
import { plainToClass } from 'class-transformer';

import { ClaimVerifyResult } from './../auth/jwt.verify'

class UserDataDTO{
    @IsString()
    readonly id: string
}

class CashInDTO{
    @IsString()
    readonly userId: string
    readonly amount: number
}
  
class TestDTO {
    @IsString()
    readonly id: string

    @IsString()
    readonly type: string
}

class RawGameDTO{
    @IsString()
    readonly data: string
}

class RawBetDTO{
    @IsString()
    readonly data: string
}

class RawDealDTO{
    @IsNumber()
    readonly gameId: number
}


@Controller('hold-em')
export class HoldEmController {

    constructor(private readonly holdEmService: HoldEmService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async create(@Body() gameBody: RawGameDTO) {

        var rawGameObject = JSON.parse(gameBody.data);

        var game : GameDTO = plainToClass(GameDTO, rawGameObject);

        console.log(game);

        var resultBuffer = await this.holdEmService.create(game);

        var resultJson = JSON.parse(resultBuffer.toString());

        return resultJson;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deal-card')
    async dealCard(@Body() dealBody: RawDealDTO) {

        const gameId = dealBody.gameId;

        var resultBuffer = await this.holdEmService.dealCard(gameId);

        var resultJson = JSON.parse(resultBuffer.toString());

        return resultJson;
    }



    @UseGuards(AuthGuard('jwt'))
    @Post('play')
    async play(@Body() betBody: RawBetDTO) {
        var rawBetObject = JSON.parse(betBody.data);

        var bet : BetDTO = plainToClass(BetDTO, rawBetObject);

        console.log(bet);

        var resultBuffer = await this.holdEmService.play(bet);

        var resultJson = JSON.parse(resultBuffer.toString());

        return resultJson;

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('finish')
    async finish(@Body() veredict: VeredictDTO) {
        var resultBuffer = await this.holdEmService.finish(veredict);

        var resultJson = JSON.parse(resultBuffer.toString());
        
        return resultJson;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('test')
    async test(@Body() testDTO: TestDTO,  @Res() response: Response){

        response.status(HttpStatus.OK).json(testDTO);

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('cash-in')
    async cashIn(@Body() data: CashInDTO, @Req() request){
        var cashInResponse = await this.holdEmService.cashIn(data.userId, data.amount);
        var cashIn = JSON.parse(cashInResponse.toString());

        return cashIn;
    }    

    @UseGuards(AuthGuard('jwt'))
    @Post('user')
    async username(@Body() data: UserDataDTO, @Req() request){
        var buffer = await this.holdEmService.tokens(data.id);

        const fabricUserWithTokens = JSON.parse(buffer.toString());

        console.log(fabricUserWithTokens);

        var requestUser = request.user;
        
        var returnUser = {id: '', username: '', email: '', tokens: 0}

        returnUser.id = requestUser.id;
        returnUser.username = requestUser.username;

        if(requestUser.email){
            returnUser.email = requestUser.email;
        }

        returnUser.tokens = parseInt(fabricUserWithTokens.tokens.toString());

        return returnUser;
    }

}
