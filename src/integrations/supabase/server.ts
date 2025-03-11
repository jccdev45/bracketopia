import type { Database } from "@/integrations/supabase/generated.types";
import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

export function createClient() {
  return createServerClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: <biome annoying>
    process.env.SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <biome annoying>
    process.env.SUPABASE_ANON_KEY!,
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
