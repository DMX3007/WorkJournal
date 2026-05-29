'use client';

import { useQuery } from '@tanstack/react-query';
import { workTypesApi } from '../api/work-types';

export function useWorkTypes() {
    return useQuery({
        queryKey: ['work-types'],
        queryFn: () => workTypesApi.list(),
        staleTime: 5 * 60_000,
    });
}