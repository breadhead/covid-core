CREATE TABLE story
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    _claimId VARCHAR(255),
    CONSTRAINT FK_STORY_CLAIM FOREIGN KEY (_claimId) REFERENCES claim (id),
    `createdAt` DATETIME DEFAULT NULL,
    phone VARCHAR(255),
    status ENUM('Не звонили', 'Звонили') DEFAULT 'Не звонили' NOT NULL
);

#DOWN
DROP TABLE story;