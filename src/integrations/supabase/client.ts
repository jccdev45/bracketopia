import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./generated.types";

// const supabaseUrl = 'http://127.0.0.1:54321'

const SUPABASE_URL = "https://kidlbinekhuoqcqyupbn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZGxiaW5la2h1b3FjcXl1cGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjcwNDQsImV4cCI6MjA1NzA0MzA0NH0._gkD2i0tSXRgYRd2L-pGifyTCXrZesZ6hTiIg_A-uz0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
