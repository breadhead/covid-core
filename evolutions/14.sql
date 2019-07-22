SAVEPOINT claim_steps;
UPDATE claim SET _situationAddedAt=createdAt WHERE description IS NOT NULL;
UPDATE claim SET _claimFinishedAt=createdAt WHERE _defaultQuestions LIKE '[]';


#DOWN
ROLLBACK TO claim_steps;

