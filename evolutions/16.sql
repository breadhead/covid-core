ALTER TABLE claim
    ADD COLUMN aids ENUM('Нет', 'Да', 'Не знаю') DEFAULT 'Не знаю' NOT NULL;
    

#DOWN

ALTER TABLE claim
    DROP COLUMN aids;