ALTER TABLE base_clinic
  ADD COLUMN region VARCHAR(255);

#DOWN
  DROP COLUMN region;