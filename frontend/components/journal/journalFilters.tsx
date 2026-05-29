'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useWorkTypes } from '@/lib/hooks/useWorkTypes';
import type { JournalEntryFilters } from '@/lib/types';

const ALL_TYPES = '__all__';

interface Props {
    filters: JournalEntryFilters;
    onChange: (filters: JournalEntryFilters) => void;
}

export function JournalFilters({ filters, onChange }: Props) {
    const { data: workTypes = [] } = useWorkTypes();

    const hasAny = filters.dateFrom || filters.dateTo || filters.workTypeId;

    return (
        <div className="flex flex-wrap items-end gap-3 px-6 py-3 border-b">
            <div className="grid gap-1">
                <span className="text-xs text-muted-foreground">Дата с</span>
                <Input
                    type="date"
                    value={filters.dateFrom ?? ''}
                    onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined, page: 1 })}
                    className="w-40"
                />
            </div>

            <div className="grid gap-1">
                <span className="text-xs text-muted-foreground">по</span>
                <Input
                    type="date"
                    value={filters.dateTo ?? ''}
                    onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined, page: 1 })}
                    className="w-40"
                />
            </div>

            <div className="grid gap-1">
                <span className="text-xs text-muted-foreground">Вид работ</span>
                <Select
                    value={filters.workTypeId ? String(filters.workTypeId) : ALL_TYPES}
                    onValueChange={(v) =>
                        onChange({ ...filters, workTypeId: v === ALL_TYPES ? undefined : Number(v), page: 1 })
                    }
                >
                    <SelectTrigger className="w-55">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_TYPES}>Все виды работ</SelectItem>
                        {workTypes.map((workType) => (
                            <SelectItem key={workType.id} value={String(workType.id)}>{workType.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasAny && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange({ page: 1, limit: filters.limit, sort: filters.sort })}
                >
                    Сбросить
                </Button>
            )}
        </div>
    );
}