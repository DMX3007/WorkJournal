import { z } from 'zod';

export const ALLOWED_UNITS = ['м³', 'м²', 'шт', 'т', 'п.м.', 'кг'] as const;
export type Unit = (typeof ALLOWED_UNITS)[number];

export const journalEntrySchema = z.object({
    workDate: z
        .string()
        .min(1, 'Укажите дату')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты YYYY-MM-DD'),

    workTypeId: z
        .number({ error: 'Выберите вид работ' })
        .int()
        .positive('Выберите вид работ'),

    volume: z
        .number({ error: 'Укажите объём' })
        .positive('Объём должен быть положительным')
        .refine((n) => Number.isFinite(n) && Math.round(n * 100) === n * 100, {
            message: 'Не более 2 знаков после запятой',
        }),

    unit: z.enum(ALLOWED_UNITS, { error: () => ({ message: 'Выберите единицу измерения' }) }),

    executorName: z
        .string()
        .trim()
        .min(2, 'Минимум 2 символа')
        .max(120, 'Максимум 120 символов'),
});

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;