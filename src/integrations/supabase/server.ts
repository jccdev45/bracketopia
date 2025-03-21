import type { Database } from "@/integrations/supabase/generated.types";
import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

const SUPABASE_URL = process.env.LOCAL_SUPABASE_URL as string;
const ANON_KEY = process.env.LOCAL_SUPABASE_ANON_KEY as string;
// const ROLE_KEY = process.env.LOCAL_SUPABASE_ROLE_KEY as string

// const SUPABASE_URL = process.env.REMOTE_SUPABASE_URL as string
// const ANON_KEY = process.env.REMOTE_SUPABASE_ANON_KEY as string

export function createClient() {
  return createServerClient<Database>(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(parseCookies()).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookies) {
        for (const cookie of cookies) {
          setCookie(cookie.name, cookie.value);
        }
      },
    },
  });
}
