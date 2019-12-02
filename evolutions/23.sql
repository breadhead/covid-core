ALTER TABLE claim
    ADD COLUMN _dontUnderstand ENUM('Понятно', 'Непонятно', 'Не выбрано') DEFAULT 'Не выбрано' NOT NULL;

#DOWN

ALTER TABLE claim
    DROP COLUMN _dontUnderstand;