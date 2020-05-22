export type Game = {
    readonly id: string
    readonly type: string
    readonly owner: string
}

export type Bet = {
	readonly id: string
	readonly gameId: string
	readonly playerId: string
	readonly amount: string
}

