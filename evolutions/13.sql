ALTER TABLE claim
    ADD COLUMN _situationAddedAt DATETIME DEFAULT NOW(),
    ADD COLUMN _claimFinishedAt DATETIME DEFAULT NOW();
    

#DOWN

ALTER TABLE claim
    DROP COLUMN _situationAddedAt,
    DROP COLUMN _claimFinishedAt;