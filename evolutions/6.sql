ALTER TABLE claim
    ADD COLUMN _closeComment text;

#DOWN

ALTER TABLE message
  DROP COLUMN _closeComment;
