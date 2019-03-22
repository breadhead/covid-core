ALTER TABLE claim
    ADD COLUMN _statusChangedAt DATETIME DEFAULT NOW(),
    ADD COLUMN _isFeedbackReminderSent DATETIME DEFAULT NOW(),

#DOWN

ALTER TABLE claim
    DROP COLUMN _statusChangedAt,
    DROP COLUMN _isFeedbackReminderSent;