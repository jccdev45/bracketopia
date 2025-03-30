-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can apply to tournaments" ON "public"."participants";
-- Create new insert policy that allows both tournament creators and self-registration
CREATE POLICY "Tournament creators and users can add participants" ON "public"."participants" FOR
INSERT WITH CHECK (
    -- Allow tournament creators to add any participant
    EXISTS (
      SELECT 1
      FROM tournaments t
      WHERE t.id = participants.tournament_id
        AND t.creator_id = auth.uid()
    )
    OR -- Allow users to add themselves
    (auth.uid() = participants.user_id)
  );
-- Note: Keeping other policies intact:
-- - "Participants are viewable by everyone" (SELECT)
-- - "Tournament creators and moderators can update participants" (UPDATE)
-- - "Users can update their own applications" (UPDATE)