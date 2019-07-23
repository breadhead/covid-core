ALTER TABLE claim
    ADD COLUMN _draftedAt DATETIME;

#DOWN

ALTER TABLE claim
    DROP COLUMN _draftedAt;