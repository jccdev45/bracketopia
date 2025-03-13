// NOTE: Good reference for Zod schemas with CRUD schemas ‼
// https://github.com/TanStack/router/blob/main/examples/react/start-trellaux/src/db/schema.ts

import { z } from "zod";

export const tournamentCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  max_participants: z
    .number()
    .min(2, "Must have at least 2 participants")
    .max(100, "Maximum 100 participants"),
  registration_open: z.boolean(),
});

export type TournamentCreateSchemaValues = z.infer<
  typeof tournamentCreateSchema
>;
