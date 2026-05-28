import {
    IsDateString, IsIn, IsInt, IsNumber, IsPositive,
    IsString, MaxLength, MinLength, Min
} from 'class-validator';
import { Transform } from 'class-transformer';

export const ALLOWED_UNITS = ['м³', 'м²', 'шт', 'т', 'п.м.', 'кг'] as const;
export type Unit = typeof ALLOWED_UNITS[number];

export class CreateJournalEntryDto {
    @IsDateString({ strict: true })
    workDate: string;

    @IsInt() @Min(1)
    workTypeId: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    volume: number;

    @IsString() @IsIn(ALLOWED_UNITS)
    unit: Unit;

    @IsString() @MinLength(2) @MaxLength(120)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value)
    executorName: string;
}
