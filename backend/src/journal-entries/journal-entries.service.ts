import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { ListJournalEntriesQuery } from './dto/list-journal-entries.query';
import { JournalEntryDto, toJournalEntryDto } from '../common/journalMapper';

export interface PaginatedJournalEntries {
    data: JournalEntryDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    };
}

@Injectable()
export class JournalEntriesService {
    constructor(private readonly prisma: PrismaService) { }

    async list(query: ListJournalEntriesQuery): Promise<PaginatedJournalEntries> {
        const { dateFrom, dateTo, workTypeId, page, limit, sort } = query;

        const where: Prisma.JournalEntryWhereInput = {
            workTypeId,
            workDate: {
                gte: dateFrom ? new Date(dateFrom) : undefined,
                lte: dateTo ? new Date(dateTo) : undefined,
            },
        };

        const orderBy: Prisma.JournalEntryOrderByWithRelationInput[] = [
            { workDate: sort === 'date_asc' ? 'asc' : 'desc' },
        ];

        const [total, rows] = await this.prisma.$transaction([
            this.prisma.journalEntry.count({ where }),
            this.prisma.journalEntry.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit || 0,
                take: limit || 0,
                include: { workType: true },
            }),
        ]);

        return {
            data: rows.map(toJournalEntryDto),
            meta: {
                total,
                page,
                limit,
                pageCount: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }

    async findOne(id: number): Promise<JournalEntryDto> {
        const entry = await this.prisma.journalEntry.findUnique({
            where: { id },
            include: { workType: true },
        });
        if (!entry) throw new NotFoundException('Запись не найдена');
        return toJournalEntryDto(entry);
    }

    async create(dto: CreateJournalEntryDto): Promise<JournalEntryDto> {
        await this.assertWorkTypeActive(dto.workTypeId);

        const created = await this.prisma.journalEntry.create({
            data: {
                workDate: new Date(dto.workDate),
                workTypeId: dto.workTypeId,
                volume: new Prisma.Decimal(dto.volume),
                unit: dto.unit,
                executorName: dto.executorName,
            },
            include: { workType: true },
        });

        return toJournalEntryDto(created);
    }

    async update(id: number, dto: UpdateJournalEntryDto): Promise<JournalEntryDto> {
        if (dto.workTypeId !== undefined) {
            await this.assertWorkTypeActive(dto.workTypeId);
        }

        const updated = await this.prisma.journalEntry.update({
            where: { id },
            data: {
                workTypeId: dto.workTypeId,
                unit: dto.unit,
                executorName: dto.executorName,
                ...(dto.workDate !== undefined && { workDate: new Date(dto.workDate) }),
                ...(dto.volume !== undefined && { volume: new Prisma.Decimal(dto.volume) }),
            },
            include: { workType: true },
        });

        return toJournalEntryDto(updated);
    }

    async remove(id: number): Promise<{ id: number; deleted: true }> {
        await this.prisma.journalEntry.delete({ where: { id } });
        return { id, deleted: true };
    }

    private async assertWorkTypeActive(workTypeId: number): Promise<void> {
        const workType = await this.prisma.workType.findUnique({
            where: { id: workTypeId },
            select: { id: true, isActive: true },
        });
        if (!workType) {
            throw new BadRequestException(`Тип работы с id ${workTypeId} не найден`);
        }
        if (!workType.isActive) {
            throw new BadRequestException(`Тип работы с id ${workTypeId} не активен`);
        }
    }
}