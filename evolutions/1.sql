CREATE TABLE company
(
    name VARCHAR(255) PRIMARY KEY NOT NULL,
    `_logo` VARCHAR(255),
    `_site` VARCHAR(255),
    `_comment` VARCHAR(255)
);


CREATE TABLE feedback
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    date DATETIME NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255),
    theme VARCHAR(255),
    content VARCHAR(255) NOT NULL
);


CREATE TABLE quota
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    createdAt DATETIME DEFAULT '2018-10-21 13:00:00' NOT NULL,
    `_publicCompany` TINYINT(4) NOT NULL,
    `_comment` VARCHAR(255) NOT NULL,
    `_balance` INT(11) NOT NULL,
    `_name` VARCHAR(500) NOT NULL,
    `_constraints` TEXT NOT NULL,
    `_corporate` TINYINT(4) NOT NULL,
    CompanyName VARCHAR(255),
    CONSTRAINT FK_QUOTA_COMPANY FOREIGN KEY (CompanyName) REFERENCES company (name)
);
CREATE INDEX FK_QUOTA_COMPANY ON quota (CompanyName);
CREATE UNIQUE INDEX IDX_QUOTA_NAME ON quota (`_name`);


CREATE TABLE income
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount INT(11) NOT NULL,
    date DATETIME NOT NULL,
    targetId VARCHAR(255),
    payerName VARCHAR(255),
    CONSTRAINT FK_INCOME_QUOTA FOREIGN KEY (targetId) REFERENCES quota (id),
    CONSTRAINT FK_INCOME_COMPANY FOREIGN KEY (payerName) REFERENCES company (name)
);
CREATE INDEX FK_INCOME_QUOTA ON income (targetId);
CREATE INDEX FK_INCOME_COMPANY ON income (payerName);


CREATE TABLE transfer
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount INT(11) NOT NULL,
    date DATETIME NOT NULL,
    sourceId VARCHAR(255),
    targetId VARCHAR(255),
    CONSTRAINT FK_TRANSFER_QUOTA_SOURCE FOREIGN KEY (sourceId) REFERENCES quota (id),
    CONSTRAINT FK_TRANSFER_QUOTA_TARGET FOREIGN KEY (targetId) REFERENCES quota (id)
);
CREATE INDEX FK_TRANSFER_QUOTA_SOURCE ON transfer (sourceId);
CREATE INDEX FK_TRANSFER_QUOTA_TARGET ON transfer (targetId);


CREATE TABLE user
(
    login VARCHAR(255) PRIMARY KEY NOT NULL,
    `_verificationCode` VARCHAR(255),
    `_roles` TEXT NOT NULL,
    `_valid` TINYINT(4) DEFAULT '0' NOT NULL,
    ContactsPhone VARCHAR(255),
    ContactsEmail VARCHAR(255),
    PasswordCredentialsPassword VARCHAR(255),
    NenaprasnoCabinetCredentialsId INT(11),
    fullName VARCHAR(255),
    description VARCHAR(255),
    boardUsername VARCHAR(255)
);


CREATE TABLE draft
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    personal TINYINT(4) NOT NULL,
    `_body` JSON NOT NULL,
    authorLogin VARCHAR(255),
    CONSTRAINT FK_DRAFT_USER FOREIGN KEY (authorLogin) REFERENCES user (login)
);
CREATE INDEX FK_DRAFT_USER ON draft (authorLogin);


CREATE TABLE claim
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    description VARCHAR(255),
    diagnosis VARCHAR(255),
    stage VARCHAR(255),
    otherDisease VARCHAR(255),
    feeling VARCHAR(255),
    worst VARCHAR(255),
    complaint VARCHAR(255),
    nowTreatment VARCHAR(255),
    `_status` ENUM('new', 'quota-allocation', 'queue-for-quota', 'questionnaire-waiting', 'questionnaire-validation', 'at-the-doctor', 'answer-validation', 'delivered-to-customer', 'closed-successfully', 'denied') NOT NULL,
    `_due` DATETIME,
    `_relativesDiseases` JSON NOT NULL,
    `_medicinalTreatments` JSON NOT NULL,
    `_radiationTreatments` JSON NOT NULL,
    `_surgicalTreatments` JSON NOT NULL,
    authorLogin VARCHAR(255),
    QuotaId VARCHAR(255),
    CorporateInfoName VARCHAR(255),
    CorporateInfoPosition VARCHAR(255),
    AnalysisOther JSON NOT NULL,
    AnalysisHistologyTitle VARCHAR(255),
    AnalysisHistologyUrl VARCHAR(255),
    AnalysisDischargeTitle VARCHAR(255),
    AnalysisDischargeUrl VARCHAR(255),
    diagnosisDate DATETIME,
    `_defaultQuestions` JSON NOT NULL,
    `_additionalQuestions` JSON NOT NULL,
    createdAt DATETIME,
    `_theme` VARCHAR(255) NOT NULL,
    `_localization` VARCHAR(255),
    `_target` ENUM('Для себя', 'Для близкого человека', 'Для подопечного Фонда') DEFAULT 'Для себя' NOT NULL,
    ApplicantName VARCHAR(255) NOT NULL,
    ApplicantAge INT(11) NOT NULL,
    ApplicantGender ENUM('Мужской', 'Женский', 'Небинарный', 'Неизвестный') DEFAULT 'Неизвестный' NOT NULL,
    ApplicantRegion VARCHAR(255) NOT NULL,
    number INT(11) NOT NULL,
    DoctorLogin VARCHAR(255),
    CONSTRAINT FK_CLAIM_USER FOREIGN KEY (authorLogin) REFERENCES user (login),
    CONSTRAINT FK_CLAIM_QUOTA FOREIGN KEY (QuotaId) REFERENCES quota (id),
    CONSTRAINT FK_CLAIM_DOCTOR FOREIGN KEY (DoctorLogin) REFERENCES user (login)
);
CREATE INDEX FK_CLAIM_QUOTA ON claim (QuotaId);
CREATE INDEX FK_CLAIM_USER ON claim (authorLogin);
CREATE INDEX FK_CLAIM_DOCTOR ON claim (DoctorLogin);


CREATE TABLE message
(
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    date DATETIME NOT NULL,
    content VARCHAR(255) NOT NULL,
    claimId VARCHAR(255),
    userLogin VARCHAR(255),
    CONSTRAINT FK_MESSAGE_CLAIM FOREIGN KEY (claimId) REFERENCES claim (id),
    CONSTRAINT FK_MESSAGE_USER FOREIGN KEY (userLogin) REFERENCES user (login)
);
CREATE INDEX FK_MESSAGE_USER ON message (userLogin);
CREATE INDEX FK_MESSAGE_CLAIM ON message (claimId);


#DOWN


DROP TABLE message;
DROP TABLE claim;
DROP TABLE draft;
DROP TABLE user;
DROP TABLE transfer;
DROP TABLE income;
DROP TABLE quota;
DROP TABLE feedback;
DROP TABLE company;