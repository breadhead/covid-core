ALTER TABLE message
    ADD `_notificated` TINYINT(4) DEFAULT '1' NOT NULL;

#DOWN

ALTER TABLE message
  DROP COLUMN `_notificated`;
