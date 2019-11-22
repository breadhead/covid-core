CREATE TABLE ratingQuestions
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    `_type` VARCHAR (255),
    `_order` INT (11),
    `_question` VARCHAR (255),
    `_hint` VARCHAR (255)
);

#DOWN
    DROP TABLE ratingQuestions;
