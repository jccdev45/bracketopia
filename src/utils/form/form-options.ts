import {
  TOURNAMENT_CATEGORIES,
  type TournamentCategory,
} from "@/constants/data";
import type {
  TournamentFormat,
  TournamentJoinType,
  TournamentScoringType,
} from "@/types/tournament.types";
import { formOptions } from "@tanstack/react-form";

const sharedOpts = {
  email: "",
  password: "",
};

export const signUpFormOpts = formOptions({
  defaultValues: {
    ...sharedOpts,
    username: "",
    confirmPassword: "",
  },
});

export const loginFormOpts = formOptions({
  defaultValues: sharedOpts,
});

export const authFormOpts = { ...loginFormOpts, ...signUpFormOpts };

export const addTournamentFormOpts = formOptions({
  defaultValues: {
    title: "",
    description: "",
    max_participants: 8,
    registration_open: true,
    category: TOURNAMENT_CATEGORIES[0] as TournamentCategory | string,
    format: "single_elimination" as TournamentFormat,
    scoring_type: "single" as TournamentScoringType,
    best_of: null as 3 | 5 | 7 | null,
    start_date: "" as string | null,
    end_date: "" as string | null,
    join_type: "open" as TournamentJoinType,
  },
});
