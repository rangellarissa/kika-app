import { env } from './env'
import { supabase } from './supabase'

export const API_URL = env.apiUrl

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

// Fetch wrapper for kika-API: adds the logged-in admin's token and parses JSON.
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    const headers = new Headers(options.headers)
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers })

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new ApiError(response.status, body.message ?? body.error ?? response.statusText)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json()
}
