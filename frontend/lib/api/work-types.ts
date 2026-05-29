import { api } from './client';
import type { WorkType } from '../types';

export const workTypesApi = {
    list: () => api<WorkType[]>('/work-types'),
};