import {
    IsDateString, IsIn, IsInt, IsNumber, IsPositive,
    IsString, MaxLength, MinLength, Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const ALLOWED_UNITS = ['м³', 'м²', 'шт', 'т', 'п.м.', 'кг'] as const;
export type Unit = typeof ALLOWED_UNITS[number];

export class CreateJournalEntryDto {
    @ApiProperty({ example: '2025-05-24', description: 'Дата выполнения работ (YYYY-MM-DD)' })
    @IsDateString({ strict: true })
    workDate!: string;

    @ApiProperty({ example: 1, description: 'ID вида работ из справочника' })
    @IsInt()
    @Min(1)
    workTypeId!: number;

    @ApiProperty({ example: 24.5, description: 'Объём, до 2 знаков после запятой' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    volume!: number;

    @ApiProperty({ example: 'м³', enum: ALLOWED_UNITS })
    @IsString()
    @IsIn(ALLOWED_UNITS as readonly string[])
    unit!: Unit;

    @ApiProperty({ example: 'Иванов Андрей Сергеевич' })
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
    )
    executorName!: string;
}
