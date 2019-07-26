ALTER TABLE claim
    ADD COLUMN aids ENUM('Нет', 'Да', 'Не знаю');
    

#DOWN

ALTER TABLE claim
    DROP COLUMN aids;
