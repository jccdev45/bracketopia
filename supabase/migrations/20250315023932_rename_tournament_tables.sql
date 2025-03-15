-- Rename tables
ALTER TABLE public.tournament_participants
  RENAME TO participants;
ALTER TABLE public.tournament_moderators
  RENAME TO moderators;
ALTER TABLE public.tournament_matches
  RENAME TO matches;
ALTER TABLE public.tournament_brackets
  RENAME TO brackets;
-- Update foreign key constraints (MOST IMPORTANT PART!)
-- 1. Constraints on 'participants' table:
ALTER TABLE public.participants DROP CONSTRAINT IF EXISTS tournament_participants_tournament_id_fkey,
  ADD CONSTRAINT participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
ALTER TABLE public.participants DROP CONSTRAINT IF EXISTS tournament_participants_user_id_fkey1,
  ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;
-- 2. Constraints on 'moderators' table:
ALTER TABLE public.moderators DROP CONSTRAINT IF EXISTS tournament_moderators_tournament_id_fkey,
  ADD CONSTRAINT moderators_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
ALTER TABLE public.moderators DROP CONSTRAINT IF EXISTS tournament_moderators_user_id_fkey1,
  -- Corrected constraint name
ADD CONSTRAINT moderators_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) -- Corrected reference
  ON DELETE CASCADE;
-- 3. Constraints on 'matches' table:
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS tournament_matches_tournament_id_fkey,
  ADD CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS tournament_matches_bracket_id_fkey,
  ADD CONSTRAINT matches_bracket_id_fkey FOREIGN KEY (bracket_id) REFERENCES public.brackets(id) ON DELETE CASCADE;
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS tournament_matches_participant1_id_fkey,
  ADD CONSTRAINT matches_participant1_id_fkey FOREIGN KEY (participant1_id) REFERENCES public.participants(id);
-- Use new table name
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS tournament_matches_participant2_id_fkey,
  ADD CONSTRAINT matches_participant2_id_fkey FOREIGN KEY (participant2_id) REFERENCES public.participants(id);
-- Use new table name
ALTER TABLE public.matches DROP CONSTRAINT IF EXISTS tournament_matches_winner_id_fkey,
  ADD CONSTRAINT matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.participants(id);
-- Use new table name
-- 4. Constraints on 'brackets' table:
ALTER TABLE public.brackets DROP CONSTRAINT IF EXISTS tournament_brackets_tournament_id_fkey,
  ADD CONSTRAINT brackets_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
-- Update any views or functions that reference the old table names (if any)
-- Example (replace with your actual view/function names):
-- ALTER VIEW your_view_name RENAME TO new_view_name;
-- CREATE OR REPLACE FUNCTION your_function_name() ... (update references inside the function)
-- No function changes needed!
-- Update any sequences
ALTER SEQUENCE IF EXISTS public.tournament_participants_id_seq
RENAME TO participants_id_seq;
ALTER SEQUENCE IF EXISTS public.tournament_moderators_id_seq
RENAME TO moderators_id_seq;
ALTER SEQUENCE IF EXISTS public.tournament_matches_id_seq
RENAME TO matches_id_seq;
ALTER SEQUENCE IF EXISTS public.tournament_brackets_id_seq
RENAME TO brackets_id_seq;
-- Fix/Create the handle_new_user function and trigger (in the SAME migration)
-- This ensures everything is consistent.
-- 1. Drop the function if it exists (for safety)
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
-- 2. Create (or recreate) the function
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN
INSERT INTO public.profiles (id, username, avatar_url)
VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
RETURN NEW;
END;
$$;
-- 3. Drop the trigger if it exists (IMPORTANT!)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- 4. Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();