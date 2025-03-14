import type { Database } from "@/integrations/supabase/generated.types";
import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

const SUPABASE_URL = process.env.LOCAL_SUPABASE_URL;
const ANON_KEY = process.env.LOCAL_SUPABASE_ANON_KEY;
// const ROLE_KEY = process.env.LOCAL_SUPABASE_ROLE_KEY;

// const SUPABASE_URL = process.env.REMOTE_SUPABASE_URL;
// const ANON_KEY = process.env.REMOTE_SUPABASE_ANON_KEY;

export function createClient() {
  return createServerClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: <biome annoying>
    SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <biome annoying>
    ANON_KEY!,
    {
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
    },
  );
}
