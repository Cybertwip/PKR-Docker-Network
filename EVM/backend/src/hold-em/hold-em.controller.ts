import { Body, Controller, Post } from '@nestjs/common';
import { GameDTO, BetDTO } from './interfaces/game-dto.interface';
import { HoldEmService } from './hold-em.service';



@Controller('hold-em')
export class HoldEmController {

    constructor(private readonly holdEmService: HoldEmService) {}

    @Post()
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

}
