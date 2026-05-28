import { IsDateString, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListJournalEntriesQuery {
    @IsOptional() @IsDateString({ strict: true })
    dateFrom?: string;

    @IsOptional() @IsDateString({ strict: true })
    dateTo?: string;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    workTypeId?: number;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 50;

    @IsOptional() @IsIn(['date_asc', 'date_desc'])
    sort: 'date_asc' | 'date_desc' = 'date_desc';
}