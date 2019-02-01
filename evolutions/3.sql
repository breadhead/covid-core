ALTER TABLE claim
    ADD `_previousStatus` ENUM(
      'new',
      'quota-allocation',
      'queue-for-quota',
      'questionnaire-waiting',
      'questionnaire-validation',
      'at-the-doctor',
      'answer-validation',
      'delivered-to-customer',
      'closed-successfully',
      'denied'
    );

#DOWN

ALTER TABLE claim
  DROP COLUMN `_previousStatus`;
