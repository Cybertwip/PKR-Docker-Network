
export type Rules = {
    readonly humanReadable: string[]
    readonly machineReadable: any[]
}

export type Agreement = {
    readonly id: string
    readonly type: string
    readonly owner: string
    readonly rules: Rules
}