import { ArrayNotEmpty, ArrayUnique, IsArray, IsString, ValidateNested } from 'class-validator'
import { Rules, Agreement } from './agreement.interface'

export class RulesDTO implements Rules {
    @IsArray()
    @ArrayUnique()
    @ArrayNotEmpty()
    @IsString({ each: true })
    humanReadable: string[]

    @IsArray()
    @ArrayNotEmpty()
    machineReadable: any[]
}

export class AgreementDTO implements Agreement {
    @IsString()
    readonly id: string

    @IsString()
    readonly type: string

    @IsString()
    readonly owner: string

    @ValidateNested()
    readonly rules: RulesDTO
}