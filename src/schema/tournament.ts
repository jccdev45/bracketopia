import { z } from "zod";

export const tournamentCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),
  description: z
    .string()
    .optional()
    .default(""),
  max_participants: z
    .number()
    .min(2, "Must have at least 2 participants")
    .max(100, "Maximum 100 participants"),
  registration_open: z
    .boolean()
    .default(true),
});

export type TournamentCreateSchemaValues = z.infer<
  typeof tournamentCreateSchema
>;
