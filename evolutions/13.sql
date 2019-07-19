ALTER TABLE claim
    ADD COLUMN _situationAddedAt DATETIME DEFAULT NOW();

#DOWN

ALTER TABLE claim
    DROP COLUMN _situationAddedAt;