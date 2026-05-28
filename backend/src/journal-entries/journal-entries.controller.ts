import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { ListJournalEntriesQuery } from './dto/list-journal-entries.query';

@ApiTags('journal-entries')
@Controller('journal-entries')
export class JournalEntriesController {
    constructor(private readonly service: JournalEntriesService) { }

    @Get()
    @ApiOperation({ summary: 'Список записей журнала с фильтрами и пагинацией' })
    list(@Query() query: ListJournalEntriesQuery) {
        return this.service.list(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить запись по id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Создать запись' })
    create(@Body() dto: CreateJournalEntryDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Обновить запись (partial)' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateJournalEntryDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Удалить запись' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}