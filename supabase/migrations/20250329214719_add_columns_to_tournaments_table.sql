ALTER TABLE tournaments
ADD COLUMN format text NOT NULL DEFAULT 'single_elimination',
  ADD COLUMN scoring_type text NOT NULL DEFAULT 'single',
  ADD COLUMN best_of integer,
  ADD COLUMN start_date timestamp with time zone,
  ADD COLUMN end_date timestamp with time zone,
  ADD COLUMN join_type text NOT NULL DEFAULT 'open';