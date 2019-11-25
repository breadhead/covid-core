ALTER TABLE claim
    ADD COLUMN _doctors JSON
    

#DOWN

ALTER TABLE claim
    DROP COLUMN _doctors;

