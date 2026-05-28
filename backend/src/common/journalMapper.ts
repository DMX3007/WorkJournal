import { JournalEntry, WorkType } from '@prisma/client';

export interface JournalEntryDto {
    id: number;
    workDate: string;
    volume: number;
    unit: string;
    executorName: string;
    workType: {
        id: number;
        name: string;
        defaultUnit: string;
    };
    createdAt: string;
    updatedAt: string;
}

type JournalEntryWithType = JournalEntry & { workType: WorkType };

export function toJournalEntryDto(entry: JournalEntryWithType): JournalEntryDto {
    return {
        id: entry.id,
        workDate: entry.workDate.toISOString().slice(0, 10),
        volume: Number(entry.volume),
        unit: entry.unit,
        executorName: entry.executorName,
        workType: {
            id: entry.workType.id,
            name: entry.workType.name,
            defaultUnit: entry.workType.defaultUnit,
        },
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
    };
}