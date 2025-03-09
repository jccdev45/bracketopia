import { getSupabaseServerClient } from "@/integrations/supabase/server";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
	const supabase = await getSupabaseServerClient();
	const { data, error: _error } = await supabase.auth.getUser();

	if (!data.user?.email) {
		return null;
	}

	return data.user;
});

export const loginFn = createServerFn()
	.validator((d: { email: string; password: string }) => d)
	.handler(async ({ data }) => {
		const supabase = await getSupabaseServerClient();
		const { error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			return {
				error: true,
				message: error.message,
			};
		}
	});

export const signupFn = createServerFn()
	.validator(
		(d: unknown) =>
			d as { email: string; password: string; redirectUrl?: string },
	)
	.handler(async ({ data }) => {
		const supabase = await getSupabaseServerClient();
		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		});
		if (error) {
			return {
				error: true,
				message: error.message,
			};
		}

		// Redirect to the prev page stored in the "redirect" search param
		throw redirect({
			href: data.redirectUrl || "/",
		});
	});
