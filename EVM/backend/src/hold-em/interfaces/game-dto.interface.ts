import { IsString, IsEnum, IsNumber, IsArray, IsObject } from 'class-validator'
import { Game, Bet, BetAction, Player, PlayerStatus } from './game.interface'

export class GameDTO implements Game {
    @IsString()
    id: string

    @IsString()
    type: string

    @IsString()
    seed: string

    @IsObject()
    currentBet: Bet

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

    @IsString()
    readonly amount: string
}

export class PlayerDTO implements Player{
    @IsString()
    readonly id: string

    @IsString()
    readonly key: string

    @IsEnum(PlayerStatus)
    status: PlayerStatus
}