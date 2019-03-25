ALTER TABLE claim
    ADD COLUMN _isFeedbackReminderSent DATETIME DEFAULT NOW(),

#DOWN

ALTER TABLE claim
    DROP COLUMN _isFeedbackReminderSent;