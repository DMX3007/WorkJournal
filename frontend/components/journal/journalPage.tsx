'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { JournalFilters } from '@/components/journal/journalFilters';
import { JournalTable } from '@/components/journal/journalTable';
// import { EntryFormDialog } from './';
import { DeleteConfirmDialog } from './deleteConfirmDialog';
import { EmptyState } from './emptyState';

import { useJournalEntries } from '@/lib/hooks/useJournalEntries';
import { useDeleteEntry } from '@/lib/hooks/useEntryMutations';
import type { JournalEntry, JournalEntryFilters } from '@/lib/types';

const initialFilters: JournalEntryFilters = {
    page: 1,
    limit: 50,
    sort: 'date_desc',
};

export function JournalPage() {
    const [filters, setFilters] = useState<JournalEntryFilters>(initialFilters);
    const [deletingEntry, setDeletingEntry] = useState<JournalEntry | null>(null);

    const { data, isLoading, isError, error } = useJournalEntries(filters);
    const deleteMutation = useDeleteEntry();

    const confirmDelete = async () => {
        if (!deletingEntry) return;
        await deleteMutation.mutateAsync(deletingEntry.id);
        setDeletingEntry(null);
    };

    const toggleSort = () => setFilters((f) => ({
        ...f,
        sort: f.sort === 'date_desc' ? 'date_asc' : 'date_desc',
    }));

    return (
        <div className="max-w-6xl mx-auto py-6 px-4">
            <div className="rounded-lg border bg-card">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            Объект · ЖК «Северный»
                        </div>
                        <h1 className="text-lg font-medium">Журнал работ</h1>
                    </div>
                </div>

                <JournalFilters filters={filters} onChange={setFilters} />

                {isLoading && (
                    <div className="py-16 text-center text-sm text-muted-foreground">Загрузка…</div>
                )}

                {isError && (
                    <div className="py-16 text-center text-sm text-destructive">
                        Ошибка загрузки: {error instanceof Error ? error.message : 'неизвестная'}
                    </div>
                )}

                {data && data.data.length === 0 && (
                    <EmptyState
                        title="Записей пока нет"
                        description="Создайте первую запись — она появится в журнале."
                    />
                )}

                {data && data.data.length > 0 && (
                    <>
                        <JournalTable
                            entries={data.data}
                            sort={filters.sort ?? 'date_desc'}
                            onSortToggle={toggleSort}
                            onDelete={setDeletingEntry}
                        />
                        <div className="px-6 py-3 text-xs text-muted-foreground border-t">
                            Всего записей: <span className="tabular-nums">{data.meta.total}</span>
                        </div>
                    </>
                )}
            </div>

            <DeleteConfirmDialog
                open={!!deletingEntry}
                onOpenChange={(open) => !open && setDeletingEntry(null)}
                onConfirm={confirmDelete}
                isPending={deleteMutation.isPending}
            />
        </div>
    );
}