import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lkcvifhjusdswkpcaait.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrY3ZpZmhqdXNkc3drcGNhYWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDUwNDgsImV4cCI6MjA5NzY4MTA0OH0.QABx2Md1XHpMNsoTN8X3jOttcj5iVI5gwIjdcLBUwhU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
