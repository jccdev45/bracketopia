import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/generated.types";

// Type for profiles
export type Profile = Tables<"profiles">;

// Insert types
export type ProfileInsert = TablesInsert<"profiles">;

// Update types
export type ProfileUpdate = TablesUpdate<"profiles">;
