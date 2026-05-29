'use client';

import { useState } from 'react';
import { JournalFilters } from '@/components/journal/journalFilters';
import { JournalTable } from '@/components/journal/journalTable';

import { useJournalEntries } from '@/lib/hooks/useJournalEntries';
import type { JournalEntryFilters } from '@/lib/types';

const initialFilters: JournalEntryFilters = {
    page: 1,
    limit: 1,
    sort: 'date_desc',
};

export function JournalPage() {
    const [filters, setFilters] = useState<JournalEntryFilters>(initialFilters);

    const { data, isLoading, isError, error } = useJournalEntries(filters);

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
                            Объект
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

                {data && data.data.length > 0 && (
                    <>
                        <JournalTable
                            entries={data.data}
                            sort={filters.sort ?? 'date_desc'}
                            onSortToggle={toggleSort}
                        />
                        <div className="px-6 py-3 text-xs text-muted-foreground border-t">
                            Всего записей: <span className="tabular-nums">{data.meta.total}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}