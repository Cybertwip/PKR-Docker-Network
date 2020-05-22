import { IsString } from 'class-validator'
import { Game, Bet } from './game.interface'

export class GameDTO implements Game {
    @IsString()
    readonly id: string

    @IsString()
    readonly type: string

    @IsString()
    readonly owner: string
}

export class BetDTO implements Bet {
    @IsString()
    readonly id: string
    
    @IsString()
    readonly gameId: string

    @IsString()
    readonly playerId: string

    @IsString()
    readonly amount: string
}