import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters long");

const signupSchema = z
	.object({
		username: z.string().min(3, "Username must be at least 3 characters long"),
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"], // This will attach the error to the confirmPassword field
	});

const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export { signupSchema, loginSchema };

export type SignupSchemaValues = z.infer<typeof signupSchema>;
export type LoginSchemaValues = z.infer<typeof loginSchema>;
