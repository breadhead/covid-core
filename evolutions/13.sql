ALTER TABLE user
    ADD COLUMN ContactsTelegramId VARCHAR(255);

#DOWN

ALTER TABLE user
    DROP COLUMN ContactsTelegramId;
