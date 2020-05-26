import { Body, Controller, Post, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { GameDTO, BetDTO } from './interfaces/game-dto.interface';
import { HoldEmService } from './hold-em.service';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';


import { IsString } from 'class-validator'

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
        return await this.holdEmService.bet(bet)
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
