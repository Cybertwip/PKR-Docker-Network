import { IsString, IsEnum, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator'
import { Game, Bet, BetAction, Player, PlayerStatus, Veredict, Board } from './game.interface'

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

    @IsObject()
    board: Board

    
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

    @IsEnum(PlayerStatus)
    status: PlayerStatus

    @IsBoolean()
    readonly cpu: boolean

    @IsArray()
    keyPairs: any[]
}

export class VeredictDTO implements Veredict {
    @IsString()
    readonly gameId: string

    @IsString()
    readonly winnerId: string
}

export class BoardDTO implements Board{
    nextCard: number
    cardCodewords: any[]
    deck: any[]
}
