export type Game = {
    id: string
    type: string
}

export enum BetAction {
	SmallBlind = 0,
	BigBlind,
	Abandon,
	Skip,
	Normal,
	Rise
}

export type Bet = {
	readonly id: string
	readonly gameId: string
	readonly playerId: string
	readonly action: BetAction
	readonly amount: string
}

export enum PlayerStatus {
	Playing = 0,
	Left
}

export type Player = {
	readonly id: string
	readonly key: string
	status: PlayerStatus
}

