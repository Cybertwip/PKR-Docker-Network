import { IsString, IsEnum, IsNumber, IsArray, IsBoolean } from 'class-validator'
import { Game, Bet, BetAction, Player, PlayerStatus, Veredict } from './game.interface'

export class GameDTO implements Game {
    @IsString()
    id: string

    @IsString()
    type: string

    @IsString()
    seed: string

    @IsNumber()
    pot: number

    @IsArray()
    bets: Bet[]

    @IsArray()
    players: Player[]
}

export class BetDTO implements Bet {
    @IsString()
    readonly id: string
    
    @IsString()
    readonly gameId: string

    @IsString()
    readonly playerId: string

    @IsEnum(BetAction)
    readonly action: BetAction

    @IsNumber()
    readonly amount: number

    @IsBoolean()
    readonly cpu: boolean
}

export class PlayerDTO implements Player{
    @IsString()
    readonly id: string

    @IsString()
    readonly key: string

    @IsEnum(PlayerStatus)
    status: PlayerStatus

    @IsBoolean()
    readonly cpu: boolean
}

export class VeredictDTO implements Veredict {
    @IsString()
    readonly gameId: string

    @IsString()
    readonly winnerId: string
}