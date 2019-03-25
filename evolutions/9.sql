ALTER TABLE claim
    ADD COLUMN _sentToDoctorAt DATETIME DEFAULT NULL,
    ADD COLUMN _sentToClientAt DATETIME DEFAULT NULL,
    ADD COLUMN _closedAt DATETIME DEFAULT NULL,
    ADD COLUMN closedBy ENUM('client', 'case-manager', 'admin', 'doctor') DEFAULT NULL;

#DOWN

ALTER TABLE claim
    DROP COLUMN _sentToDoctorAt,
    DROP COLUMN _sentToClientAt,
    DROP COLUMN _closedAt,
    DROP COLUMN closedBy;