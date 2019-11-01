ALTER TABLE claim
    ADD COLUMN _storyPhone VARCHAR(255)
    

#DOWN

ALTER TABLE claim
    DROP COLUMN _storyPhone;
