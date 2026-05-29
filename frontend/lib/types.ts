export interface WorkType {
    id: number;
    name: string;
    defaultUnit: string;
}

export interface JournalEntry {
    id: number;
    workDate: string;
    volume: number;
    unit: string;
    executorName: string;
    workType: WorkType;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    };
}

export interface JournalEntryFilters {
    dateFrom?: string;
    dateTo?: string;
    workTypeId?: number;
    page?: number;
    limit?: number;
    sort?: 'date_asc' | 'date_desc';
}

export interface ApiError {
    statusCode: number;
    error: string;
    message: string | string[];
    path: string;
    timestamp: string;
}