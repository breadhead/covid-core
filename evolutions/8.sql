ALTER TABLE claim
    ADD COLUMN _editedAt DATETIME DEFAULT NOW(),
    ADD COLUMN _answeredAt DATETIME DEFAULT NOW(),
    ADD COLUMN _answerUpdatedAt DATETIME DEFAULT NOW();

#DOWN

ALTER TABLE claim
    DROP COLUMN _editedAt,
    DROP COLUMN _answeredAt,
    DROP COLUMN _answerUpdatedAt;