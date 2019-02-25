ALTER TABLE claim
    ADD COLUMN _closeComment text;

#DOWN

ALTER TABLE claim
  DROP COLUMN _closeComment;
