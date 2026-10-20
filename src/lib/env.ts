// Single place that reads Vite env vars; Jest swaps this file for src/__mocks__/env.ts
// because Jest can't parse import.meta.
export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
    apiUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? 'https://kika-api.vercel.app',
}
