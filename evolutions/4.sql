ALTER TABLE message
    ADD `_notificated` TINYINT(1) DEFAULT '1' NOT NULL;

#DOWN

ALTER TABLE message
  DROP COLUMN `_notificated`;
