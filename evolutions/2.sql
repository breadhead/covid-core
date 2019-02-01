ALTER TABLE company
    MODIFY COLUMN `_comment` TEXT;

ALTER TABLE feedback
    MODIFY COLUMN content TEXT;

ALTER TABLE quota
    MODIFY COLUMN `_comment` TEXT;

ALTER TABLE user
    MODIFY COLUMN description TEXT;

ALTER TABLE claim
    MODIFY COLUMN description TEXT,
    MODIFY COLUMN diagnosis TEXT,
    MODIFY COLUMN stage TEXT,
    MODIFY COLUMN otherDisease TEXT,
    MODIFY COLUMN feeling TEXT,
    MODIFY COLUMN worst TEXT,
    MODIFY COLUMN complaint TEXT,
    MODIFY COLUMN nowTreatment TEXT;

ALTER TABLE message
    MODIFY COLUMN content TEXT;

#DOWN

ALTER TABLE company
    MODIFY COLUMN `_comment` VARCHAR(255);

ALTER TABLE feedback
    MODIFY COLUMN content VARCHAR(255);

ALTER TABLE quota
    MODIFY COLUMN `_comment` VARCHAR(255):

ALTER TABLE user
    MODIFY COLUMN description VARCHAR(255);

ALTER TABLE claim
    MODIFY COLUMN description VARCHAR(255),
    MODIFY COLUMN diagnosis VARCHAR(255),
    MODIFY COLUMN stage VARCHAR(255),
    MODIFY COLUMN otherDisease VARCHAR(255),
    MODIFY COLUMN feeling VARCHAR(255),
    MODIFY COLUMN worst VARCHAR(255),
    MODIFY COLUMN complaint VARCHAR(255),
    MODIFY COLUMN nowTreatment VARCHAR(255);

ALTER TABLE message
    MODIFY COLUMN content VARCHAR(255);