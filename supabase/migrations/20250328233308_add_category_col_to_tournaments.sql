-- Add category column to tournaments table
ALTER TABLE tournaments
ADD COLUMN category TEXT NOT NULL DEFAULT 'General';