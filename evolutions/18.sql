CREATE TABLE rating
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    `_ratingDate` VARCHAR(255),
    `_ratingAnswers` VARCHAR(255)
);

#DOWN
DROP TABLE rating;
