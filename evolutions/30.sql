ALTER TABLE form
  ADD COLUMN external_id VARCHAR(100);

#DOWN
ALTER TABLE form
  DROP COLUMN external_id;
