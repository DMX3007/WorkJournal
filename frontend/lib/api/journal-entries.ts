import { api } from './client';
import type { JournalEntry, JournalEntryFilters, PaginatedResponse } from '../types';

export interface JournalEntryInput {
    workDate: string;
    workTypeId: number;
    volume: number;
    unit: string;
    executorName: string;
}

export const journalEntriesApi = {
    list: (filters: JournalEntryFilters = {}) =>
        api<PaginatedResponse<JournalEntry>>('/journal-entries', {
            query: {
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                workTypeId: filters.workTypeId,
                page: filters.page,
                limit: filters.limit,
                sort: filters.sort,
            },
        }),

    create: (data: JournalEntryInput) =>
        api<JournalEntry>('/journal-entries', { method: 'POST', body: data }),

    update: (id: number, data: Partial<JournalEntryInput>) =>
        api<JournalEntry>(`/journal-entries/${id}`, { method: 'PATCH', body: data }),

    remove: (id: number) =>
        api<{ id: number; deleted: true }>(`/journal-entries/${id}`, { method: 'DELETE' }),
};