ALTER TABLE claim
    ADD `overdueNotificated` TINYINT(1) DEFAULT '1' NOT NULL;

#DOWN

ALTER TABLE claim
    DROP COLUMN `overdueNotificated`;
