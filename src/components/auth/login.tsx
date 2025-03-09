import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/hooks/use-app-form";
import { loginSchema } from "@/schema/auth";
import { loginFn } from "@/utils/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function Login() {
	const router = useRouter();

	const loginMutation = useMutation({
		mutationFn: loginFn,
		onSuccess: async (ctx) => {
			if (!ctx?.error) {
				await router.invalidate();
				router.navigate({ to: "/" });
				return;
			}
		},
		onError: (error) => {
			toast.error(`There was an error: ${error.message}`);
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onBlur: loginSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			loginMutation.mutate({
				data: value,
			});
			toast("Form submitted successfully!");
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
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						<form.AppField
							name="email"
							children={(field) => {
								return (
									<field.TextField
										label="Email"
										type="email"
										placeholder="your@email.com"
									/>
								);
							}}
						/>
						<form.AppField
							name="password"
							children={(field) => {
								return (
									<field.TextField
										label="Password"
										type="password"
										placeholder="******"
									/>
								);
							}}
						/>
					</form>
				</CardContent>
				<CardFooter className="justify-end">
					<form.AppForm>
						<form.SubscribeButton
							label="Login"
							type="submit"
							disabled={loginMutation.status === "pending"}
						/>
					</form.AppForm>
				</CardFooter>
			</Card>
		</div>
	);
}
