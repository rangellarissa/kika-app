import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Publishable key only: it is shipped to the browser. Writes go through kika-API.
export const supabase = createClient(env.supabaseUrl, env.supabaseKey)
