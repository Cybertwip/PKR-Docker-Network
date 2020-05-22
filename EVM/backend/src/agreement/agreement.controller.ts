import { Body, Controller, Post } from '@nestjs/common';
import { AgreementDTO } from './interfaces/agreement-dto.interface';
import { AgreementService } from './agreement.service';

@Controller('agreement')
export class AgreementController {

    constructor(private readonly agreementService: AgreementService) {}

    @Post()
    async create(@Body() agreement: AgreementDTO) {
        return await this.agreementService.create(agreement)
    }
}
