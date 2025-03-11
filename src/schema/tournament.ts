import { z } from "zod";

const tournamentCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  max_participants: z
    .number()
    .int("Max participants must be an integer")
    .min(2, "Minimum of 2 participants required")
    .max(100, "Maximum of 100 participants allowed"),
  registration_open: z.boolean().default(true),
});

export type TournamentCreateSchemaValues = z.infer<
  typeof tournamentCreateSchema
>;

export { tournamentCreateSchema };
