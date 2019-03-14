ALTER TABLE claim
    ADD COLUMN corporateStatus ENUM('empty', 'checking', 'ok', 'fail') DEFAULT 'empty';

#DOWN

ALTER TABLE claim
  DROP COLUMN corporateStatus;
