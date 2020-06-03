import { Body, Controller, Post, Get, Res, Req, HttpStatus, UseGuards, NotAcceptableException } from '@nestjs/common';
import { GameDTO, BetDTO, VeredictDTO } from './interfaces/hold-em-game-dto.interface';
import { HoldEmService } from './hold-em.service';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { IsString } from 'class-validator'
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

@Controller('hold-em')
export class HoldEmController {

    constructor(private readonly holdEmService: HoldEmService) {}

    @Post('create')
    async create(@Body() game: GameDTO) {
        return await this.holdEmService.create(game)
    }

    @Post('play')
    async play(@Body() bet: BetDTO) {
        return await this.holdEmService.play(bet);
    }

    @Post('finish')
    async finish(@Body() veredict: VeredictDTO) {
        return await this.holdEmService.finish(veredict)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('test')
    async test(@Body() testDTO: TestDTO,  @Res() response: Response){

        response.status(HttpStatus.OK).json(testDTO);

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('cash-in')
    async enroll(@Body() data: CashInDTO, @Req() request){
        return await this.holdEmService.cashIn(data.userId, data.amount);
    }    

    @UseGuards(AuthGuard('jwt'))
    @Post('user')
    async username(@Body() data: UserDataDTO, @Req() request){
        var fabricUserWithTokens = await this.holdEmService.tokens(data.id);

        console.log(fabricUserWithTokens);

        var requestUser = request.user;
        
        console.log(requestUser);

        requestUser.tokens = fabricUserWithTokens.tokens;

        return requestUser;
    }

}
