// NOTE: Good reference for Zod schemas with CRUD schemas ‼
// https://github.com/TanStack/router/blob/main/examples/react/start-trellaux/src/db/schema.ts

import { TOURNAMENT_CATEGORIES } from "@/constants/data";
import { z } from "zod";

export const tournamentCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Must be less than 100 characters"),
  description: z.string().max(500, "Must be less than 500 characters"),
  max_participants: z
    .number()
    .min(2, "Must have at least 2 participants")
    .max(100, "Maximum 100 participants"),
  registration_open: z.boolean(),
  category: z.union([
    z.enum(TOURNAMENT_CATEGORIES, {
      errorMap: () => ({ message: "Please select a valid category" }),
    }),
    z.string().min(1, "Please select a category"),
  ]),
  format: z.enum([
    "single_elimination",
    "double_elimination",
    "round_robin",
  ] as const),
  scoring_type: z.enum(["single", "best_of"] as const),
  best_of: z.union([
    z.literal(null),
    z.union([z.literal(3), z.literal(5), z.literal(7)]),
  ]),
  start_date: z.union([z.literal(null), z.string()]),
  end_date: z.union([z.literal(null), z.string()]),
  join_type: z.enum(["open", "approval", "invite"] as const),
});

export type TournamentCreateSchemaValues = z.infer<
  typeof tournamentCreateSchema
>;
