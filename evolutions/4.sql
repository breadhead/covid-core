ALTER TABLE claim
    MODIFY COLUMN `_status` ENUM(
      'new',
      'quota-allocation',
      'queue-for-quota',
      'questionnaire-waiting',
      'questionnaire-validation',
      'at-the-doctor',
      'answer-validation',
      'delivered-to-customer',
      'closed-successfully',
      'denied',
      'closed-without-answer'
    );

    MODIFY COLUMN `_previousStatus` ENUM(
      'new',
      'quota-allocation',
      'queue-for-quota',
      'questionnaire-waiting',
      'questionnaire-validation',
      'at-the-doctor',
      'answer-validation',
      'delivered-to-customer',
      'closed-successfully',
      'denied',
      'closed-without-answer'
    );
#DOWN

ALTER TABLE claim
    MODIFY COLUMN `_status` ENUM(
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

    MODIFY COLUMN `_previousStatus` ENUM(
      'new',
      'quota-allocation',
      'queue-for-quota',
      'questionnaire-waiting',
      'questionnaire-validation',
      'at-the-doctor',
      'answer-validation',
      'delivered-to-customer',
      'closed-successfully',
      'denied',
      'closed-without-answer'
    );
