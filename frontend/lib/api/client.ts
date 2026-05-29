import type { ApiError } from '../types';

export class ApiClientError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly body: ApiError | null,
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    query?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
    if (!query) return path;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    }
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
    const url = buildUrl(path, opts.query);

    console.log(url)

    const res = await fetch(url, {
        method: opts.method ?? 'GET',
        headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null) as ApiError | null;
        const msg = !body
            ? `HTTP ${res.status}`
            : Array.isArray(body.message) ? body.message.join('; ') : body.message;
        throw new ApiClientError(msg, res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}