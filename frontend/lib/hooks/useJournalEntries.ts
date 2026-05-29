'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { journalEntriesApi } from '../api/journal-entries';
import type { JournalEntryFilters } from '../types';

export const journalEntriesKeys = {
    all: ['journal-entries'] as const,
    list: (filters: JournalEntryFilters) =>
        [...journalEntriesKeys.all, 'list', filters] as const,
};

export function useJournalEntries(filters: JournalEntryFilters = {}) {
    return useQuery({
        queryKey: journalEntriesKeys.list(filters),
        queryFn: () => journalEntriesApi.list(filters),
        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
}