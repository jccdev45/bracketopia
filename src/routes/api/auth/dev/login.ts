import { createClient } from "@/integrations/supabase/server";
import { createAPIFileRoute } from "@tanstack/react-start/api";

const isDev = !!process && process.env.NODE_ENV === "development";

export const APIRoute = createAPIFileRoute("/api/auth/dev/login")({
  GET: async ({ request }) => {
    console.log("🚀 ~ GET: ~ request:", request);
    if (!isDev) {
      return Response.redirect("/");
    }

    const requestUrl = new URL(request.url);
    const email = requestUrl.searchParams.get("email");
    const password = requestUrl.searchParams.get("password");
    if (email && password) {
      const supabase = createClient();
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    return Response.redirect(requestUrl.origin);
  },
});
