// Stores table schemas, relational comparison operators and persistance TTL values

export const STATE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours TTL
export const STORAGE_PREFIX = 'survey_admin_dt_state_';

export const SURVEY_COLUMN_NAMES = {
  0: 'Title',
  1: 'Description',
  2: 'Responses',
  3: 'Status',
  4: 'Created_at',
  5: 'Updated_at',
  6: 'Actions'
};

export const QUESTION_COLUMN_NAMES = {
  0: '#',
  1: 'Question Text',
  2: 'Type',
  3: 'Required',
  4: 'Actions'
};

export const RELATION_LABELS = {
  contains: 'contains',
  equals: 'equals',
  not_equals: 'does not equal',
  starts_with: 'starts with',
  ends_with: 'ends with',
  gt: '> (after)',
  lt: '< (before)',
  gte: '>= (on or after)',
  lte: '<= (on or before)'
};

export const SURVEY_COLUMN_TYPES = {
  all: 'all',
  0: 'text',     // Title
  1: 'text',     // Description
  2: 'number',   // Responses
  3: 'text',     // Status
  4: 'date',     // Created_at
  5: 'date'      // Updated_at
};

export const QUESTION_COLUMN_TYPES = {
  all: 'all',
  0: 'number',   // #
  1: 'text',     // Question Text
  2: 'text',     // Type
  3: 'text'      // Required
};
