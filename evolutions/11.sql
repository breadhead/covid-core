DROP TABLE draft;

#DOWN

CREATE TABLE draft
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    personal TINYINT(4) NOT NULL,
    `_body` JSON NOT NULL,
    authorLogin VARCHAR(255),
    CONSTRAINT FK_DRAFT_USER FOREIGN KEY (authorLogin) REFERENCES user (login)
);
CREATE INDEX FK_DRAFT_USER ON draft (authorLogin);
