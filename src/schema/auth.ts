import { z } from "zod";

const baseUserSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3, "Username must be at least 3 characters"),
});

const passwordFields = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
	confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = baseUserSchema.extend({
	...passwordFields.shape,
});

export const loginSchema = baseUserSchema.omit({ username: true }).extend({
	...passwordFields.shape,
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;
export type SignupSchemaValues = z.infer<typeof signupSchema>;

// Example usage:
//  const passwordMatchSchema = passwordFields.refine(
//  	(data) => data.password === data.confirmPassword,
//  	{
//  		message: "Passwords do not match",
//  	},
//  );
// const signupData = {
// 	email: "test@example.com",
// 	username: "user",
// 	password: "password",
// 	confirmPassword: "password",
// };
// const parsedSignup = signupSchema.parse(signupData);
// passwordMatchSchema.parse({
// 	password: parsedSignup.password,
// 	confirmPassword: parsedSignup.confirmPassword,
// }); // Throws error if passwords don't match
// const loginData = {
// 	email: "test@example.com",
// 	password: "password",
// 	confirmPassword: "password",
// };
// const parsedLogin = loginSchema.parse(loginData);
// passwordMatchSchema.parse({
// 	password: parsedLogin.password,
// 	confirmPassword: parsedLogin.confirmPassword,
// });
