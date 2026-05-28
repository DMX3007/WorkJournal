import { Controller, Get } from '@nestjs/common';
import { WorkTypesService } from './work-types.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('work-types')
@Controller('work-types')
export class WorkTypesController {
    constructor(private readonly workTypesService: WorkTypesService) { }

    @Get()
    @ApiOperation({ summary: 'Список всех видов работ' })
    getWorkTypes() {
        return this.workTypesService.getWorkTypes();
    }
    @Get()
    @ApiOperation({ summary: 'Список активных видов работ для селекта в форме' })
    findAll() {
        return this.workTypesService.findAllActive();
    }
}
