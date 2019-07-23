ALTER TABLE claim
    ADD COLUMN _situationAddedAt DATETIME,
    ADD COLUMN _claimFinishedAt DATETIME;
    
UPDATE claim SET _situationAddedAt=createdAt WHERE description IS NOT NULL;
UPDATE claim SET _claimFinishedAt=createdAt WHERE _defaultQuestions LIKE '[]';

#DOWN

ALTER TABLE claim
    DROP COLUMN _situationAddedAt,
    DROP COLUMN _claimFinishedAt;
