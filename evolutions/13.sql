ALTER TABLE claim
    ADD COLUMN _situationAddedAt DATETIME DEFAULT NOW(),
    ADD COLUMN _claimFinishedAt DATETIME DEFAULT NOW();
    
UPDATE claim 
    SET _situationAddedAt=createdAt WHERE description IS NOT NULL,
    SET _claimFinishedAt=createdAt WHERE _defaultQuestions LIKE '[]';


#DOWN

ALTER TABLE claim
    DROP COLUMN _situationAddedAt,
    DROP COLUMN _claimFinishedAt;