-- Make registration_open NOT NULL in the tournaments table
ALTER TABLE public.tournaments
ALTER COLUMN registration_open
SET NOT NULL;
-- Add a default value if it doesn't exist (optional but good practice)
-- This ensures existing rows without a value get a default.  Choose TRUE or FALSE.
ALTER TABLE public.tournaments
ALTER COLUMN registration_open
SET DEFAULT TRUE;
-- Or FALSE, if that's your desired default
-- It is very important to update any existing rows, so if there are null values
-- they get corrected now before setting the constraint.
UPDATE public.tournaments
SET registration_open = TRUE
where registration_open IS NULL;