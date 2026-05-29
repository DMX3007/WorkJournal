'use client';

import { format, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { JournalEntry } from '@/lib/types';

interface Props {
    entries: JournalEntry[];
    sort: 'date_asc' | 'date_desc';
    onSortToggle: () => void;
    onDelete: (entry: JournalEntry) => void;
}

function formatVolume(value: number): string {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);
}

export function JournalTable({ entries, sort, onSortToggle, onDelete }: Props) {
    const SortIcon = sort === 'date_desc' ? ArrowDown : ArrowUp;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="text-left font-medium text-muted-foreground text-xs py-3 px-6 w-35">
                            <button onClick={onSortToggle} className="inline-flex items-center gap-1 hover:text-foreground">
                                Дата <SortIcon className="h-3 w-3" />
                            </button>
                        </th>
                        <th className="text-left font-medium text-muted-foreground text-xs py-3 px-3">Вид работ</th>
                        <th className="text-right font-medium text-muted-foreground text-xs py-3 px-3 w-30">Объём</th>
                        <th className="text-left font-medium text-muted-foreground text-xs py-3 px-3 w-50">Исполнитель</th>
                        <th className="w-25" />
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-6 text-muted-foreground tabular-nums">
                                {format(parseISO(entry.workDate), 'dd.MM.yyyy')}
                            </td>
                            <td className="py-3 px-3">{entry.workType.name}</td>
                            <td className="py-3 px-3 text-right tabular-nums">
                                {formatVolume(entry.volume)} {entry.unit}
                            </td>
                            <td className="py-3 px-3">{entry.executorName}</td>
                            <td className="py-3 px-3 text-right">
                                <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} aria-label="Удалить">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

