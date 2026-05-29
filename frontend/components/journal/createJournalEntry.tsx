'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { useWorkTypes } from '@/lib/hooks/useWorkTypes';
import { useCreateEntry, useUpdateEntry } from '@/lib/hooks/useEntryMutations';
import {
    journalEntrySchema,
    ALLOWED_UNITS,
    type JournalEntryFormValues,
} from '@/lib/validation/journal-entry.schema';
import type { JournalEntry } from '@/lib/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry?: JournalEntry | null;
}

const emptyValues: JournalEntryFormValues = {
    workDate: format(new Date(), 'yyyy-MM-dd'),
    workTypeId: 0,
    volume: 0,
    unit: 'м³',
    executorName: '',
};

export function CreateEntryDialog({ open, onOpenChange, entry }: Props) {
    const isEdit = !!entry;
    const { data: workTypes = [] } = useWorkTypes();
    const createMutation = useCreateEntry();
    const updateMutation = useUpdateEntry();

    const form = useForm<JournalEntryFormValues>({
        resolver: zodResolver(journalEntrySchema),
        values: entry ? {
            workDate: entry.workDate,
            workTypeId: entry.workType.id,
            volume: entry.volume,
            unit: entry.unit as JournalEntryFormValues['unit'],
            executorName: entry.executorName,
        } : emptyValues,
        mode: 'onBlur',
    });

    const onSubmit = form.handleSubmit(async (values) => {
        if (isEdit && entry) {
            await updateMutation.mutateAsync({ id: entry.id, data: values });
        } else {
            await createMutation.mutateAsync(values);
        }
        onOpenChange(false);
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-120">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Редактирование записи' : 'Новая запись'}</DialogTitle>
                    <DialogDescription>Зафиксируйте работы за день</DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="workDate">
                            Дата выполнения <span className="text-destructive">*</span>
                        </Label>
                        <Input id="workDate" type="date" {...form.register('workDate')} />
                        {form.formState.errors.workDate && (
                            <p className="text-xs text-destructive">{form.formState.errors.workDate.message}</p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="workTypeId">
                            Вид работ <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            control={form.control}
                            name="workTypeId"
                            render={({ field }) => (
                                <Select
                                    value={field.value ? String(field.value) : ''}
                                    onValueChange={(v) => field.onChange(Number(v))}
                                >
                                    <SelectTrigger id="workTypeId">
                                        <SelectValue placeholder="— Выберите вид работ —" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workTypes.map((wt) => (
                                            <SelectItem key={wt.id} value={String(wt.id)}>
                                                {wt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {form.formState.errors.workTypeId && (
                            <p className="text-xs text-destructive">{form.formState.errors.workTypeId.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-[1fr_120px] gap-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="volume">
                                Объём <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="volume"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                placeholder="24"
                                {...form.register('volume', { valueAsNumber: true })}
                            />
                            {form.formState.errors.volume && (
                                <p className="text-xs text-destructive">{form.formState.errors.volume.message}</p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="unit">Ед. изм.</Label>
                            <Controller
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={(v) => {
                                        const id = Number(v);
                                        field.onChange(id);
                                        if (!isEdit) {
                                            const wt = workTypes.find((w) => w.id === id);
                                            if (wt && ALLOWED_UNITS.includes(wt.defaultUnit as never)) {
                                                form.setValue('unit', wt.defaultUnit as JournalEntryFormValues['unit']);
                                            }
                                        }
                                    }}>
                                        <SelectTrigger id="unit">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ALLOWED_UNITS.map((u) => (
                                                <SelectItem key={u} value={u}>{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="executorName">
                            ФИО исполнителя <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="executorName"
                            placeholder="Иванов Андрей Сергеевич"
                            {...form.register('executorName')}
                        />
                        {form.formState.errors.executorName && (
                            <p className="text-xs text-destructive">{form.formState.errors.executorName.message}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Сохраняем…' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}