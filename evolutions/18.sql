CREATE TABLE ratingQuestions
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    `_question` VARCHAR(255)
);

#DOWN
DROP TABLE ratingQuestions;
