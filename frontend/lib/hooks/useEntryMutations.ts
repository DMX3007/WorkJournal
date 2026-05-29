'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { journalEntriesApi, type JournalEntryInput } from '../api/journal-entries';
import { ApiClientError } from '../api/client';
import { journalEntriesKeys } from './useJournalEntries';

function describeError(err: unknown): string {
    if (err instanceof ApiClientError) return err.message;
    if (err instanceof Error) return err.message;
    return 'Неизвестная ошибка';
}

export function useCreateEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: JournalEntryInput) => journalEntriesApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: journalEntriesKeys.all });
            toast.success('Запись создана');
        },
        onError: (err) => toast.error(describeError(err)),
    });
}

export function useUpdateEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<JournalEntryInput> }) =>
            journalEntriesApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: journalEntriesKeys.all });
            toast.success('Запись обновлена');
        },
        onError: (err) => toast.error(describeError(err)),
    });
}

export function useDeleteEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => journalEntriesApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: journalEntriesKeys.all });
            toast.success('Запись удалена');
        },
        onError: (err) => toast.error(describeError(err)),
    });
}