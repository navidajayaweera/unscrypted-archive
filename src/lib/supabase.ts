import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hlzuylwvhgpnxagciolk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsenV5bHd2aGdwbnhhZ2Npb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1OTk5ODYsImV4cCI6MjA5NTE3NTk4Nn0.9gQA686edazLsob3XklGPIuyg0br-hqGsxrNBw5zB2M"

export const supabase = createClient(supabaseUrl, supabaseKey)