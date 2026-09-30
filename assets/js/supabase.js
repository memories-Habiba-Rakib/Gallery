// ========================================
// Supabase Configuration
// ========================================

const SUPABASE_URL = "https://hvjjpjqspokzobuykqyl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2ampwanFzcG9rem9idXlrcXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjcxMDMsImV4cCI6MjEwNjE0MzEwM30.QsTW0_K7hrwsvKnzMyjhumBFxOw_ErX-apoUalSwu5U";

// Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);