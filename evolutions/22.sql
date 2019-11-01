ALTER TABLE claim
    ADD COLUMN storyPhone VARCHAR(255)
    

#DOWN

ALTER TABLE claim
    DROP COLUMN storyPhone;
