CREATE TABLE rating
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    `_ratingDate` DATETIME DEFAULT NULL,
    _claimId VARCHAR(255),
    CONSTRAINT FK_RATING_CLAIM FOREIGN KEY (_claimId) REFERENCES claim (id),
    _questionId VARCHAR(255),
    CONSTRAINT FK_RATING_RATINGQUESTIONS FOREIGN KEY (_questionId) REFERENCES ratingQuestions (id),
    `_answerType` VARCHAR(255),
    `_answerValue` VARCHAR(255)
);

#DOWN
DROP TABLE rating;