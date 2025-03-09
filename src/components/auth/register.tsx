import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { signupSchema } from "@/schema/auth";
import { signupFn } from "@/utils/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function Register() {
	const router = useRouter();
	const signupMutation = useMutation({
		mutationFn: signupFn,
		onSuccess: async (ctx) => {
			if (!ctx?.error) {
				await router.invalidate();
				router.navigate({ to: "/" });
			}
		},
		onError: (error) => {
			toast.error(`Network error: ${error.message}`);
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			username: "",
		},
		validators: { onBlur: signupSchema },
		onSubmit: ({ value }) => {
			signupMutation.mutate({ data: value });
		},
	});

	return (
		<div className="flex items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Login
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit}>
						<form.AppField name="username">
							{(field) => (
								<field.TextField label="Username" placeholder="coolguy123" />
							)}
						</form.AppField>
						<form.AppField name="email">
							{(field) => (
								<field.TextField
									label="Email"
									type="email"
									placeholder="your@email.com"
								/>
							)}
						</form.AppField>
						<form.AppField name="password">
							{(field) => (
								<field.TextField
									label="Password"
									type="password"
									placeholder="******"
								/>
							)}
						</form.AppField>
						<form.AppField name="confirmPassword">
							{(field) => (
								<field.TextField
									label="Confirm Password"
									type="password"
									placeholder="******"
								/>
							)}
						</form.AppField>
					</form>
				</CardContent>
				<CardFooter>
					<form.AppForm>
						<form.SubscribeButton
							label="Register"
							type="submit"
							disabled={signupMutation.status === "pending"}
						/>
					</form.AppForm>
				</CardFooter>
			</Card>
		</div>
	);
}
